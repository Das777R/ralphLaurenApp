import jwt from 'jsonwebtoken';
import Admin from '../schema/AdminAuth.schema.js';
import RefreshToken from '../schema/RefreshToken.schema.js';
import OrderList from '../schema/Order.schema.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required!!" }),
  email: z.email({ message: "Invalid Email Format" }).trim(),
  password: z.string().trim().min(8, { message: "Password must be at least 8 characters long" })
});

const logInSchema = z.object({
  email: z.email({ message: "Invalid Email Format" }).trim(),
  password: z.string().trim().min(1, { message: "Password is required" })
});

const orderSchema = z.object({
  products: z.array(z.any()).min(1, { message: "Order has no products" }),
  addressName: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.email().trim(),
  country: z.string().trim().min(1),
  address1: z.string().trim().min(1),
  address2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  postcode: z.string().trim().min(1),
  mobileNumber: z.string().trim().min(1),
  deliveryDate: z.coerce.date()
});

const COOKIE_NAME = 'refreshTokenForAdmin';

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

// clearCookie must use the same attributes the cookie was set with
const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
};

const safeUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role
});

export const signupController = async (req, res) => {
  try {
    const validate = signUpSchema.safeParse(req.body);
    if (!validate.success) {
      return res.status(400).json({
        message: "Validation failed",
        success: false
      });
    }

    const { name, email, password } = validate.data;
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "User already has an account",
        success: false
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await Admin.create({
      name,
      email,
      password: hashPassword,
      role: "admin"
    });

    return res.status(201).json({
      message: "Account successfully created",
      data: { user: safeUser(newUser) },
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const validate = logInSchema.safeParse(req.body);
    if (!validate.success) {
      return res.status(400).json({
        message: "Validation failed",
        success: false
      });
    }

    const { email, password } = validate.data;

    const account = await Admin.findOne({ email });
    if (!account) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false
      });
    }

    const passwordMatches = await bcrypt.compare(password, account.password);
    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false
      });
    }

    if (account.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
        success: false
      });
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

    res.cookie(COOKIE_NAME, refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: 'Login successful',
      data: {
        user: safeUser(account),
        accessToken
      },
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

export const ordersOfUsers = async (req, res) => {
  try {
    const validate = orderSchema.safeParse(req.body);

    if (!validate.success) {
      return res.status(400).json({
        message: "Order info is incomplete!!",
        success: false
      });
    }

    const order = await OrderList.create(validate.data);

    return res.status(201).json({
      message: "Order successfully placed!!",
      data: order,
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderList.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All the Orders from our store",
      data: orders,
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

export const getLoggedInAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({
        message: "Not able to process the adminId",
        success: false
      });
    }

    const isAdmin = await Admin.findById(adminId);

    if (!isAdmin) {
      return res.status(404).json({
        message: "Admin not found.",
        success: false
      });
    }

    const getInitials = (name) => {
      if (!name) return "";
      return name
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    };

    return res.status(200).json({
      message: "Admin info found",
      data: { name: isAdmin.name, initials: getInitials(isAdmin.name) },
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

export const getTokenController = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(200).json({ message: "No session", success: false });
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

    const account = await Admin.findById(payload.id);
    if (!account || account.role !== 'admin') {
      return res.status(401).json({ message: "Invalid session", success: false });
    }

    return res.status(200).json({
      message: "New access token issued for admin",
      data: {
        accessToken: generateAccessToken(account),
        userId: account._id,
        role: account.role
      },
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

export const adminLogoutController = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    res.clearCookie(COOKIE_NAME, clearCookieOptions);

    return res.status(200).json({
      message: "Admin successfully logged out",
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false
    });
  }
};