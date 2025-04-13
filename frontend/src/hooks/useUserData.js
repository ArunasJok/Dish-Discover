// This custom hook fetches user data and search history from the API, processes it, and returns the results.
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export const useUserData = (authToken) => {
  const [user, setUser] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [telemetry, setTelemetry] = useState({ ingredientCounts: {}, popularIngredients: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processSearchHistory = useCallback((history) => {
    console.log('Processing search history:', {
      entries: history.length,
      sampleEntry: history[0]
    });

    const ingredientCounts = {};

    // Process search query ingredients instead of recipe ingredients
    history.forEach(entry => {      
      if (entry.searchIngredients && Array.isArray(entry.searchIngredients)) {
        entry.searchIngredients.forEach(ingredient => {
          if (typeof ingredient === 'string' && ingredient.trim()) {
            const normalizedIngredient = ingredient.toLowerCase().trim();
            ingredientCounts[normalizedIngredient] = 
              (ingredientCounts[normalizedIngredient] || 0) + 1;
          }
        });
      }
    });

    console.log('Processed ingredient counts:', ingredientCounts);

    // Sort ingredients by count and get top ones
    const sortedIngredients = Object.entries(ingredientCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const result = {
      ingredientCounts,
      popularIngredients: sortedIngredients.map(([ingredient]) => ingredient)
    };

    console.log('Final telemetry:', result);
    return result;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!authToken) {
        console.log('No auth token provided');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching user data...');
        
        const [profileRes, historyRes] = await Promise.all([
          axios.get(`${API_URL}/api/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          }),
          axios.get(`${API_URL}/api/searchhistory`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          })
        ]);

        const searchHistoryData = historyRes.data;
        console.log(`Received ${searchHistoryData.length} search history entries`);
        
        const processedTelemetry = processSearchHistory(searchHistoryData);

        setUser(profileRes.data);
        setSearchHistory(searchHistoryData);
        setTelemetry(processedTelemetry);

      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.response?.data?.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, processSearchHistory]);

  return {
    user,
    searchHistory,
    telemetry,
    loading,
    error
  };
};