import React from 'react';
import { Box, Typography, Fade } from '@mui/material';

const WelcomeMessage = ({ user, showWelcome, slideIn }) => (
  <Fade in={showWelcome} timeout={5000}>
    <Box 
      sx={{ 
        position: 'fixed', 
        top: 100,          
        right: 40,        
        textAlign: 'right',
        backgroundColor: 'background.paper',
        padding: 3,       
        borderRadius: 2, 
        boxShadow: 3,   
        zIndex: 1100,   
        maxWidth: 300, 
        minWidth: 250,
        animation: `${slideIn} 1.5s ease-out`,
        '&:hover': {
          boxShadow: 6,
          animation: 'none',
        },
        transition: 'all 1.5s ease-in-out',
      }}
    >
      <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
        Welcome back, {user?.username || 'User'}!
      </Typography>
      {user?.lastVisited && (
        <Typography variant="body2" color="text.secondary">
          Last visited: {new Date(user.lastVisited).toLocaleString()}
        </Typography>
      )}
    </Box>
  </Fade>
);

export default WelcomeMessage;