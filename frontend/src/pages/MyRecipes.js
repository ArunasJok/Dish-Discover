// src/pages/MyRecipes.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from '@mui/material';
import RateRecipe from '../components/RateRecipe';
import { API_URL } from '../config';

const MyRecipes = () => {
  const { authToken } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState('');

  const fetchMyRecipes = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/recipes/my`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      setRecipes(res.data);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      setMessage('Failed to fetch saved recipes');
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      fetchMyRecipes();
    }
  }, [authToken, fetchMyRecipes]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        My Saved Recipes
      </Typography>
      {message && (
        <Typography variant="body1" color="error" gutterBottom>
          {message}
        </Typography>
      )}
      {recipes.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Recipe Title</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Current Rating</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipes.map((recipe) => (
                <TableRow key={recipe._id}>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/recipe/${recipe.spoonacularId}`}
                      color="primary"
                    >
                      {recipe.title}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Box
                      component="img"
                      src={recipe.image}
                      alt={recipe.title}
                      sx={{ width: 150, height: 'auto' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {recipe.rating.toFixed(1)} ({recipe.ratingCount} ratings)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RateRecipe recipeId={recipe._id} onRatingUpdated={fetchMyRecipes} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No saved recipes found.
        </Typography>
      )}
    </Container>
  );
};

export default MyRecipes;
