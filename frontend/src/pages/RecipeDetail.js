// src/pages/RecipeDetail.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';


const RecipeDetail = () => {
  const { id: spoonacularId } = useParams(); // id is the Spoonacular recipe ID
  const { authToken } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Calling the integrated recipe detail endpoint.
        const res = await axios.get(`${API_URL}/api/external/recipes/${spoonacularId}`, {
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
  }, [spoonacularId, authToken]);

  const handleSave = async () => {
    try {
      const sanitizedIngredients = recipe.extendedIngredients.map(ingredient => ({
        id: ingredient.id || 0,
        name: ingredient.name || '',
        amount: parseFloat(ingredient.amount) || 0,
        unit: ingredient.unit || '',
        original: ingredient.original || ''
      }));
  
      const payload = {
        spoonacularId: parseInt(recipe.id),
        title: recipe.title.trim(),
        image: recipe.image,
        instructions: recipe.instructions || '',
        extendedIngredients: sanitizedIngredients,
        usedIngredients: recipe.usedIngredients || [],
        missedIngredients: recipe.missedIngredients || [],
        likes: parseInt(recipe.likes) || 0
      };
  
      const res = await axios.post(`${API_URL}/api/recipes/save`, payload, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
  
      setMessage(res.data.message);
    } catch (err) {
      console.error('Error saving recipe:', err);
      setMessage(err.response?.data?.error || 'Failed to save recipe');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/recipes/${spoonacularId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setMessage('Recipe deleted successfully');
      navigate('/my-recipes');
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setMessage(err.response?.data?.error || 'Failed to delete recipe');
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
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSave}
        >
          Save Recipe
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Delete Recipe
        </Button>
      </Stack>

      <Paper 
      elevation={3} 
      sx={{ 
        mb: 4, 
        overflow: 'hidden',
        maxWidth: '100%',
        borderRadius: 2
      }}
    >
      <CardMedia
        component="img"
        image={recipe.image}
        alt={recipe.title}
        sx={{
          width: '100%',
          maxHeight: 400,
          objectFit: 'cover'
        }}
      />
    </Paper>

    <Typography variant="h4" gutterBottom color="primary">
      {recipe.title}
    </Typography>
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
