import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export const useRecipes = (authToken) => {
  const [loading, setLoading] = useState(true);
  const [recipeOfDay, setRecipeOfDay] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const fetchRandomRecipes = useCallback(async () => {
    try {
      // First try to get from cache
      const cached = localStorage.getItem('randomRecipes');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = new Date().getTime();
        const twoHours = 2 * 60 * 60 * 1000;
        if (now - timestamp < twoHours) {
          console.log('Using cached recipe data');
          setRecipeOfDay(data.recipeOfDay);
          setRecommendations(data.recommendations);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      const res = await axios.get(`${API_URL}/api/external/recipes/random`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (!res.data || !res.data.recipeOfDay) {
        throw new Error('Invalid response format');
      }

      // Cache the new data
      localStorage.setItem('randomRecipes', JSON.stringify({
        data: res.data,
        timestamp: new Date().getTime()
      }));

      setRecipeOfDay(res.data.recipeOfDay);
      setRecommendations(res.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      setError('Failed to load recipes. Please try again later.');
      
      // Try to use cached data as fallback
      const cached = localStorage.getItem('randomRecipes');
      if (cached) {
        const { data } = JSON.parse(cached);
        setRecipeOfDay(data.recipeOfDay);
        setRecommendations(data.recommendations);
      }
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      fetchRandomRecipes();
    }
  }, [authToken, fetchRandomRecipes]);

  return {
    loading,
    recipeOfDay,
    recommendations,
    error,
    fetchRandomRecipes
  };
};