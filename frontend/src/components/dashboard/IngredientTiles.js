import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Typography, Card, CardMedia, Box, CircularProgress, Grid2 } from '@mui/material';
import axios from 'axios';
import * as emoji from 'node-emoji';
import missingImage from '../../images/missingIngredient.png';

const getIngredientEmoji = (ingredient) => {
  const key = ingredient.toLowerCase();
  const found = emoji.get(key);
  return found !== `:${key}:` ? found : '🥘';
};

const MAX_RETRIES = 3; // Number of different images to try
const RESULTS_PER_PAGE = 10; // Number of results to fetch from Pixabay

const IngredientTiles = ({ telemetry, PIXABAY_API_KEY, PIXABAY_API_URL }) => {
    // Initialize state
    const [state, setState] = useState({
      loading: true,
      error: null,
      ingredientImages: {},
      topIngredients: [],
      imageRetries: {}
    });
  
    // Create memoized version of loadImageForIngredient
    const loadImageForIngredient = useCallback(async (ingredient, retryCount = 0) => {
      try {
        console.log(`Loading image for ${ingredient}, attempt ${retryCount + 1}`);
        
        const result = await axios.get(PIXABAY_API_URL, {
          params: {
            key: PIXABAY_API_KEY,
            q: encodeURIComponent(`${ingredient} food`),
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: RESULTS_PER_PAGE,
            category: 'food',
            min_width: 300,
            min_height: 200
          }
        });
  
        const hits = result.data.hits;
        if (!hits?.length) return null;
  
        const index = retryCount % hits.length;
        return hits[index]?.webformatURL || null;
  
      } catch (error) {
        console.error(`Error loading image for ${ingredient}:`, error);
        return null;
      }
    }, [PIXABAY_API_KEY, PIXABAY_API_URL]);

  const handleImageError = async (e, ingredient) => {
    try {
      e.preventDefault();
      
      // Use object instead of Map for retries
      const currentRetries = state.imageRetries[ingredient] || 0;
      
      if (currentRetries >= MAX_RETRIES) {
        console.log(`Max retries (${MAX_RETRIES}) reached for ${ingredient}`);
        e.target.src = missingImage;
        return;
      }

      const newImage = await loadImageForIngredient(ingredient, currentRetries);
      if (!newImage) {
        e.target.src = missingImage;
        return;
      }

      // Update state with new image and retry count
      setState(prev => ({
        ...prev,
        ingredientImages: {
          ...prev.ingredientImages,
          [ingredient]: newImage
        },
        imageRetries: {
          ...prev.imageRetries,
          [ingredient]: currentRetries + 1
        }
      }));

      e.target.src = newImage;
    } catch (error) {
      console.error(`Error in image error handler for ${ingredient}:`, error);
      e.target.src = missingImage;
    }
  };

  // Process telemetry data and load images
  useEffect(() => {
    const processData = async () => {
      try {
        if (!telemetry?.ingredientCounts) {
          setState(prev => ({ ...prev, loading: false, error: 'No ingredient data available' }));
          return;
        }

        const topIngredients = Object.entries(telemetry.ingredientCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([ingredient]) => ingredient);

        // Initial image load for each ingredient
        const newImages = {};
        for (const ingredient of topIngredients) {
          const image = await loadImageForIngredient(ingredient, 0);
          newImages[ingredient] = image || missingImage;
        }

        setState({
          loading: false,
          error: null,
          ingredientImages: newImages,
          topIngredients,
          imageRetries: {}
        });

      } catch (error) {
        console.error('Error processing data:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to process ingredient data'
        }));
      }
    };

    processData();
  }, [telemetry, loadImageForIngredient]);

  if (state.error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error.main">{state.error}</Typography>
      </Box>
    );
  }

  if (state.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', py: 3 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3,
          fontWeight: 600,
          color: 'primary.main',
          borderBottom: '2px solid',
          borderColor: 'primary.light',
          pb: 1
        }}
      >
        Most Searched Ingredients
      </Typography>
  
      <Grid2 
          container 
          spacing={2}
          sx={{ 
            width: '100%',
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',               // 1 column on mobile
              sm: 'repeat(2, 1fr)',    // 2 columns on small screens
              md: 'repeat(3, 1fr)',    // 3 columns on medium screens
              lg: 'repeat(5, 1fr)'     // 5 columns on large screens
            },
            gap: 2
          }}
        >
          {state.topIngredients.map((ingredient, idx) => (
            <Grid2 key={idx}>
              <Card
                sx={{
                  height: {
                    xs: '150px',
                    sm: '180px',
                    md: '200px',
                    lg: '220px'
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    '& .ingredient-overlay': {
                      opacity: 1
                    }
                  }
                }}
            >
              <CardMedia
                component="img"                
                image={state.ingredientImages[ingredient] || missingImage}
                alt={ingredient}
                onError={(e) => handleImageError(e, ingredient)}
      sx={{
        objectFit: 'cover',
        backgroundColor: 'grey.100',
        width: '100%',
        height: '100%',
      }}
              />
              <Box
                className="ingredient-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, textTransform: 'capitalize' }}>
                  {ingredient} {getIngredientEmoji(ingredient)}
                </Typography>
                <Typography variant="body2">
                  Searched {telemetry.ingredientCounts[ingredient]} times
                </Typography>
              </Box>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

IngredientTiles.propTypes = {
  telemetry: PropTypes.shape({
    ingredientCounts: PropTypes.object.isRequired,
    popularIngredients: PropTypes.array.isRequired
  }).isRequired,
  PIXABAY_API_KEY: PropTypes.string.isRequired,
  PIXABAY_API_URL: PropTypes.string.isRequired
};

export default IngredientTiles;