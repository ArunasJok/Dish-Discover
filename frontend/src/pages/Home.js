//Home page component
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid2,
  Card  
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import homeImage from '../images/homepage.png';
import Login from './Login';

const Home = () => {
  return (
    // Outer Box for grey background
    <Box
      sx={{
        backgroundColor: '#f0f0f0', // grey background
        minHeight: '100vh',
        py: 4, // top/bottom padding
      }}
    >
      {/* Inner Box centered on the page */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto', // center horizontally
          backgroundColor: 'white',
          borderRadius: 2,
          p: { xs: 2, md: 4 }, // responsive padding
          position: 'relative', // so the top-right nav can position correctly
        }}
      >
        {/* Two-column layout */}
        <Grid2 container sx={{ minHeight: 'calc(100vh - 64px)' }}>
          {/* Left side: illustration & text */}
          <Grid2
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
            }}
          >
            <Box
              component="img"
              src={homeImage}
              alt="Cooking pot"
              sx={{ width: '80%', maxWidth: 400, mb: 3 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Dish Discover - Cook with what you have
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Helping you cook with the ingredients you have at home to prevent waste, 
              promote healthy eating, and simplify meal planning.
            </Typography>
          </Grid2>

          {/* Right side: Login form */}
          <Grid2
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
            }}
          >
            {/* Navigation buttons in top-right */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                gap: 2,
              }}
            >
              <Button component={NavLink} to="/" variant="outlined" color="primary">
                Home
              </Button>
              <Button component={NavLink} to="/about" variant="outlined" color="primary">
                About
              </Button>
              <Button component={NavLink} to="/register" variant="outlined" color="primary">
                Register
              </Button>
            </Box>

            <Box sx={{ maxWidth: 400, width: '100%' }}>
              {/* Login element */}
              <Login />
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default Home;
