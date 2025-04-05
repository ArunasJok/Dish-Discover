import React, { useState, useContext } from 'react';
import { getSpoonacularRecipes } from '../services/apiService';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Box,
} from '@mui/material';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState('');
  const { authToken } = useContext(AuthContext);

  const handleChange = (e) => {
    setIngredients(e.target.value);
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
        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} key={recipe.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={recipe.image}
                  alt={recipe.title}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Used Ingredients:{' '}
                    {recipe.usedIngredients.map((ing) => ing.name).join(', ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Missed Ingredients:{' '}
                    {recipe.missedIngredients.map((ing) => ing.name).join(', ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Likes: {recipe.likes}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">
          No recipes to display. Enter ingredients and click "Get Recipes".
        </Typography>
      )}
    </Container>
  );
};

export default Ingredients;