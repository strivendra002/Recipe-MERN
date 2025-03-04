import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { ensureAuth } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();

// 🟢 Get Recipe Details by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}&includeNutrition=true`
    );

    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching recipe details:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch recipe details' });
  }
});

// 🟢 Fetch Recipe Recommendations Based on User Preferences (JWT Protected)
router.get('/recommendations', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // ✅ Fix user lookup
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { cuisines, dietaryRestrictions } = user.preferences || {};

    const cuisineQuery = cuisines?.length ? `&cuisine=${cuisines.join(',')}` : '';
    const dietQuery = dietaryRestrictions?.length ? `&diet=${dietaryRestrictions.join(',')}` : '';

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?number=10&apiKey=${process.env.SPOONACULAR_API_KEY}${cuisineQuery}${dietQuery}`
    );

    const recipes = response.data.results || response.data.recipes || [];
    res.json(recipes);
  } catch (error) {
    console.error('❌ Error fetching recommendations:', error.response?.data || error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;
