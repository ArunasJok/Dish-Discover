// Navigation for landing pages
import React from 'react';
import { Box, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

const LandingNavButtons = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        gap: 2,
        zIndex: 10,
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
  );
};

export default LandingNavButtons;
