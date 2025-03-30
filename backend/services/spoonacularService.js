const axios = require('axios');
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

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

  const getRandomRecipes = async (number = 5) => {
    try {
      const params = {
        number: number,
        apiKey: SPOONACULAR_API_KEY,
      };
      const response = await axios.get(`${BASE_URL}/recipes/random`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching random recipes:', error.message);
      throw error;
    }
  };
    
  module.exports = { 
    getRecipesByIngredients, 
    getRecipeInformation,
    getRandomRecipes,
  };
