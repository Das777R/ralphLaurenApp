import crypto from 'crypto';
import UserAccount from '../schema/AuthSignIn.schema.js';
import RefreshToken from '../schema/RefreshToken.schema.js';
import OrderList from '../schema/Order.schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { generateAccessToken,
         generateRefreshToken } from '../utils/token.js';
import razorpayInstance from '../utils/razorpay.js';

const signUpSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required!!" }),
  email: z.string().trim().pipe(z.email({ message: "Invalid Email Format" })),
  password: z.string().trim().min(8, { message: "Password must be at least 8 characters long" })
});

const logInSchema = z.object({
  email: z.string().trim().pipe(z.email({ message: "Invalid Email Format" })),
  password: z.string().trim().min(1, { message: "Password is required" })
});

const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const orderSchema = z.object({
  products: z.array(z.any()).min(1, { message: 'Order has no products' }),
  addressName: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().pipe(z.email()),
  country: z.string().trim().min(1),
  address1: z.string().trim().min(1),
  address2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  postcode: z.string().trim().min(1),
  mobileNumber: z.string().trim().min(1),
  deliveryDate: z.coerce.date(),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional()
});

const { maxAge, ...clearCookieOptions } = refreshCookieOptions;

const safeUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  bag: u.bag
});

const serverError = (res, err) =>
  res.status(500).json({ message: err.message, success: false });

export const signupController = async (req, res) => {
  try {
    const validate = signUpSchema.safeParse(req.body);
    if (!validate.success) {
      return res.status(400).json({ message: "Validation failed", success: false });
    }

    const { name, email, password } = validate.data;

    const existing = await UserAccount.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already has an account", success: false });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await UserAccount.create({
      name,
      email,
      password: hashPassword,
      role: "user"
    });

    return res.status(201).json({
      message: "Account successfully created",
      data: { user: safeUser(newUser) },
      success: true
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const loginController = async (req, res) => {
  try {
    const validate = logInSchema.safeParse(req.body);
    if (!validate.success) {
      return res.status(400).json({ message: "Validation failed", success: false });
    }

    const { email, password } = validate.data;
    const { localBag } = req.body;

    const account = await UserAccount.findOne({ email });
    if (!account) {
      return res.status(401).json({ message: "Invalid email or password", success: false });
    }

    const passwordMatches = await bcrypt.compare(password, account.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password", success: false });
    }

    if (Array.isArray(localBag) && localBag.length > 0) {
      account.bag = [...account.bag, ...localBag];
      await account.save();
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    const accessToken = generateAccessToken(account);
    const refreshToken = generateRefreshToken(account);

    await RefreshToken.create({
      userId: account._id,
      token: refreshToken,
      expirationDate
    });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "User successfully logged in",
      data: { user: safeUser(account), accessToken },
      success: true
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No session", success: false });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid session", success: false });
    }

    const stored = await RefreshToken.findOne({ userId: payload.id, token });
    if (!stored) {
      return res.status(401).json({ message: "Session expired", success: false });
    }

    const account = await UserAccount.findById(payload.id);
    if (!account) {
      return res.status(401).json({ message: "Invalid session", success: false });
    }

    return res.status(200).json({
      message: "New access token issued for user",
      data: { accessToken: generateAccessToken(account), userId: account._id, role: "user" },
      success: true
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const getCustomer = async (req, res) => {
  try {
    const customers = await UserAccount.find({}).select("-password").lean();

    return res.status(200).json({
      message: "Customers found",
      count: customers.length,
      data: customers,
      success: true
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const getUserBag = async (req, res) => {
  try {
    const account = await UserAccount.findById(req.params.userId);
    if (!account) {
      return res.status(404).json({ message: "User doesn't have an account!", success: false });
    }

    return res.status(200).json({
      message: "Found the user's account",
      data: safeUser(account),
      success: true
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const putUserProductsOnBag = async (req, res) => {
  try {
    const { userBag } = req.body;

    if (!Array.isArray(userBag)) {
      return res.status(400).json({ message: "userBag must be an array", success: false });
    }

    const account = await UserAccount.findByIdAndUpdate(
      req.params.userId,
      { $set: { bag: userBag } },
      { returnDocument: "after" }
    );

    if (!account) {
      return res.status(404).json({ message: "User not found!", success: false });
    }

    return res.status(200).json({
      message: "Bag saved",
      data: safeUser(account),
      success: true
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const deleteFromBag = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { size } = req.body;

    const account = await UserAccount.findByIdAndUpdate(
      userId,
      { $pull: { bag: { productId, size } } },
      { returnDocument: "after" }
    );

    if (!account) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    return res.status(200).json({
      message: "Bag product successfully deleted",
      data: safeUser(account),
      success: true
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const updateQtyOfTheProduct = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { updatedQty, size } = req.body;

    const account = await UserAccount.findOneAndUpdate(
      { _id: userId, bag: { $elemMatch: { productId, size } } },
      { $set: { "bag.$.qty": Number(updatedQty) } },
      { returnDocument: "after" }
    );

    if (!account) {
      return res.status(404).json({
        message: "User's account or specific product variant does not exist",
        success: false
      });
    }

    return res.status(200).json({
      message: "Qty updated",
      data: safeUser(account),
      success: true
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const deleteUserBag = async (req, res) => {
  try {
    const account = await UserAccount.findByIdAndUpdate(
      req.params.userId,
      { $set: { bag: [] } },
      { returnDocument: "after" }
    );

    if (!account) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    return res.status(200).json({ message: "Bag successfully removed!!", success: true });
  } catch (err) {
    return serverError(res, err);
  }
};

export const ordersOfUsers = async (req, res) => {
  try {
    const parsed = orderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Order info is incomplete!!', success: false });
    }

    const order = await OrderList.create(parsed.data);
    return res.status(201).json({ message: 'Order successfully placed!!', data: order, success: true });
  } catch (err) {
    return serverError(res, err);
  }
};

export const createOrderController = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Can't order empty bag",
        success: false
      });
    }

    // Total in rupees, assuming each bag item has numeric `price` and `qty`.
    // Better: look prices up from your Product collection by productId.
    const totalRupees = products.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.qty || 1);
    }, 0);

    if (!Number.isFinite(totalRupees) || totalRupees <= 0) {
      return res.status(400).json({
        message: 'Invalid order amount',
        success: false
      });
    }

    const options = {
      amount: Math.round(totalRupees * 100), // Razorpay needs paise (integer)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { itemCount: String(products.length) }
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      data: order,
      success: true
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ success: false, message: 'Could not create order' });
  }
};

export const verifyPaymentController = (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: 'Payment failed or was cancelled',
        success: false
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const expected = Buffer.from(expectedSignature);
    const received = Buffer.from(razorpay_signature);

    // timingSafeEqual throws if lengths differ, so check first
    const isValid =
      expected.length === received.length &&
      crypto.timingSafeEqual(expected, received);

    if (!isValid) {
      return res.status(400).json({
        message: 'Invalid payment signature',
        success: false
      });
    }

    return res.status(200).json({
      message: 'Payment verified',
      data: { orderId: razorpay_order_id, paymentId: razorpay_payment_id },
      success: true
    });
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({
      message: 'Payment verification failed',
      success: false
    });
  }
};