// src/pages/RecipeDetail.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';
import {
  Container,
  Typography,
  Button,
  CardMedia,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box
} from '@mui/material';

const RecipeDetail = () => {
  const { id } = useParams(); // id is the Spoonacular recipe ID
  const { authToken } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Calling the integrated recipe detail endpoint.
        const res = await axios.get(`${API_URL}/api/external/recipes/${id}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setRecipe(res.data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setMessage('Failed to load recipe details.');
      }
    };

    if (authToken) {
      fetchRecipe();
    } else {
      setMessage('You must be logged in to view recipe details.');
    }
  }, [id, authToken]);

  const handleSave = async () => {
    try {
      const payload = {
        spoonacularId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        usedIngredients: recipe.usedIngredients || [],
        missedIngredients: recipe.missedIngredients || [],
        likes: recipe.likes || 0,
        details: recipe
      };
      const res = await axios.post(`${API_URL}/api/recipes/save`, payload, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error('Error saving recipe:', err);
      setMessage('Failed to save recipe.');
    }
  };

  if (!recipe) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="body1">Loading recipe details...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        {recipe.title}
      </Typography>
      <CardMedia
        component="img"
        image={recipe.image}
        alt={recipe.title}
        sx={{ width: '100%', maxHeight: 400, objectFit: 'cover', mb: 2 }}
      />
      <Button variant="contained" color="secondary" onClick={handleSave} sx={{ mb: 2 }}>
        Save Recipe
      </Button>
      <Typography variant="h5" gutterBottom>
        Instructions
      </Typography>
      {recipe.instructions ? (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
        </Paper>
      ) : (
        <Typography variant="body1">No instructions available.</Typography>
      )}
      {message && (
        <Typography variant="body1" color="error" gutterBottom>
          {message}
        </Typography>
      )}
      <Typography variant="h6" gutterBottom>
        Ingredients
      </Typography>
      {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
        <List>
          {recipe.extendedIngredients.map((ing) => (
            <ListItem key={ing.id}>
              <ListItemText primary={ing.original} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No ingredients information available.</Typography>
      )}
    </Container>
  );
};

export default RecipeDetail;
