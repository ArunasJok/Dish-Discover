// Routes for saving, fetching, and rating recipes for the authenticated user
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authenticationMiddleware');
const Recipe = require('../models/Recipe');

// POST /api/recipes/save. Save a recipe to the user's profile
router.post('/save', verifyToken, async (req, res) => {
  try {
    const { spoonacularId, title, image, usedIngredients, missedIngredients, likes, details } = req.body;
    // Check if the recipe is already saved by this user
    let recipe = await Recipe.findOne({ spoonacularId, user: req.user.userId });
    if (recipe) {
      return res.status(200).json({ message: 'Recipe already saved', recipe });
    }
    recipe = new Recipe({
      spoonacularId,
      title,
      image,
      usedIngredients,
      missedIngredients,
      likes,
      details,
      user: req.user.userId,
      rating: 0,
      ratingCount: 0
    });
    await recipe.save();
    res.status(201).json({ message: 'Recipe saved successfully', recipe });
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// GET /api/recipes/my
// Get all saved recipes for the authenticated user
router.get('/my', verifyToken, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.userId });
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
});

// PUT /api/recipes/rate/:id
// Update a recipe's rating
router.put('/rate/:id', verifyToken, async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { rating } = req.body; // Expected rating value (e.g., 1-5)
    const recipe = await Recipe.findOne({ _id: recipeId, user: req.user.userId });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    // Update rating using a simple average formula
    const totalRating = recipe.rating * recipe.ratingCount + rating;
    recipe.ratingCount += 1;
    recipe.rating = totalRating / recipe.ratingCount;
    await recipe.save();
    res.json({ message: 'Rating updated', recipe });
  } catch (error) {
    console.error('Error rating recipe:', error);
    res.status(500).json({ error: 'Failed to rate recipe' });
  }
});

module.exports = router;
