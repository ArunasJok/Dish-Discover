const express = require('express');
const router = express.Router();
const spoonacularService = require('../services/spoonacularService');

//Define the route for fetching recipes by ingredients
//Example URL: /api/recipes?ingredients=apples,flour,sugar
router.get('/recipes', async (req, res) => {
    try {
        const { ingredients } = req.query;
        if (!ingredients) {
            return res.status(400).json({ error: 'Missing ingredients parameter' });
        }
        // Split the ingredients by comma into an array
        const ingredientsList = ingredients.split(',').map(item => item.trim());
        // Call the Spoonacular API service to fetch recipes
        const recipes = await spoonacularService.getRecipesByIngredients(ingredientsList);
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

module.exports = router;