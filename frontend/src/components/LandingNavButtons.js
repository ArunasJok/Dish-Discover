// This is a simple navigation bar component for a React application using Material-UI.
// It includes a logo, navigation links, and a register button. The layout is responsive for mobile and desktop views.
import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AboutIcon from '@mui/icons-material/Info';
import RegisterIcon from '@mui/icons-material/PersonAdd';
import Logo from '../images/logo.png';

const LandingNavButtons = () => {
  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: 'inherit',
    textDecoration: 'none',
    '&:hover .navLabel': { opacity: 1, transform: 'translateX(0)' },
  };

  const labelStyles = {
    opacity: 0,
    transform: 'translateX(-10px)',
    transition: 'opacity 0.3s, transform 0.3s',
  };

  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: 'grey.100', boxShadow: 'none', color: 'black' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and App Name on the left */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={Logo}
            alt="Dish Discover Logo"
            style={{ width: '40px', height: '40px' }}
          />
          
        </Box>
        {/* Navigation buttons on the right */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={NavLink} to="/" sx={buttonStyles} color="inherit">
            <HomeIcon fontSize="large" />
            <Typography variant="button" className="navLabel" sx={labelStyles}>
              Home
            </Typography>
          </Button>
          <Button component={NavLink} to="/about" sx={buttonStyles} color="inherit">
            <AboutIcon fontSize="large" />
            <Typography variant="button" className="navLabel" sx={labelStyles}>
              About
            </Typography>
          </Button>
          <Button component={NavLink} to="/register" sx={buttonStyles} color="inherit">
            <RegisterIcon fontSize="large" />
            <Typography variant="button" className="navLabel" sx={labelStyles}>
              Register
            </Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LandingNavButtons;
