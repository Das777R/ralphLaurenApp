import jwt from "jsonwebtoken";

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