import express from 'express';
import User from '../models/User.js';
import { ensureAuth } from '../middleware/auth.js';

const router = express.Router();

// ✅ GET Authenticated User Profile
router.get('/profile', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ UPDATE User Preferences
router.put('/preferences', ensureAuth, async (req, res) => {
  try {
    console.log('🔹 Received Preferences Update:', req.body);

    const { cuisines, dietaryRestrictions } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user preferences
    user.preferences.cuisines = cuisines || [];
    user.preferences.dietaryRestrictions = dietaryRestrictions || [];
    await user.save();

    res.json({ message: 'Preferences updated', preferences: user.preferences });
  } catch (error) {
    console.error('❌ Error updating preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ UPDATE User Avatar
router.put('/avatar', ensureAuth, async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatar = avatar; // ✅ Save new avatar URL
    await user.save();

    res.json({ message: 'Avatar updated!', avatar: user.avatar });
  } catch (error) {
    console.error('❌ Error updating avatar:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/preferences', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('preferences');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
