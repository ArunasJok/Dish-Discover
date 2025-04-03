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
  Stack
} from '@mui/material';
import RateRecipe from '../components/RateRecipe';
import { API_URL } from '../config';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const handleDelete = async (spoonacularId) => {
    try {
      await axios.delete(`${API_URL}/api/recipes/${spoonacularId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setMessage('Recipe deleted successfully');
      fetchMyRecipes(); // Refresh the list
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setMessage(err.response?.data?.error || 'Failed to delete recipe');
    }
  };

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
        <TableContainer 
        component={Paper} 
        sx={{ 
          mt: 2,
          maxWidth: '100%',
          '& td': { 
            verticalAlign: 'middle',
            p: 2
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Recipe</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow key={recipe._id} 
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                  }
                }}
              >
                <TableCell>
                  <Typography variant="subtitle1" gutterBottom>
                    {recipe.title}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/recipe/${recipe.spoonacularId}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  >
                    View Details
                  </Button>
                </TableCell>
                <TableCell>
                  <Box
                    component="img"
                    src={recipe.image}
                    alt={recipe.title}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {recipe.rating.toFixed(1)} ({recipe.ratingCount} ratings)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <RateRecipe 
                      recipeId={recipe._id}
                      spoonacularId={recipe.spoonacularId} 
                      onRatingUpdated={fetchMyRecipes}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(recipe.spoonacularId)}
                    >
                      Delete
                    </Button>
                  </Stack>
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
