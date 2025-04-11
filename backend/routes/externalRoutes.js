const express = require('express');
const router = express.Router();
const axios = require('axios');
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

    // Parse and clean ingredients
    const searchedIngredients = ingredients
      .split(',')
      .map(i => i.trim())
      .filter(i => i);

    if (searchedIngredients.length === 0) {
      return res.status(400).json({ error: 'No valid ingredients provided' });
    }

    // Fetch recipes from Spoonacular API
    const recipes = await getRecipesByIngredients(searchedIngredients);

    // Record search history ONCE per search, not per recipe
    if (req.user?.userId && recipes.length > 0) {
      try {
        // Create single search history entry for this search
        const searchEntry = new SearchHistory({
          user: req.user.userId,
          recipeId: recipes[0].id, // Store first recipe ID
          title: `Search for ${searchedIngredients.join(', ')}`,
          searchIngredients: searchedIngredients,
          ingredients: [], // No need to store recipe ingredients here
          searchDate: new Date()
        });

        await searchEntry.save();
        console.log('Saved search history entry with ingredients:', searchedIngredients);
      } catch (historyError) {
        console.error('Error saving search history:', historyError);
      }
    }

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ 
      error: 'Failed to fetch recipes',
      details: error.message 
    });
  }
});

// Endpoint for ingredient telemetry
router.get('/telemetry/ingredients', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching telemetry for user:', userId);

    const searchHistory = await SearchHistory.find({ user: userId });
    const ingredientMap = new Map();
    
    // Count occurrences of searched ingredients
    searchHistory.forEach(entry => {
      if (entry?.searchIngredients?.length > 0) {
        entry.searchIngredients.forEach(ingredient => {
          if (ingredient) {
            const count = ingredientMap.get(ingredient) || 0;
            ingredientMap.set(ingredient, count + 1);
          }
        });
      }
    });

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

router.get('/proxy/pixabay', async (req, res) => {
  try {
    // Get query params from frontend but use API key from backend env
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }
    
    console.log('Pixabay proxy request received for:', q);
    console.log('Using Pixabay API key:', process.env.PIXABAY_API_KEY ? 'Key exists' : 'Key missing');
    
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: process.env.PIXABAY_API_KEY,
        q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 10,
        category: 'food',
        min_width: 300,
        min_height: 200
      }
    });
    
    console.log(`Pixabay response for "${q}": ${response.data.hits?.length || 0} images found`);
    res.json(response.data);
  } catch (error) {
    console.error('Pixabay proxy error:', error.message);
    
    // More detailed error logging
    if (error.response) {
      console.error('Pixabay API error details:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch from Pixabay',
      message: error.message
    });
  }
});


module.exports = router;