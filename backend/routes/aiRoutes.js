const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

//Define the route for fetching recipes by ingredients
//Example URL: /api/recipes?ingredients=apples,flour,sugar
router.get('/recommendations', async (req, res) => {
  try {
    const { ingredients } = req.query;
    if (!ingredients) {
        return res.status(400).json({ error: 'Missing ingredients parameter' });
    }
    // Split the ingredients by comma into an array
    const ingredientList = ingredients.split(',').map(item => item.trim());

    //Log for debugging
    console.log('Ingredient List:', ingredientList);

    // Call the AI service to fetch recommendations (currently placeholder data)
    const recommendations = await aiService.getAIRecommendations(ingredientList);
    //Verifying content
    console.log('Recommendations:', recommendations);

    res.json(recommendations);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
}
});

module.exports = router;