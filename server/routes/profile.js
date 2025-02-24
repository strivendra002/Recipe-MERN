import express from 'express';
import User from '../models/User.js';
import { ensureAuth } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/', ensureAuth, async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar, preferences },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
