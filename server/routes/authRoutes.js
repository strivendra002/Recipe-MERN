import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ensureAuth } from '../middleware/auth.js'; // ✅ Single Auth Middleware
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ✅ User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if User Exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ✅ User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // 🟢 Generate Access Token (Short Expiry)
    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });

    // 🟢 Generate Refresh Token (Long Expiry)
    const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    // 🟢 Store Refresh Token in HTTP-Only Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ✅ Logout User (Client Removes Token)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// ✅ Get Current Authenticated User
router.get('/user', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('❌ Fetch User Error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
