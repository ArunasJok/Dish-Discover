// src/components/Layout.js
import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation links for guest users
  const publicLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' },
  ];

  // Navigation links for authenticated users
  const dashboardLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'My Recipes', to: '/my-recipes' },
    { label: 'Meal Planner', to: '/meal-planner' },
    { label: 'Find a Dish', to: '/ingredients' },
    { label: 'Profile', to: '/profile' },
    { label: 'Shopping List', to: '/shopping-list' },
  ];

  // Choose which set of links to display
  const links = authToken ? dashboardLinks : publicLinks;

  // Drawer content for mobile navigation
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Dish Discover
      </Typography>
      <List>
        {links.map((link) => (
          <ListItem key={link.to} disablePadding>
            <ListItemButton component={NavLink} to={link.to}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {authToken && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Mobile menu button visible on xs screens */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Dish Discover
          </Typography>
          {/* Desktop navigation links */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {links.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                color="inherit"
                sx={{
                  textTransform: 'none',
                  '&.active': { backgroundColor: '#555' },
                }}
              >
                {link.label}
              </Button>
            ))}
            {authToken && (
              <Button
                onClick={handleLogout}
                color="inherit"
                sx={{ textTransform: 'none' }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Improves performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content area */}
      <Box component="main" sx={{ padding: 2 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          padding: 2,
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          mt: 2,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Dish Discover. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Layout;
