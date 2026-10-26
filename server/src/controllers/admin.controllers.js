import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import Admin from '../schema/AdminAuth.schema.js';
import RefreshToken from '../schema/RefreshToken.schema.js';
import OrderList from '../schema/Order.schema.js';
import UserAccount from "../schema/AuthSignIn.schema.js";
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

/* ---------- validation ---------- */
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ message: 'Invalid Email Format' }));

const signUpSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required!!' }),
  email: emailField,
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  inviteCode: z.string().min(1, { message: 'Invite code is required' }),
});

const logInSchema = z.object({
  email: emailField,
  password: z.string().min(1, { message: 'Password is required' }),
});

const orderSchema = z.object({
  products: z.array(z.any()).min(1, { message: 'Order has no products' }),
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
  deliveryDate: z.coerce.date(),
});

/* ---------- helpers ---------- */
const COOKIE_NAME = 'refreshTokenForAdmin';
const isProd = process.env.NODE_ENV === 'production';

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// clearCookie must use the same attributes the cookie was set with
const clearCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax',
  path: '/',
};

// Compared against when the email doesn't exist, so response time doesn't reveal valid emails
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const safeUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

const fail = (res, status, message) => res.status(status).json({ message, success: false });

const serverError = (res, err) => {
  console.error(err);
  return fail(res, 500, 'Something went wrong. Please try again.');
};

// constant-time comparison for secrets
const safeEqual = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

/* ---------- auth ---------- */
export const signupController = async (req, res) => {
  try {
    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 400, parsed.error.issues[0]?.message || 'Validation failed');
    }

    const { name, email, password, inviteCode } = parsed.data;

    // Admin accounts can only be created by someone who holds the invite code
    const expected = process.env.ADMIN_INVITE_CODE;
    if (!expected || !safeEqual(inviteCode, expected)) {
      return fail(res, 403, 'Invalid invite code');
    }

    const existing = await Admin.findOne({ email });
    if (existing) return fail(res, 409, 'User already has an account');

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await Admin.create({ name, email, password: hashPassword, role: 'admin' });

    return res.status(201).json({
      message: 'Account successfully created',
      data: { user: safeUser(newUser) },
      success: true,
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const loginController = async (req, res) => {
  try {
    const parsed = logInSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 400, parsed.error.issues[0]?.message || 'Validation failed');
    }

    const { email, password } = parsed.data;

    const account = await Admin.findOne({ email });
    const passwordMatches = await bcrypt.compare(password, account?.password || DUMMY_HASH);

    if (!account || !passwordMatches) {
      return fail(res, 401, 'Invalid email or password');
    }
    if (account.role !== 'admin') {
      return fail(res, 403, 'Admin access only');
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    const accessToken = generateAccessToken(account);
    const refreshToken = generateRefreshToken(account);

    await RefreshToken.create({ userId: account._id, token: refreshToken, expirationDate });

    res.cookie(COOKIE_NAME, refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: 'Login successful',
      data: { user: safeUser(account), accessToken },
      success: true,
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const getTokenController = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      return res.status(200).json({ message: 'No session', success: false });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return fail(res, 401, 'Invalid session');
    }

    const stored = await RefreshToken.findOne({ userId: payload.id, token });
    if (!stored) return fail(res, 401, 'Session expired');

    if (stored.expirationDate && stored.expirationDate < new Date()) {
      await RefreshToken.deleteOne({ _id: stored._id });
      return fail(res, 401, 'Session expired');
    }

    const account = await Admin.findById(payload.id);
    if (!account || account.role !== 'admin') {
      return fail(res, 401, 'Invalid session');
    }

    return res.status(200).json({
      message: 'New access token issued for admin',
      data: {
        accessToken: generateAccessToken(account),
        userId: account._id,
        role: account.role,
      },
      success: true,
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const adminLogoutController = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (token) await RefreshToken.deleteOne({ token });

    res.clearCookie(COOKIE_NAME, clearCookieOptions);
    return res.status(200).json({ message: 'Admin successfully logged out', success: true });
  } catch (err) {
    return serverError(res, err);
  }
};

/* ---------- protected (router applies verifyAdmin before these) ---------- */
export const getLoggedInAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!mongoose.isValidObjectId(adminId)) return fail(res, 400, 'Invalid admin id');
    // An admin may only read their own profile
    if (adminId !== req.admin.id) return fail(res, 403, 'Forbidden');

    const admin = await Admin.findById(adminId).select('name');
    if (!admin) return fail(res, 404, 'Admin not found.');

    const initials = admin.name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    return res.status(200).json({
      message: 'Admin info found',
      data: { name: admin.name, initials },
      success: true,
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderList.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      message: 'All the Orders from our store',
      data: orders,
      success: true,
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) return fail(res, 400, 'Invalid order id');

    const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) return fail(res, 400, 'Invalid status');

    const existing = await OrderList.findById(id);
    if (!existing) return fail(res, 404, 'Order not found');

    existing.status = status;
    if (status === 'Cancelled' && existing.payment === 'Paid') {
      existing.payment = 'Refunded';
    }
    await existing.save();

    return res.status(200).json({ message: 'Status updated', data: existing, success: true });
  } catch (err) {
    return serverError(res, err);
  }
};

/* ---------- public: placing an order (move to your USER router, behind user auth) ---------- */
export const ordersOfUsers = async (req, res) => {
  try {
    const parsed = orderSchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'Order info is incomplete!!');

    const order = await OrderList.create(parsed.data);
    return res.status(201).json({ message: 'Order successfully placed!!', data: order, success: true });
  } catch (err) {
    return serverError(res, err);
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    // Never send password hashes to the client
    const customers = await UserAccount.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: 'All customers',
      data: customers,
      success: true,
    });
  } catch (err) {
    return serverError(res, err);
  }
};