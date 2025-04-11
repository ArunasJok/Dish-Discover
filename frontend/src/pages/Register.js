// Register page component
import React, { useState } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import { Box, TextField, Button, Typography, Alert} from '@mui/material';
import LandingNavButtons from '../components/LandingNavButtons';
import { sharedBoxStyle } from '../components/sharedBoxStyle';

const Register = () => {
   const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',

});
const [message, setMessage] = useState('');
//const [snackbarOpen, setSnackbarOpen] = useState(false);
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
    // Set a success message and open the snackbar
    setMessage(data.message);
    setMessage('Registration successful! Redirecting to Home page...');
    //setSnackbarOpen(true);
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  } catch (err) {
    setMessage(err.response?.data?.error || 'Registration failed');
  }
};

return (
  <Box sx={{ 
    backgroundColor: 'primary.light', 
    minHeight: '80vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    py: 4, 
    mt: 0 
    }}
  >
     
      <LandingNavButtons />
      <div style={{ paddingTop: '64px' }}></div>

      {/* White container in the center */}
      <Box sx={sharedBoxStyle}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}
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
          <Alert 
            severity={message.includes('successful') ? 'success' : 'error'} 
            sx={{ mt: 2, textAlign: 'center' }}
          >
            {message}
          </Alert>
        )}
      </Box>
      {/* <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar> */}
    </Box>
  );
};

export default Register;