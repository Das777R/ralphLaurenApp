import jwt from "jsonwebtoken";
import razorpay from '../utils/razorpay.js';

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token", success: false });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only", success: false });
  }
  next();
};

export const isOwner = (req, res, next) => {
  if (req.user?.id !== req.params.userId) {
    return res.status(403).json({ message: "Forbidden", success: false });
  }
  next();
};



export const paymentForOrder = async (req,res,next) => {
  try{
    const {products} = req.body;
    const totalAmount = products.reduce((i,e) => e.price + i,0);
    const options = {
    amount: totalAmount,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    notes: JSON.stringify(products),
    }

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
    next();
  }
    catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Could not create order' });
  }
  }

