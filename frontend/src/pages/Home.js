//Home page component
import React from 'react';
import {
  Box,
  Grid2,
  Typography,
  Button  
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import homeImage from '../images/homepage.png';
import Login from './Login';

const Home = () => {
  return (
    <Grid2 container sx={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Left side: illustration & text */}
      <Grid2
        item
        xs={12}
        md={6}
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
          Helping you cook with the ingredients you have at home to prevent waste, promote healthy eating, and simplify meal planning.
        </Typography>        
      </Grid2>

      {/* Right side: re-using our Login form */}
      <Grid2
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
        }}        
      >
        <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 2 }}>
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
        <Box sx={{ maxWidth: 400, width: '100%', mr: 40 }}>
          {/* Login component */}
          <Login />
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default Home;
