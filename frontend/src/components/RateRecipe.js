// This file defines a React component for rating recipes in the Dish Discover application.
// It allows users to submit a rating for a recipe and displays a message indicating the success or failure of the operation.
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';
import { Box, TextField, Button, Typography } from '@mui/material';

// Rating recipe component
const RateRecipe = ({ recipeId, spoonacularId, onRatingUpdated }) => {
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const { authToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      console.log('Submitting rating:', {
        spoonacularId,
        rating: Number(rating)
      });

      const response = await axios.put(
        `${API_URL}/api/recipes/rate/${spoonacularId}`,
        { rating: Number(rating) },
        { 
          headers: { 
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setMessage('Rating updated!');
        if (onRatingUpdated) {
          onRatingUpdated();
        }
        setRating('');
      }
    } catch (error) {
      console.error('Error rating recipe:', error);
      setMessage(error.response?.data?.error || 'Failed to rate recipe');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 2, display: 'flex', alignItems: 'center' }}
    >
      <TextField
        label="Rate (1-5)"
        type="number"
        variant="outlined"
        size="small"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        inputProps={{ min: 1, max: 5 }}
        sx={{ mr: 2, width: '100px' }}
        required
      />
      <Button type="submit" variant="contained" color="secondary">
        Submit
      </Button>
      {message && (
        <Typography
          variant="body2"
          color={message === 'Rating updated!' ? 'success.main' : 'error'}
          sx={{ ml: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default RateRecipe;
