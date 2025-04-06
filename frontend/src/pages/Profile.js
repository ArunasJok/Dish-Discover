import React, { useState, useEffect, useContext } from 'react';
import { 
    Container, Typography, Box, TextField, Button, Grid2, 
    Avatar, Chip, Paper, FormControl, Select, MenuItem, Stack
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const DIETARY_OPTIONS = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Kosher', 'Halal', 'Keto', 'Paleo'
];

const COMMON_ALLERGIES = [
    'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Soy', 
    'Wheat', 'Fish', 'Shellfish'
];

const Profile = () => {
    const { authToken } = useContext(AuthContext);
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        password: '',
        avatarUrl: '',
        dietaryPreferences: [],
        allergies: []
    });
    const [message, setMessage] = useState('');
    const [newAllergy, setNewAllergy] = useState('');

    useEffect(() => {
      const fetchProfile = async () => {
          try {
              const response = await axios.get(`${API_URL}/api/profile`, {
                  headers: { 'Authorization': `Bearer ${authToken}` }
              });
              console.log('Fetched profile:', response.data); // Debug log
              setProfile({ 
                  ...response.data, 
                  password: '',
                  // Ensure arrays are initialized even if null/undefined
                  dietaryPreferences: response.data.dietaryPreferences || [],
                  allergies: response.data.allergies || []
              });
          } catch (error) {
              console.error('Profile fetch error:', error);
              setMessage('Failed to fetch user profile');
          }
      };
  
      if (authToken) fetchProfile();
  }, [authToken]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await axios.post(`${API_URL}/api/profile/avatar`, formData, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProfile({ ...profile, avatarUrl: response.data.avatarUrl });
            setMessage('Profile picture updated successfully');
        } catch (error) {
            setMessage('Failed to upload profile picture');
        }
    };

    const handleDietaryChange = (event) => {
      const newPreferences = Array.isArray(event.target.value) ? event.target.value : [];
      console.log('New dietary preferences:', newPreferences); // Debug log
      setProfile(prev => ({
          ...prev,
          dietaryPreferences: newPreferences
      }));
  };

    const handleAddAllergy = () => {
        if (newAllergy && !profile.allergies.includes(newAllergy)) {
            setProfile({ 
                ...profile, 
                allergies: [...profile.allergies, newAllergy] 
            });
            setNewAllergy('');
        }
    };

    const handleRemoveAllergy = (allergyToRemove) => {
        setProfile({
            ...profile,
            allergies: profile.allergies.filter(allergy => allergy !== allergyToRemove)
        });
    };

    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
          console.log('Updating profile with:', {
              ...profile,
              password: profile.password ? '[REDACTED]' : undefined
          }); // Debug log
          
          const updateData = {
              username: profile.username,
              email: profile.email,
              dietaryPreferences: profile.dietaryPreferences,
              allergies: profile.allergies
          };
          
          if (profile.password.trim()) {
              updateData.password = profile.password;
          }
  
          const { status, data } = await axios.put(`${API_URL}/api/profile`, updateData, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (status === 200) {
            setMessage(data.message || 'Profile updated successfully');
            // Refresh profile data after update
            const { data: updatedProfile } = await axios.get(`${API_URL}/api/profile`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            setProfile({
                ...updatedProfile,
                password: '',
                dietaryPreferences: updatedProfile.dietaryPreferences || [],
                allergies: updatedProfile.allergies || []
            });
        }
    } catch (error) {
        console.error('Profile update error:', error);
        setMessage(error.response?.data?.message || 'Failed to update profile');
    }
};

    return (
      <Container sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom>
              Profile
          </Typography>
          <Grid2 container spacing={4}>
              {/* Left side - Profile Picture */}
              <Grid2 item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', position: 'sticky', top: 100 }}>
                      <Avatar
                          src={profile.avatarUrl}
                          sx={{ 
                              width: 200, 
                              height: 200, 
                              margin: 'auto', 
                              mb: 2,
                              boxShadow: 3 
                          }}
                      />
                      <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="icon-button-file"
                          type="file"
                          onChange={handleImageUpload}
                      />
                      <label htmlFor="icon-button-file">
                          <Button
                              variant="outlined"
                              component="span"
                              startIcon={<PhotoCamera />}
                          >
                              Change Photo
                          </Button>
                      </label>
                  </Box>
              </Grid2>
  
              {/* Right side - Profile Information */}
              <Grid2 item xs={12} md={8}>
                  {message && (
                      <Typography 
                          variant="body1" 
                          color="error" 
                          gutterBottom
                          sx={{ mb: 2 }}
                      >
                          {message}
                      </Typography>
                  )}
                  <Paper sx={{ p: 3, mb: 3 }}>
                      <Box component="form" onSubmit={handleUpdate} noValidate>
                          <Grid2 container spacing={3}>
                              <Grid2 item xs={12}>
                                  <TextField
                                      fullWidth
                                      label="Username"
                                      name="username"
                                      value={profile.username}
                                      onChange={handleChange}
                                  />
                              </Grid2>
                              <Grid2 item xs={12}>
                                  <TextField
                                      fullWidth
                                      label="Email"
                                      name="email"
                                      type="email"
                                      value={profile.email}
                                      onChange={handleChange}
                                  />
                              </Grid2>
                              <Grid2 item xs={12}>
                                  <TextField
                                      fullWidth
                                      label="Password"
                                      name="password"
                                      type="password"
                                      value={profile.password}
                                      onChange={handleChange}
                                      placeholder="Leave blank to keep current password"
                                  />
                              </Grid2>
                          </Grid2>
                      </Box>
                  </Paper>
  
                  <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                          Dietary Preferences
                      </Typography>
                      <FormControl fullWidth>
                          <Select
                              multiple
                              value={profile.dietaryPreferences}
                              onChange={handleDietaryChange}
                              renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {selected.map((value) => (
                                          <Chip key={value} label={value} />
                                      ))}
                                  </Box>
                              )}
                          >
                              {DIETARY_OPTIONS.map((option) => (
                                  <MenuItem key={option} value={option}>
                                      {option}
                                  </MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                  </Paper>
  
                  <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                          Allergies
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                          {COMMON_ALLERGIES.map((allergy) => (
                              <Chip
                                  key={allergy}
                                  label={allergy}
                                  onClick={() => {
                                      if (!profile.allergies.includes(allergy)) {
                                          setProfile({
                                              ...profile,
                                              allergies: [...profile.allergies, allergy]
                                          });
                                      }
                                  }}
                                  color={profile.allergies.includes(allergy) ? "primary" : "default"}
                              />
                          ))}
                      </Stack>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <TextField
                              size="small"
                              label="Add Custom Allergy"
                              value={newAllergy}
                              onChange={(e) => setNewAllergy(e.target.value)}
                          />
                          <Button 
                              onClick={handleAddAllergy}
                              variant="outlined"
                          >
                              Add
                          </Button>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profile.allergies.map((allergy) => (
                              <Chip
                                  key={allergy}
                                  label={allergy}
                                  onDelete={() => handleRemoveAllergy(allergy)}
                              />
                          ))}
                      </Box>
                  </Paper>
  
                  <Box sx={{ mt: 3, textAlign: 'right' }}>
                      <Button 
                          type="submit"
                          variant="contained" 
                          color="primary" 
                          onClick={handleUpdate}
                          size="large"
                      >
                          Save Changes
                      </Button>
                  </Box>
              </Grid2>
          </Grid2>
      </Container>
  );
};

export default Profile;