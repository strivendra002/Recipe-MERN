import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/User.js';

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
    console.error('Error fetching recipe details:', error);
    res.status(500).json({ message: 'Failed to fetch recipe details' });
  }
});
// 🟢 Fetch Recipe Recommendations Based on User Preferences
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { cuisines, dietaryRestrictions } = user.preferences;

    // Convert preferences into a query string
    const cuisineQuery = cuisines?.length ? `&cuisine=${cuisines.join(',')}` : '';
    const dietQuery = dietaryRestrictions?.length ? `&diet=${dietaryRestrictions.join(',')}` : '';

    // Fetch recipes based on preferences
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?number=10&apiKey=${process.env.SPOONACULAR_API_KEY}${cuisineQuery}${dietQuery}`
    );

    res.json(response.data.results);
  } catch (error) {
    console.error("❌ Error fetching recommendations:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



export default router;
