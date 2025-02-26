import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const ensureAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // ✅ Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    console.log("🔹 Received Token:", token); // Debugging

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    console.log("✅ Token Verified:", decoded);
    next();
  } catch (error) {
    console.error("❌ JWT Authentication Error:", error.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
