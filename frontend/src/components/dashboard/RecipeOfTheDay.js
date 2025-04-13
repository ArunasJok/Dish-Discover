// This file defines the RecipeOfTheDay component for the Dish Discover application.
// It displays the recipe of the day with an image, title, and a button to view the recipe details.
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const RecipeOfTheDay = ({ loading, recipeOfDay, onViewRecipe }) => {
  if (loading) return <Typography>Loading Recipe of the Day...</Typography>;
  if (!recipeOfDay) return null;

  return (
    <>
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
            letterSpacing: '0.5px'
          }}
        >
          Recipe of the Day
        </Typography>
    <Box sx={{ mb: 4, width: '100%', height: { xs: '100px', md: '200px' }, position: 'relative' }}>
      <Box component="img"
        src={recipeOfDay.image}
        alt={recipeOfDay.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <Box 
      sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        p: { xs: 3, md: 6 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)'
      }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            color: 'white', 
            mb: 2,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' }
            }
          }}
        >
          {recipeOfDay.title}
        </Typography>
        <Button 
          variant="contained"
          onClick={() => onViewRecipe(recipeOfDay.id)}
          sx={{ mt: 2 }}
        >
          View Recipe
        </Button>
      </Box>
    </Box>
    </>
  );
};

export default RecipeOfTheDay;