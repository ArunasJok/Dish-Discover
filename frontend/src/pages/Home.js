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
import Logo from '../images/logo.png';

const Home = () => {
  return (
    // Grey background
    <Box sx={{ backgroundColor: 'primary.light', minHeight: '60vh', py: 2, mt: 5, pb: 4 }}>
      
      <LandingNavButtons />
      <div style={{ paddingTop: '44px' }}></div>

      {/* Centered white container */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          backgroundColor: 'grey.100',          
          borderRadius: 4,
          boxShadow: 3,
          position: 'top',
          maxHeight: 700,          
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Grid2 container>
          {/* Left side: illustration & text */}
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{
              backgroundColor: '#f8f8f8',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              position: 'relative',
              maxHeight: 700,
              mt: { xs: 0, md: 4 },
              mb: { xs: 2, md: 4 },              
              borderRadius: 4,
            }}
          >
            <Box
              component="img"
              src={homeImage}
              alt="Cooking pot"
              sx={{
                width: { xs: '40%', sm: '100%' },
                maxWidth: 400,
                mb: 2,
                flexShrink: 1,
              }}
            />
            <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 1, 
              textAlign: 'center', 
              fontSize: { xs: '1.2rem', md: '2rem', lg: '2.5rem' },
              fontFamily: '"Poppins", "Helvetica Neue", sans-serif',
              }}
            >
              Cook with what you have
            </Typography>
            <Typography 
            variant="body1" 
            color="textSecondary"
            sx={{
              textAlign: 'center',
              fontSize: { xs: '0.8rem', md: '1rem', lg: '1.2rem' },
              fontFamily: '"Poppins", "Helvetica Neue", sans-serif',
              }}
            >
              Helping you cook with the ingredients you have at home. Preventing waste, 
              promoting healthy eating, and simplifying meal planning.
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
              position: 'relative',
              p: { xs: 1, md: 2 },
            }}
          >
            <Box 
            component="img"
            src={Logo}
            alt="Dish Discover Logo"

            sx={{ 
              display: 'flex', 
              width: { xs: '40%', sm: '100%' },
              maxWidth: 200,
              maxHeight: 200,
              mt: 8,
              mb: 0,
              flexShrink: 1,
               }}
              >                           
            </Box>         

            <Box sx={{ maxWidth: 400, width: '100%', p: { xs: 1, md: 2 }, flexShrink: 1 }}>
              <Login />
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default Home;
