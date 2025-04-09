import React, { useState, useContext, useEffect } from 'react';
import { getSpoonacularRecipes } from '../services/apiService';
import {  useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid2,
  Box,
} from '@mui/material';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState(() => sessionStorage.getItem('lastIngredients') || '');
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = sessionStorage.getItem('lastRecipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });
  const [message, setMessage] = useState('');
  const { authToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // If ingredients are passed in state, auto-populate and search
  useEffect(() => {
    if (location.state && location.state.ingredients) {
      const ingString = location.state.ingredients;
      setIngredients(ingString);
      autoSearch(ingString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const autoSearch = async (ingString) => {
    try {
      const data = await getSpoonacularRecipes(ingString, authToken);
      setRecipes(data);
      sessionStorage.setItem('lastRecipes', JSON.stringify(data));
      sessionStorage.setItem('lastIngredients', ingString);
      setMessage('');
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setMessage('Failed to fetch recipes. Please try again.');
    }
  };

  const handleChange = (e) => {
    setIngredients(e.target.value);
  };

  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredients) {
      setMessage('Please enter some ingredients.');
      return;
    }
    try {
      const data = await getSpoonacularRecipes(ingredients, authToken);
      setRecipes(data);
      sessionStorage.setItem('lastRecipes', JSON.stringify(data));
      sessionStorage.setItem('lastIngredients', ingredients);
      setMessage('');
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setMessage('Failed to fetch recipes. Please try again.');
    }
  };
  

  return (
    <Container maxWidth="md" sx={{ mt: 12 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Find Recipes by Ingredients
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Enter ingredients (comma separated)"
          variant="outlined"
          value={ingredients}
          onChange={handleChange}
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          Get Recipes
        </Button>
      </Box>
      {message && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
      {recipes.length > 0 ? (
        <Grid2
          container
          spacing={3}
          sx={{
            width: '100%',
            margin: "0 auto",
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'      
            },
            gap: 3,
          }}
        >
          {recipes.slice(0, 6).map((recipe) => (
            <Card
              key={recipe.id}
              onClick={() => handleViewRecipe(recipe.id)}
              sx={{
                position: 'relative',
                height: 250,
                width: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
                '&:hover .MuiCardContent-root': { 
                  opacity: 1,
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                }}
                image={recipe.image}
                alt={recipe.title}
              />
              <CardContent
                className="MuiCardContent-root"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  opacity: 0,
                  transition: 'opacity 0.3s ease-in-out',
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', mb: 1, textAlign: 'center' }}>
                  {recipe.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2, textAlign: 'center' }}>
                  {recipe.usedIngredients && recipe.usedIngredients.length > 0 ? (
                    <>Used: {recipe.usedIngredients.map((ing) => ing.name).join(', ')}</>
                  ) : (
                    'Used Ingredients: N/A'
                  )}
                </Typography>
                <Button 
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewRecipe(recipe.id);
                  }}
                  sx={{ 
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    alignSelf: 'center',
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </Grid2>
      ) : (
        <Typography variant="body1">
          No recipes to display. Enter ingredients and click "Get Recipes".
        </Typography>
      )}
    </Container>
  );
};

export default Ingredients;