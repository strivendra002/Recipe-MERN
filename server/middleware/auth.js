import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// 🛡 Middleware to Protect Routes using JWT
export const ensureAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach it to req
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
