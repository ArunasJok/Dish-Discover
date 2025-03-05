const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authenticationMiddleware');
const { getRecipesByIngredients, getRecipeInformation } = require('../services/spoonacularService');
const SearchHistory = require('../models/SearchHistory');
const Recipe = require('../models/Recipe');
const { downloadImage } = require('../services/imageService');

//Define the route for fetching recipes by ingredients
//Example URL: /api/recipes?ingredients=apples,flour,sugar
router.get('/recipes', verifyToken, async (req, res) => {
  try {
    const { ingredients } = req.query;
    if (!ingredients) {
      return res.status(400).json({ error: 'Ingredients query parameter is required' });
    }
    const ingredientArray = ingredients.split(',').map(item => item.trim());
    
    // Fetch recipes from Spoonacular API
    const recipes = await getRecipesByIngredients(ingredientArray);
    
    // Record search history entry for the logged-in user
    if (req.user && req.user.userId) {
      const searchEntry = new SearchHistory({
        user: req.user.userId,
        searchTitle: ingredients,
        popularIngredients: ingredientArray
      });
      await searchEntry.save();
    } else {
      console.warn("No user found in req.user; search history not recorded.");
    }
    
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Endpoint to fetch full recipe details using the recipe id
router.get('/recipes/:id', async (req, res) => {
    try {
      const recipeId = req.params.id;
      const recipeInfo = await getRecipeInformation(recipeId);
      res.json(recipeInfo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recipe details' });
    }
  });

// Endpoint to save a recipe to the database
router.post('/', async (req, res) => {
  const { spoonacularId, title, summary, image, ingredients, instructions } = req.body;
  try {
    let recipe = await Recipe.findOne({ spoonacularId });
    if (!recipe) {
      //Download the image and update the image field
      let imagePath = image;
      try {
        const fileName = `recipe-${spoonacularId}.jpg`;
        imagePath = await downloadImage(image, fileName);
      } catch (error) {
        console.error('Error downloading image:', error);
        // Fallback to original URL if download fails
      }
      recipe = new Recipe({ spoonacularId, title, summary, image: imagePath, ingredients, instructions });
      await recipe.save();
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;