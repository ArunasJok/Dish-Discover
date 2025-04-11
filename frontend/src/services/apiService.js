// This file contains the API calls to the backend server.
import axios from 'axios';
import { API_URL } from '../config';

// Registration API call
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login API call
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// AI Recommendations API call
export const getSpoonacularRecipes = async (ingredients, token) => {
  try {
    // ingredients should be a comma-separated string
    const response = await axios.get(`${API_URL}/api/external/recipes?ingredients=${ingredients}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecipeDetail = async (recipeId) => {
  try {
    const response = await axios.get(`${API_URL}/api/external/recipes/${recipeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


