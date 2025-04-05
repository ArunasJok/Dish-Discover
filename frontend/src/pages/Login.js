// Login page
import React, { useState, useContext } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';
import { Box, TextField, Button, Typography } from '@mui/material';
import { sharedBoxStyle } from '../components/sharedBoxStyle';



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
    <Box sx={sharedBoxStyle} component="form" onSubmit={handleSubmit}>
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
  );
};

export default Login;