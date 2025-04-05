// Navigation for landing pages
import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Logo from '../images/logo.png';

const LandingNavButtons = () => {
  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: 'white', boxShadow: 'none', color: 'black' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and App Name on the left */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={Logo}
            alt="Dish Discover Logo"
            style={{ width: '80px', height: '80px' }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ ml: 1, fontWeight: 'bold', color: 'black' }}
          >
            Dish Discover
          </Typography>
        </Box>
        {/* Navigation buttons on the right */}
        <Box>
          <Button component={NavLink} to="/" color="inherit">
            Home
          </Button>
          <Button component={NavLink} to="/about" color="inherit">
            About
          </Button>
          <Button component={NavLink} to="/register" color="inherit">
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LandingNavButtons;
