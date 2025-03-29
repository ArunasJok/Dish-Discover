// About page component
import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid2 } from '@mui/material';
import ingredientsImage from '../images/ingredientsImage.png';
import healthyEatingImage from '../images/healthyEatingImage.png';
import shoppingListImage from '../images/shoppingListImage.png';
import LandingNavButtons from '../components/LandingNavButtons';
import customDishesImage from '../images/customDishesImage.png';

const About = () => {
  return (
    // Outer container with grey background
    <Box
      sx={{
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
        py: 4,
        position: 'relative',
      }}      
    >
      <NavBar />
      <div style={{ paddingTop: '64px' }}></div>
      
      {/* Inner container */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          backgroundColor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          About Dish Discover
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Dish Discover is an AI-powered web app that helps you decide what to cook based on the ingredients you have at home.
          Our mission is to reduce food waste, promote healthy eating, and simplify meal planning by inspiring you with creative dishes and generating smart shopping lists.
        </Typography>

        <Grid2 container gap={4}>
          {/* Tile 1 */}
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Card sx={{ height: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={ingredientsImage}
                alt="Using ingredients at home"
                sx={{ height: 200, objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
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
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Card sx={{ height: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={healthyEatingImage}
                alt="Healthy eating"
                sx={{ height: 200, objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
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
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Card sx={{ height: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={shoppingListImage}
                alt="Smart shopping list"
                sx={{ height: 200, objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
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
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Card sx={{ height: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={customDishesImage}
                alt="Personalized recipes"
                sx={{ height: 200, objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
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
