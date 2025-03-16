
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';


const Layout = ({ children }) => {
  return (
    <>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dish Discover
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/register">Register</Button>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/profile">Profile</Button>
          <Button color="inherit" component={Link} to="/my-recipes">My Recipes</Button>
        </Toolbar>
      </AppBar>

      {/* Main content container */}
      <Container sx={{ marginTop: 4 }}>
        {children}
      </Container>

      {/* Footer */}
      <footer style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Dish Discover. All rights reserved.
        </Typography>
      </footer>
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
