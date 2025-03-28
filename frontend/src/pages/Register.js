// Register page component
import React, { useState } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import { Box, TextField, Button, Typography } from '@mui/material';
import LandingNavButtons from '../components/LandingNavButtons';

const Register = () => {
   const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',

});
const [message, setMessage] = useState('');
const navigate = useNavigate();

// Handle form changes
const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

//Submit registration data from the form to the backend
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await registerUser(formData);
    setMessage(data.message);
    navigate('/login');
  } catch (err) {
    setMessage(err.response?.data?.error || 'Registration failed');
  }
};

return (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 64px)', // Adjust if you have a header
      px: 2,
    }}
  >
    <LandingNavButtons />
    <Typography variant="h4" gutterBottom>
      Register
    </Typography>
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: '100%', maxWidth: 400 }}
    >
      <TextField
        fullWidth
        margin="normal"
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Register
      </Button>
    </Box>
    {message && (
      <Typography variant="body2" color="error" sx={{ mt: 2 }}>
        {message}
      </Typography>
    )}
  </Box>
);
};

export default Register;