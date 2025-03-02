const axios = require('axios');

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

const getRecipesByIngredients = async (ingredients) => {
    try {
        // Define the query parameters
        const params = {
            ingredients: ingredients.join(','),
            number: 1,
            apiKey: SPOONACULAR_API_KEY,
        };
        // Make a GET request to the Spoonacular API
        const response = await axios.get(`${BASE_URL}/recipes/findByIngredients`, { params });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching recipes:', error.message);
        throw error;
    }
};

module.exports = {
    getRecipesByIngredients,
};