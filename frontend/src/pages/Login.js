// This is a simple login page for a React application using Material-UI components.
// It includes a form for user login with email and password fields, a submit button, and a message area for feedback.
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';
import { Box, TextField, Button, Typography } from '@mui/material';
import { sharedBoxStyle } from '../components/sharedBoxStyle';
import LandingNavButtons from '../components/LandingNavButtons';



const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const data = await loginUser(credentials);
      if (data.token) {
        login(data.token); 
        setMessage('Login successful!');
        navigate('/dashboard');
      } else {
        setMessage('Login failed!');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <Box sx={{ 
      backgroundColor: 'transparent', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',       
      mt: 0,
      }}>

        <LandingNavButtons />
              <div style={{ paddingTop: '64px' }}></div>
              
      <Box 
      sx={sharedBoxStyle} 
      component="form"
      mt={4} 
      onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Please Login
        </Typography>

        <TextField
          label="Email"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={credentials.email}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={credentials.password}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
          sx={{ textTransform: 'none' }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        {message && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>    
  );
};


export default Login;