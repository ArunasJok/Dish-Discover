// This file defines the Layout component for the Dish Discover application.
// It sets up the main structure of the application, including the header, footer, and main content area.
import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from './Header';  
import Footer from './Footer';

const Layout = ({ children, bgColor }) => {
  const location = useLocation();
  const publicRoutes = ['/', '/about', '/login', '/register'];
  const effectiveMainBg = publicRoutes.includes(location.pathname) ? (bgColor || 'white') : 'white';
  return (
    // Outer container with full width and background color
    <Box sx={{ 
      backgroundColor: 'primary.light', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      }}
    >
      <Header />      
      <Box sx={{ 
          py: 2,
          px: { xs: 2, md: 0 },  
          flexGrow: 1,
        }}
      >
        <Box 
          component="main" 
          sx={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            p: 2,
            backgroundColor: effectiveMainBg,
            borderRadius: 4,
            boxShadow: 3, 
            position: 'relative' 
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
