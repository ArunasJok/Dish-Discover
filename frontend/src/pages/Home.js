//Home page component
import React from 'react';
import {
  Box,
  Typography,
  Grid2  
} from '@mui/material';
//import { NavLink } from 'react-router-dom';
import homeImage from '../images/homepage.png';
import Login from './Login';
import LandingNavButtons from '../components/LandingNavButtons';

const Home = () => {
  return (
    // Grey background
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', py: 4 }}>
      {/* Centered white container */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          backgroundColor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          position: 'relative',
        }}
      >
        <Grid2 container sx={{ minHeight: 'calc(100vh - 64px)' }}>
          {/* Left side: illustration & text */}
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{
              backgroundColor: '#f8f8f8',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
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

          {/* Right side: Login form & nav buttons */}
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
              position: 'relative',
            }}
          >
            {/* Navigation buttons */}
            <LandingNavButtons />

            <Box sx={{ maxWidth: 400, width: '100%' }}>
              <Login />
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default Home;
