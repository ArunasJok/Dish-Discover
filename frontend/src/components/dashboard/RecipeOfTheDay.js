import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const RecipeOfTheDay = ({ loading, recipeOfDay, onViewRecipe }) => {
  if (loading) return <Typography>Loading Recipe of the Day...</Typography>;
  if (!recipeOfDay) return null;

  return (
    <Box sx={{ mb: 4, width: '100%', height: { xs: '500px', md: '600px' }, position: 'relative' }}>
      <Box component="img"
        src={recipeOfDay.image}
        alt={recipeOfDay.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <Box sx={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: { xs: 3, md: 6 },
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)'
      }}>
        <Typography variant="h3" sx={{ color: 'white', mb: 2 }}>
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
  );
};

export default RecipeOfTheDay;