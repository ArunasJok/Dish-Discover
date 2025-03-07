// src/components/RateRecipe.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const RateRecipe = ({ recipeId, onRatingUpdated }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const { authToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/api/recipes/rate/${recipeId}`, // Use the centralized API URL
        { rating },
        {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }
      );
      setMessage('Rating updated!');
      // Optionally, refresh the recipes list after rating update
      onRatingUpdated();
    } catch (error) {
      console.error('Error rating recipe:', error);
      setMessage('Failed to rate recipe');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        required
      />
      <button type="submit">Rate</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default RateRecipe;
