import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import {
  signupController,
  loginController,
  getTokenController,
  adminLogoutController,
  getLoggedInAdmin,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers
} from '../controllers/admin.controllers.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, try again later', success: false },
});

// ---- public ----
router.post('/auth/signup', authLimiter, signupController);
router.post('/auth/login', authLimiter, loginController);
router.post('/token', getTokenController);
router.post('/logout', adminLogoutController);

// ---- everything below requires a valid admin ----
router.use(verifyAdmin);
router.get('/me/:adminId', getLoggedInAdmin);
router.get('/orders', getAllOrders);
router.get('/customers', getAllCustomers);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;