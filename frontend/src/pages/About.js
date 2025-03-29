// About page component
// About.jsx
import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid2 } from '@mui/material';
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
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',  // Fill the viewport vertically
        py: 4,
        position: 'relative',
      }}
    >
      <LandingNavButtons />
      <div style={{ paddingTop: '64px' }}></div> {/* Spacing for fixed NavBar */}

      {/* Outer white container */}
      <Box
        sx={{
          maxWidth: 1200,
          width: '90vw',
          mx: 'auto',
          backgroundColor: 'white',
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
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

        {/* 2×2 grid on screens >=600px, single column below that */}
        <Grid2 container spacing={2}>
          {/* Tile 1 */}
          <Grid2 xs={12} sm={6}>
            <Card sx={{ display: 'flex', maxWidth: '100%' }}>
              <CardMedia
                component="img"
                image={ingredientsImage}
                alt="Using ingredients at home"
                sx={{ width: 200, objectFit: 'cover' }}
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
          </Grid2>

          {/* Tile 2 */}
          <Grid2 xs={12} sm={6}>
            <Card sx={{ display: 'flex', maxWidth: '100%' }}>
              <CardMedia
                component="img"
                image={healthyEatingImage}
                alt="Healthy eating"
                sx={{ width: 200, objectFit: 'cover' }}
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
          </Grid2>

          {/* Tile 3 */}
          <Grid2 xs={12} sm={6}>
            <Card sx={{ display: 'flex', maxWidth: '100%' }}>
              <CardMedia
                component="img"
                image={shoppingListImage}
                alt="Smart shopping list"
                sx={{ width: 200, objectFit: 'cover' }}
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
          </Grid2>

          {/* Tile 4 */}
          <Grid2 xs={12} sm={6}>
            <Card sx={{ display: 'flex', maxWidth: '100%' }}>
              <CardMedia
                component="img"
                image={customDishesImage}
                alt="Personalized recipes"
                sx={{ width: 200, objectFit: 'cover' }}
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
          </Grid2>
        </Grid2>

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