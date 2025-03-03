// This file contains the API calls to the backend server.
import axios from 'axios';

// Defining backend's base URL
const API_URL = 'http://localhost:5000';

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
export const getAIRecommendations = async (ingredients) => {
  try {
    // ingredients should be a comma-separated string
    const response = await axios.get(`${API_URL}/api/ai/recommendations?ingredients=${ingredients}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Will add additional API calls (e.g., for recipe creation, user profile, etc.) as needed
