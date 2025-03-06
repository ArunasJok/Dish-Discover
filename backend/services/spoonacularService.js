const axios = require('axios');

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

<<<<<<< HEAD
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
=======
const getRecipesByIngredients = async (ingredientsArray) => {
    try {
      const params = {
        ingredients: ingredientsArray.join(','),
        number: 5, // Change this value to get more recipes (e.g., 5)
        apiKey: SPOONACULAR_API_KEY,
      };

      const response = await axios.get(`${BASE_URL}/recipes/findByIngredients`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes from Spoonacular:', error.message);
      throw error;
    }
  };
  
  const getRecipeInformation = async (recipeId) => {
    try {
      const params = {
        apiKey: SPOONACULAR_API_KEY,
        includeNutrition: false,
      };
      const response = await axios.get(`${BASE_URL}/recipes/${recipeId}/information`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipe information:', error.message);
      throw error;
    }
  };
  
  module.exports = { getRecipesByIngredients, getRecipeInformation };
>>>>>>> feature/frontend
