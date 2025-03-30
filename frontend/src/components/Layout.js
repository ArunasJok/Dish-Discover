// Layout page component
import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';  // Import your modern Header component
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    // A flex container to ensure the footer stays at the bottom
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>     
      <Header />
      {/* Main content area. */}
      <Box component="main" sx={{ flex: 1, p: 2, position: 'relative', mt: 2 }}>
        {children}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout;
