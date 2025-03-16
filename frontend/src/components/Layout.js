
// src/components/Layout.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to Home after logout
  };

  // Links for guest users
  const publicLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' }
  ];

  // Links for authenticated users
  const dashboardLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'My Recipes', to: '/my-recipes' },
    { label: 'Meal Planner', to: '/meal-planner' },
    { label: 'Find a Dish', to: '/ingredients' },
    { label: 'Profile', to: '/profile' },
    { label: 'Shopping List', to: '/shopping-list' }
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Dish Discover
          </Typography>
          {authToken ? (
            <>
              {dashboardLinks.map(link => (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  color="inherit"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? '#555' : 'transparent'
                  })}
                  sx={{ textTransform: 'none' }}
                >
                  {link.label}
                </Button>
              ))}
              <Button
                onClick={handleLogout}
                color="inherit"
                sx={{ textTransform: 'none' }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {publicLinks.map(link => (
                <Button
                  key={link.to}
                  color="inherit"
                  component={NavLink}
                  to={link.to}
                  sx={{ textTransform: 'none' }}
                >
                  {link.label}
                </Button>
              ))}
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box component="main" sx={{ padding: 2 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ padding: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Dish Discover. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Layout;














//import Header from './Header';
//import Footer from './Footer';

// const Layout = ({ children }) => {
//   return (
//     <div className="layout">
//       <Header />
//       <main style={{ minHeight: '80vh', padding: '20px' }}>
//         {children}
//       </main>
//       <Footer />
//     </div>
//   );
// };

//export default Layout;
