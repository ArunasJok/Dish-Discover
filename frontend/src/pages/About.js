// About page component
import React from 'react';
import { Box, Grid2, Typography, Card, CardContent, CardMedia } from '@mui/material';
// Import your images. Adjust these paths to your assets.
import ingredientsImage from '../images/ingredientsImage.png';
import healthyEatingImage from '../images/healthyEatingImage.png';
import shoppingListImage from '../images/shoppingListImage.png';

const About = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        About Dish Discover
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        Dish Discover is an AI-powered web app that helps you decide what to cook based on the ingredients you have at home.
        Our mission is to reduce food waste, promote healthy eating, and simplify meal planning by inspiring you with creative dishes and generating smart shopping lists.
      </Typography>
      
      <Grid2 container spacing={4}>
        <Grid2 item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              image={ingredientsImage}
              alt="Using ingredients at home"
              height="200"
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Reduce Food Waste
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Discover recipes that help you use up the ingredients you already have, cutting down on food waste.
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        
        <Grid2 item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              image={healthyEatingImage}
              alt="Healthy eating"
              height="200"
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Promote Healthy Eating
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Find nutritious recipes that make it easy to prepare balanced meals, keeping you energized and healthy.
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        
        <Grid2 item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              image={shoppingListImage}
              alt="Smart shopping list"
              height="200"
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Smart Shopping Lists
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Automatically generate shopping lists to ensure you have the right ingredients for your next meal.
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
  );
};

export default About;
