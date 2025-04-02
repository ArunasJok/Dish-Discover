import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export const useUserData = (authToken) => {
  const [user, setUser] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [telemetry, setTelemetry] = useState({ ingredientCounts: {}, popularIngredients: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processSearchHistory = (history) => {
    const ingredientCounts = {};
    
    history.forEach(entry => {
      if (entry.popularIngredients) {
        entry.popularIngredients.forEach(ingredient => {
          ingredientCounts[ingredient] = (ingredientCounts[ingredient] || 0) + 1;
        });
      }
    });

    // Sort ingredients by count and get top ones
    const sortedIngredients = Object.entries(ingredientCounts)
      .sort(([, a], [, b]) => b - a);

    return {
      ingredientCounts,
      popularIngredients: sortedIngredients.map(([ingredient]) => ingredient)
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!authToken) return;

      try {
        setLoading(true);
        console.log('Fetching user data with token:', authToken.substring(0, 10) + '...');
        
        // Fetch all data concurrently
        const [profileRes, historyRes, telemetryRes] = await Promise.all([
          axios.get(`${API_URL}/api/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          }),
          axios.get(`${API_URL}/api/searchhistory`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          }),
          axios.get(`${API_URL}/api/telemetry/ingredients`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          })
        ]);

        const searchHistoryData = historyRes.data;
        console.log('Search history entries:', searchHistoryData.length);

        // Try server telemetry first, fall back to local processing
        let processedTelemetry = {
          ingredientCounts: telemetryRes.data.ingredientCounts,
          popularIngredients: telemetryRes.data.popularIngredients
        };

        // If server telemetry is empty but we have history, process locally
        if (Object.keys(processedTelemetry.ingredientCounts).length === 0 && searchHistoryData.length > 0) {
          console.log('Processing telemetry from search history...');
          processedTelemetry = processSearchHistory(searchHistoryData);
          console.log('Processed telemetry:', processedTelemetry);
        }

        setUser(profileRes.data);
        setSearchHistory(searchHistoryData);
        setTelemetry(processedTelemetry);

      } catch (error) {
        console.error('Error fetching user data:', error.response || error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  return {
    user,
    searchHistory,
    telemetry,
    loading,
    error
  };
};