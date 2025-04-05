import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../images/logo.png';

const Header = () => {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const publicLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Register', to: '/register' },
  ];

  const dashboardLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'My Recipes', to: '/my-recipes' },
    { label: 'Meal Planner', to: '/meal-planner' },
    { label: 'Find a Dish', to: '/ingredients' },
    { label: 'Profile', to: '/profile' },
    { label: 'Shopping List', to: '/shopping-list' },
  ];

  const linksToRender = authToken ? dashboardLinks : publicLinks;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" color="primary" elevation={3}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px' }}>       
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={Logo}
            alt="Dish Discover Logo"
            sx={{
              height: '100%', 
              maxHeight: '60px',
              mr: 1,
              p: 0,
            }}
          />
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 700,
              mr: 4,
              fontSize: '1.2rem',
              '&:hover': {
                textShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            Dish Discover
          </Typography>
        </Box>

        {/* Right side: Navigation links */}
        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {linksToRender.map((link) => (
                <MenuItem
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  onClick={handleMenuClose}
                >
                  {link.label}
                </MenuItem>
              ))}
              {authToken && (
                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                  Logout
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {linksToRender.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                sx={{
                  textTransform: 'none',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '1rem',
                  '&.active': {
                    borderBottom: '4px solid white',
                  },
                  '&:hover' : {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
            {authToken && (
              <Button
                onClick={handleLogout}
                sx={{ 
                  textTransform: 'none', 
                  color: 'white', 
                  fontWeight: 500, 
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: 'rgba(223, 38, 38, 0.91)',
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;