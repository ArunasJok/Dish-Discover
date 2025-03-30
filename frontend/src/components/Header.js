// Header component
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Logo from '../images/logo.png';
//import './Header.css';

const Header = () => {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to Home after logout
  };

  // Links for users who are not logged in
  const publicLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },    
    { label: 'Register', to: '/register' },
  ];

  // Links for authenticated users
  const dashboardLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'My Recipes', to: '/my-recipes' },
    { label: 'Meal Planner', to: '/meal-planner' },
    { label: 'Find a Dish', to: '/ingredients' },
    { label: 'Profile', to: '/profile' },
    { label: 'Shopping List', to: '/shopping-list' },
  ];

  const linksToRender = authToken ? dashboardLinks : publicLinks;

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side: Logo and App Name */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={Logo}
            alt="Dish Discover Logo"
            sx={{ height: 40, mr: 1 }}
          />
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
            }}
          >
            Dish Discover
          </Typography>
        </Box>
        {/* Right side: Navigation links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {linksToRender.map((link) => (
            <Button
              key={link.to}
              component={NavLink}
              to={link.to}
              sx={{
                textTransform: 'none',
                color: 'inherit',
                // Highlight active link with a bottom border
                '&.active': {
                  borderBottom: '2px solid',
                },
              }}
            >
              {link.label}
            </Button>
          ))}
          {authToken && (
            <Button
              onClick={handleLogout}
              sx={{ textTransform: 'none', color: 'inherit' }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
