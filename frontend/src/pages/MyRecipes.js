// src/pages/MyRecipes.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
//import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Stack,
  Snackbar,
  Alert,
  TextField,
  Box,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { API_URL } from '../config';
import RecipeCard from '../components/RecipeCard';


const MyRecipes = () => {
  const { authToken } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [expanded, setExpanded] = useState({});
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const fetchMyRecipes = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/recipes/my`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      setRecipes(res.data);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      setMessage('Failed to fetch saved recipes');
      setOpen(true);
    }
  }, [authToken]);

  const handleDelete = async (spoonacularId) => {
    try {
      await axios.delete(`${API_URL}/api/recipes/${spoonacularId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setMessage('Recipe deleted successfully');
      setOpen(true);
      fetchMyRecipes();
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setMessage(err.response?.data?.error || 'Failed to delete recipe');
      setOpen(true);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchMyRecipes();
    }
  }, [authToken, fetchMyRecipes]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };


  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        My Saved Recipes
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Filter recipes"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
        />
      </Box>

      {filteredRecipes.length > 0 ? (
        <Stack spacing={2}>
          {filteredRecipes.map((recipe) => {
          const isExpanded = expanded[recipe._id] || false;
          return (
            <Box key={recipe._id} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{recipe.title}</Typography>
                <IconButton onClick={() => toggleExpand(recipe._id)}>
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <RecipeCard
                  recipe={recipe}
                  onDelete={handleDelete}
                  showRating={true}
                  showDeleteButton={true}
                  hideTitle={true}
                  onRatingUpdated={fetchMyRecipes}
                />
              </Collapse>
            </Box>
          );
        })}
        </Stack>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No saved recipes found.
        </Typography>
      )}
      
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={message.includes('success') ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyRecipes;
