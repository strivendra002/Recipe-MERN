import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// 🛡 Middleware to Protect Routes using JWT
export const ensureAuth = async (req, res, next) => {
  try {
    // Extract JWT token from Authorization Header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find User & Attach to req (Without Password)
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    next(); // Proceed to Next Middleware
  } catch (error) {
    console.error('❌ JWT Authentication Error:', error.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
