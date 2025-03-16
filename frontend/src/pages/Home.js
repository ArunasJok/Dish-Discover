//Home page component
import React from 'react';
import { Typography } from '@mui/material';

const Home = () => {
  return (
    <div className="App" style={{ padding: '20px' }}>
      <Typography variant="h2" color="primary" gutterBottom>
        Welcome to Dish Discover
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Your one-stop solution for creative recipes based on what you have at home.
      </Typography>      
    </div>
  );
};

export default Home;
