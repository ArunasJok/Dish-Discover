// This file is part of the Dish Discover application, a recipe discovery and management tool.
// It provides a detailed view of a specific recipe, including options to save or delete it from the user's collection.
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';
import {
  Container,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RecipeCard from '../components/RecipeCard';
//import DeleteIcon from '@mui/icons-material/Delete';

const RecipeDetail = () => {
  const { id: spoonacularId } = useParams();
  const { authToken } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/external/recipes/${spoonacularId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const recipeData = res.data;

        if (!recipeData.instructions) {
          recipeData.instructions = "";
        }
        setRecipe(res.data);

        try {
          const historyPayload = {
            recipeId: parseInt(res.data.id),
            title: res.data.title,
            ingredients: res.data.extendedIngredients?.map(ing => ing.original) || [],
            image: res.data.image || '',
            searchDate: new Date().toISOString()
          };

          console.log('Saving to history:', historyPayload);

          const historyResponse = await axios.post(
            `${API_URL}/api/searchhistory`,
            historyPayload,
            {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (!historyResponse.data) {
            throw new Error('No response data from search history save');
          }

          console.log('History saved:', historyResponse.data);
        } catch (historyError) {
          console.error('Error saving to search history:', {
            error: historyError.response?.data || historyError,
            status: historyError.response?.status || 500,
            payload: historyError.response?.data || null
          });
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setMessage(error.response?.data?.message || 'Failed to load recipe details.');
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
      setOpen(true);
    } catch (err) {
      console.error('Error saving recipe:', err);
      setMessage(err.response?.data?.error || 'Failed to save recipe');
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  if (!recipe) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="body1">Loading recipe details...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 8 }}>
      <IconButton
        onClick={() => navigate(-1)}
        aria-label="back"
        sx={{ mb: 2 }}
      >
        <ArrowBackIcon />
      </IconButton>

      {recipe && (
        <RecipeCard 
          recipe={recipe}
          onSave={handleSave}
          showSaveButton={true}
        />
      )}

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecipeDetail;