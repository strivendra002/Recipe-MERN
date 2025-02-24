import express from 'express';
import User from '../models/User.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// GET User Profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// UPDATE User Preferences
router.put('/:id', async (req, res) => {
  try {
    const { cuisines, dietaryRestrictions } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update preferences
    user.preferences.cuisines = cuisines || user.preferences.cuisines;
    user.preferences.dietaryRestrictions =
      dietaryRestrictions || user.preferences.dietaryRestrictions;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
// Update user avatar
router.put('/:id/avatar', upload.single('avatar'), async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Remove old avatar if exists
      if (user.avatar) {
        const publicId = user.avatar.split('/').pop().split('.')[0]; // Extract public ID
        await cloudinary.uploader.destroy(`recipe-app/avatars/${publicId}`);
      }
      user.avatar = req.file.path;
    await user.save();
    res.json({ message: 'Profile picture updated', avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
router.put('/preferences', async (req, res) => {
  try {
    console.log("🔹 Received Preferences Update Request:", req.body); // Debugging
    console.log("🔹 User:", req.user); // Check if user session exists

    const { cuisines, dietaryRestrictions } = req.body;
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user session' });
    }

    // Find the user in the database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user preferences
    user.preferences.cuisines = cuisines || [];
    user.preferences.dietaryRestrictions = dietaryRestrictions || [];
    await user.save();

    console.log("✅ Preferences Updated Successfully!");
    res.json({ message: 'Preferences updated', preferences: user.preferences });

  } catch (error) {
    console.error('❌ Server error updating preferences:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


export default router;
