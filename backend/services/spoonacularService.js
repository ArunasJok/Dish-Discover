const axios = require('axios');
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = process.env.BASE_URL || 'https://api.spoonacular.com';

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

  const getRandomRecipes = async (number = 7) => {
    try {
      console.log('Fetching random recipes from Spoonacular API...');
      const response = await axios.get(`${BASE_URL}/recipes/random`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          number: number,
          tags: 'main course',
          addRecipeInformation: true
        }
      });
  
      if (!response.data || !response.data.recipes) {
        throw new Error('Invalid response from Spoonacular API');
      }
  
      return response.data;
    } catch (error) {
      console.error('Spoonacular API error:', error.response?.data || error.message);
      throw error;
    }
  };
    
  module.exports = { 
    getRecipesByIngredients, 
    getRecipeInformation,
    getRandomRecipes,
  };
