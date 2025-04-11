// About page component
import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia} from '@mui/material';
import LandingNavButtons from '../components/LandingNavButtons';

// Images
import ingredientsImage from '../images/ingredientsImage.png';
import healthyEatingImage from '../images/healthyEatingImage.png';
import shoppingListImage from '../images/shoppingListImage.png';
import customDishesImage from '../images/customDishesImage.png';

const About = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.light',
        minHeight: '80vh',
        py: 4,
        position: 'relative',
        mt: 2,
        pb: 4
      }}
    >
      <LandingNavButtons />
      <div style={{ paddingTop: '64px' }}></div> 

      {/* Outer container */}
      <Box
        sx={{
          maxWidth: 1160,
          width: '90vw',
          mx: 'auto',
          backgroundColor: 'grey.100',
          p: 2,
          borderRadius: 4,
          boxShadow: 3,
          mt: { xs: 0, md: 0 },
        }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          About Dish Discover
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Dish Discover is an AI-powered web app that helps you decide what to cook based on the ingredients you have at home.
          Our mission is to reduce food waste, promote healthy eating, and simplify meal planning by inspiring you with creative dishes
          and generating smart shopping lists.
        </Typography>

        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {/* Tile 1 */}
          <Card sx={{ display: 'flex' }}>
            <CardMedia
              component="img"
              image={ingredientsImage}
              alt="Using ingredients at home"
              sx={{ width: 180, objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Reduce Food Waste
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Discover recipes that help you use up the ingredients you already have.
              </Typography>
            </CardContent>
          </Card>

          {/* Tile 2 */}
          <Card sx={{ display: 'flex' }}>
            <CardMedia
              component="img"
              image={healthyEatingImage}
              alt="Healthy eating"
              sx={{ width: 180, objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Promote Healthy Eating
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Find nutritious recipes that make it easy to prepare balanced meals.
              </Typography>
            </CardContent>
          </Card>

          {/* Tile 3 */}
          <Card sx={{ display: 'flex' }}>
            <CardMedia
              component="img"
              image={shoppingListImage}
              alt="Smart shopping list"
              sx={{ width: 180, objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Smart Shopping Lists
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Automatically generate shopping lists to ensure you have the right ingredients.
              </Typography>
            </CardContent>
          </Card>

          {/* Tile 4 */}
          <Card sx={{ display: 'flex' }}>
            <CardMedia
              component="img"
              image={customDishesImage}
              alt="Personalized recipes"
              sx={{ width: 180, objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Personalized Recipes
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Get recipe suggestions tailored to your taste and available ingredients.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            Our goal is to empower home cooks by making meal planning simple and fun. With Dish Discover, you can create delicious meals,
            enjoy a healthier lifestyle, and contribute to a more sustainable future—all from your own kitchen.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default About;