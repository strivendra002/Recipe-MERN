import express from 'express';
import User from '../models/User.js';
import { ensureAuth } from '../middleware/auth.js';

const router = express.Router();

// 🟢 Get Authenticated User Profile
router.get('/', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 🟢 Update User Profile
router.put('/', ensureAuth, async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only update fields that are provided
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    // Merge preferences instead of replacing them entirely
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
