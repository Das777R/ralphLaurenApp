import jwt from 'jsonwebtoken';
import Admin from '../schema/AdminAuth.schema.js';

// Verifies the access token AND re-checks the admin in the DB,
// so deleted or demoted admins lose access immediately.
export const verifyAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Authentication required', success: false });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
      // 401 lets the frontend interceptor try a refresh
      return res.status(401).json({ message: 'Invalid or expired token', success: false });
    }

    const admin = await Admin.findById(payload.id).select('_id role');
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only', success: false });
    }

    req.admin = { id: String(admin._id), role: admin.role };
    next();
  } catch (err) {
    console.error('verifyAdmin error:', err);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};