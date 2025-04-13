// This is a simple footer component for a React application.
import React from 'react';
//import './Footer.css'; 
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 4,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Dish Discover. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
