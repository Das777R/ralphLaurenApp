import jwt from 'jsonwebtoken';

const { maxAge, ...clearCookieOptions } = refreshCookieOptions;

export const refreshController = async (req, res) => {
  try {
    const token = req.cookies?.adminRefreshToken;
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

    const account = await Admin.findById(payload.id);
    if (!account || account.role !== "admin") {
      return res.status(403).json({ message: "Admin access only", success: false });
    }

    return res.status(200).json({
      message: "Session restored",
      data: { user: safeUser(account), accessToken: generateAccessToken(account) },
      success: true
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export const logoutController = async (req, res) => {
  try {
    const token = req.cookies?.adminRefreshToken;
    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    res.clearCookie("adminRefreshToken", clearCookieOptions);

    return res.status(200).json({ message: "Admin successfully logged out", success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};