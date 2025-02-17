
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Define the route for getting all recipes
router.get('/', recipeController.getRecipes);

// Define the route for creating a new recipe
router.post('/', recipeController.createRecipe);

module.exports = router;
