// Navigation for landing pages
import React from 'react';
import { Box, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

const LandingNavButtons = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        justifyContent: 'flex-end',
        mb: 4,
        width: '100%',
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
