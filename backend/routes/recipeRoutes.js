
// This file defines the routes for the recipe-related endpoints in the application.
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const verifyToken = require('../middlewares/authenticationMiddleware');

// Public: Define the route for getting all recipes
router.get('/', recipeController.getRecipes);

// Private: Define the route for creating a new recipe
router.post('/', verifyToken, recipeController.createRecipe);

module.exports = router;
