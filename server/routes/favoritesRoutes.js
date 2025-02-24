import express from 'express';
import User from '../models/User.js';
import { ensureAuth } from '../middleware/auth.js';

const router = express.Router();

// 🟢 Get User's Favorite Recipes
router.get('/', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🟢 Add Recipe to Favorites
router.post('/add', ensureAuth, async (req, res) => {
  try {
    const { id, title, image } = req.body;
    const user = await User.findById(req.user.id);

    // Check if the recipe is already in favorites
    if (user.favorites.some((fav) => fav.id === id)) {
      return res.status(400).json({ message: 'Recipe already in favorites' });
    }

    user.favorites.push({ id, title, image });
    await user.save();
    res.json({ message: 'Recipe added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🟢 Remove Recipe from Favorites
router.delete('/remove/:id', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter((fav) => fav.id !== Number(req.params.id));
    await user.save();
    res.json({ message: 'Recipe removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
