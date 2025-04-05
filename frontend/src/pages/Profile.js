// src/pages/Profile.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const Profile = () => {
  const { authToken } = useContext(AuthContext);
  const [profile, setProfile] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  // Fetch the current user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setProfile({ ...response.data, password: '' });
      } catch (error) {
        setMessage('Failed to fetch user profile');
      }
    };

    if (authToken) {
      fetchProfile();
    }
  }, [authToken]);

  // Handle form input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle the form submission for profile updates
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        username: profile.username,
        email: profile.email,
      };
      if (profile.password.trim() !== '') {
        updateData.password = profile.password;
      }
      const response = await axios.put(`${API_URL}/api/profile`, updateData, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Profile
      </Typography>
      {message && (
        <Typography variant="body1" color="error" gutterBottom>
          {message}
        </Typography>
      )}
      <Box component="form" onSubmit={handleUpdate} noValidate sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Password"
              name="password"
              type="password"
              value={profile.password}
              onChange={handleChange}
              helperText="Enter new password (optional)"
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Update Profile
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
