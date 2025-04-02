const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authenticationMiddleware');
const { getRecipesByIngredients, getRecipeInformation, getRandomRecipes } = require('../services/spoonacularService');
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
        popularIngredients: ingredientArray,
        searchDate: new Date()
      });

      try {
        await searchEntry.save();
        console.log('Search history saved successfully');
      } catch (historyError) {
        console.warn('Error saving search history:', historyError);
        // Continue execution even if history save fails
      }
    }
    
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Endpoint for ingredient telemetry
router.get('/telemetry/ingredients', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching telemetry for user:', userId);

    // Get all search history entries for this user
    const searchHistory = await SearchHistory.find({ user: userId });
    
    // Create a map to count ingredients
    const ingredientMap = new Map();
    
    // Count occurrences of each ingredient
    searchHistory.forEach(entry => {
      if (entry?.popularIngredients?.length > 0) {
        entry.popularIngredients.forEach(ingredient => {
          if (ingredient) {
            const count = ingredientMap.get(ingredient) || 0;
            ingredientMap.set(ingredient, count + 1);
          }
        });
      }
    });

    // Convert map to object and sort by count
    const sortedIngredients = [...ingredientMap.entries()]
      .sort((a, b) => b[1] - a[1]);

    const ingredientCounts = Object.fromEntries(sortedIngredients);
    const popularIngredients = sortedIngredients
      .slice(0, 10)
      .map(([ingredient]) => ingredient);

    console.log('Sending telemetry data:', {
      ingredientCounts,
      popularIngredients,
      totalEntries: searchHistory.length
    });

    res.json({
      ingredientCounts,
      popularIngredients
    });

  } catch (error) {
    console.error('Error in telemetry endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch ingredient telemetry',
      details: error.message 
    });
  }
});

// Endpoint to grab 7 random recipes from the database
router.get('/recipes/random', verifyToken, async (req, res) => {
  try {
    console.log('Fetching random recipes...');
    const randomData = await getRandomRecipes(7);
    
    if (!randomData || !randomData.recipes || !randomData.recipes.length) {
      console.error('No recipes returned from Spoonacular');
      return res.status(404).json({ 
        error: 'No recipes found',
        details: 'Empty response from recipe service'
      });
    }

    const recipes = randomData.recipes;
    const recipeOfDay = recipes[0];
    const recommendations = recipes.slice(1);

    console.log(`Successfully fetched ${recipes.length} recipes`);
    res.json({ 
      recipeOfDay, 
      recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in random recipes endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch random recipes',
      details: error.message || 'Unknown error'
    });
  }
});

// Endpoint to fetch full recipe details using the recipe id
router.get('/recipes/:spoonacularId', verifyToken, async (req, res) => {
  try {
    const { spoonacularId } = req.params;
    // Checking if this recipe is already saved locally for this user
    let recipe = await Recipe.findOne({
      spoonacularId: Number(spoonacularId),
      user: req.user.userId
    });

    if (recipe) {
      console.log(`Returning locally saved recipe detail for spoonacularId: ${spoonacularId}`);
      return res.json(recipe);
    }
    
    // If not found locally, fetch recipe details from Spoonacular API
    console.log(`Fetching recipe details from Spoonacular API for id: ${spoonacularId}`);
    const recipeInfo = await getRecipeInformation(spoonacularId);
    res.json(recipeInfo);
  } catch (error) {
    console.error(`Error fetching recipe details for spoonacularId ${req.params.spoonacularId}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch recipe details',
      details: error.message 
    });
  }
});


module.exports = router;