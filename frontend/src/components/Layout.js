// Layout page component
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
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
//import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
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
    // A flex container to ensure footer stays at the bottom.
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Render Header only if not on the Home route */}
      {!isHome && (
        <>
          <AppBar position="static">
            <Toolbar>
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
          <Box component="nav">
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        </>
      )}

      {/* Main content */}
      <Box component="main" sx={{ flex: 1, padding: 2 }}>
        {children}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout;
