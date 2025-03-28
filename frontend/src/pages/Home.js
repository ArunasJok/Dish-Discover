//Home page component
import React from 'react';
import {
  Box,
  Grid2,
  Typography  
} from '@mui/material';
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
          Find recipes using your available ingredients.
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
          alignItems: 'flex-start',
          p: 4,
        }}
      >
        <Box sx={{ maxWidth: 400, width: '100%' }}>
          {/* Login component */}
          <Login />
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default Home;
