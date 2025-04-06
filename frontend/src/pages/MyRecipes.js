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
    <Container
      sx={{
        mt: 8,
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
      }}
    >     
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: 'primary.main',
          textAlign: 'left',
          mb: 3,
          fontFamily: '"Poppins", "Helvetica Neue", sans-serif',
          borderBottom: '2px solid',
          borderColor: 'primary.light',
          paddingBottom: 1,
          letterSpacing: '0.5px',
          backgroundColor: 'rgba(255,255,255,0.8)'
        }}
      >
        Saved Recipes
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Filter recipes"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
        />
      </Box>

      {filteredRecipes.length > 0 ? (
        <Stack spacing={2}>
          {filteredRecipes.map((recipe) => {
            const isExpanded = expanded[recipe._id] || false;
            return (
              <Box
                key={recipe._id}
                // The entire recipe item uses the recipe image as its background
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 1,
                  position: 'relative',
                  backgroundImage: `url(${recipe.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'background 0.5s ease-in-out',
                }}
              >
                {/* Overlay to make the background image appear fainter */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(65, 65, 65, 0.35)',
                    zIndex: 0,
                    transition: 'opacity 0.5s ease-in-out',
                    borderRadius: 2,
                  }}
                />
                {/* Header */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    px: 1,
                    bgcolor: 'hsla(0, 22.20%, 96.50%, 0.50)',
                    borderRadius: 1,
                  }}
                  onClick={() => toggleExpand(recipe._id)}
                >
                  <Typography 
                  variant="h6" 
                  sx={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontFamily: '"Poppins", "Helvetica Neue", sans-serif',
                  }}
                  >
                    {recipe.title}
                  </Typography>
                  <IconButton onClick={() => toggleExpand(recipe._id)}>
                    {isExpanded ? <ExpandLessIcon sx={{ color: 'white' }} /> : <ExpandMoreIcon sx={{ color: 'white' }} />}
                  </IconButton>
                </Box>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  {/* Expanded content appears over the same background */}
                  <Box sx={{ mt: 1, position: 'relative', zIndex: 1 }}>
                    <RecipeCard
                      recipe={recipe}
                      onDelete={handleDelete}
                      showRating={true}
                      showDeleteButton={true}
                      hideTitle={false}
                      onRatingUpdated={fetchMyRecipes}
                    />
                  </Box>
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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={message.includes('success') ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyRecipes;
