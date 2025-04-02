import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Card, CardMedia, CardContent, Button, Grid2, CircularProgress, Box } from '@mui/material';

const RecommendedRecipes = ({ loading = false, recommendations = [], onViewRecipe }) => {
    console.log('RecommendedRecipes props:', { loading, recommendations });
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
  
    if (!recommendations || recommendations.length === 0) {
        console.log('No recommendations - conditions:', {  // Add this debug line
            isUndefined: !recommendations,
            isEmpty: recommendations?.length === 0
          });
      return (
        <Typography variant="body1" sx={{ p: 2 }}>
          No recommendations available at the moment.
        </Typography>
      );
    }

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
            Recommended Recipes
          </Typography>
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
        {recommendations.slice(0, 6).map((recipe) => (     
          <Card 
            key={recipe.id}
            sx={{ 
              position: 'relative',
              height: 250,
              width: '100%',            
              '&:hover .MuiCardContent-root': { 
                opacity: 1 
              },
              cursor: 'pointer',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
            onClick={() => onViewRecipe(recipe.id)}
          >
            <CardMedia
              component="img"
              sx={{
                height: '100%',
                width: '100%'
              }}
              image={recipe.image}
              alt={recipe.title}
            />
            <CardContent
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
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', mb: 1, textAlign: 'center' }}>
                {recipe.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2, textAlign: 'center' }}>
                {recipe.summary.replace(/<[^>]*>/g, '').slice(0, 100)}...
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ 
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  },
                  alignSelf: 'center'
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>      
        ))}
      </Grid2>
    </>
  );
};

RecommendedRecipes.propTypes = {
    loading: PropTypes.bool,
    recommendations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired
      })
    ),
    onViewRecipe: PropTypes.func.isRequired
  };
  
  RecommendedRecipes.defaultProps = {
    loading: false,
    recommendations: []
  };

export default RecommendedRecipes;