import express from 'express';
import User from '../models/User.js';
import upload from '../middleware/upload.js';
import { ensureAuth } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js'; // Ensure Cloudinary is imported

const router = express.Router();

// 🟢 GET Authenticated User Profile
router.get('/', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 🟢 UPDATE User Preferences
router.put('/preferences', ensureAuth, async (req, res) => {
  try {
    console.log('🔹 Received Preferences Update Request:', req.body);

    const { cuisines, dietaryRestrictions } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.preferences) user.preferences = {}; // Ensure preferences exist
    user.preferences.cuisines = cuisines || user.preferences.cuisines || [];
    user.preferences.dietaryRestrictions = dietaryRestrictions || user.preferences.dietaryRestrictions || [];

    await user.save();

    console.log('✅ Preferences Updated Successfully!');
    res.json({ message: 'Preferences updated', preferences: user.preferences });
  } catch (error) {
    console.error('❌ Error updating preferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 🟢 UPDATE User Avatar
router.put('/avatar', ensureAuth, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 🔹 Remove old avatar if it exists
    if (user.avatar) {
      try {
        const publicId = user.avatar.split('/').slice(-1)[0].split('.')[0]; // Extract public ID
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudError) {
        console.error('⚠️ Cloudinary deletion error:', cloudError);
      }
    }

    // 🔹 Update new avatar
    user.avatar = req.file.path;
    await user.save();

    res.json({ message: 'Profile picture updated!', avatar: user.avatar });
  } catch (error) {
    console.error('❌ Error uploading avatar:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
