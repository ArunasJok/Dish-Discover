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
      entry.popularIngredients.forEach(ingredient => {
        const count = ingredientMap.get(ingredient) || 0;
        ingredientMap.set(ingredient, count + 1);
      });
    });

    // Convert map to object and sort by count
    const ingredientCounts = Object.fromEntries(ingredientMap);
    const popularIngredients = [...ingredientMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([ingredient]) => ingredient);

    console.log('Sending telemetry data:', {
      ingredientCounts,
      popularIngredients
    });

    res.json({
      ingredientCounts,
      popularIngredients
    });

  } catch (error) {
    console.error('Error in telemetry endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch ingredient telemetry' });
  }
});

// Endpoint to grab 7 random recipes from the database
router.get('/recipes/random', verifyToken, async (req, res) => {
  console.log("GET /recipes/random route hit");
  try {
    // Get 7 random recipes
    const randomData = await getRandomRecipes(7); 
    // getRandomRecipes returns { recipes: [...] }
    const recipes = randomData.recipes;
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ error: 'No recipes found' });
    }
    // Pick the first as Recipe of the Day and the rest as recommendations
    const recipeOfDay = recipes[0];
    const recommendations = recipes.slice(1);
    res.json({ recipeOfDay, recommendations });
  } catch (error) {
    console.error("Error fetching random recipes:", error);
    res.status(500).json({ error: 'Failed to fetch random recipes' });
  }
});

// Endpoint to fetch full recipe details using the recipe id
router.get('/recipes/:id', verifyToken, async (req, res) => {
  try {
    const spoonacularId = req.params.id;
    // Checking if this recipe is already saved locally for this user
    let recipe = await Recipe.findOne({
      spoonacularId: Number(spoonacularId),
      user: req.user.userId
    });
    if (recipe) {
      console.log("Returning locally saved recipe detail");
      return res.json(recipe);
    }
    
    // If not found locally, fetch recipe details from Spoonacular API
    const recipeInfo = await getRecipeInformation(spoonacularId);
    res.json(recipeInfo);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
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