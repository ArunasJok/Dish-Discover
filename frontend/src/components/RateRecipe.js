// src/components/RateRecipe.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';
import { Box, TextField, Button, Typography } from '@mui/material';

const RateRecipe = ({ recipeId, onRatingUpdated }) => {
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const { authToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/api/recipes/rate/${recipeId}`,
        { rating: Number(rating) },
        { headers: { 'Authorization': `Bearer ${authToken}` } }
      );
      setMessage('Rating updated!');
      if (onRatingUpdated) {
        onRatingUpdated();
      }
      setRating('');
    } catch (error) {
      console.error('Error rating recipe:', error);
      setMessage('Failed to rate recipe');
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
