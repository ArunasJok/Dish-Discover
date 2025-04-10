import React, { useState, useEffect, useContext } from 'react';
import { 
    Container, Typography, Box, TextField, Button, Grid2, 
    Avatar, Chip, Paper, FormControl, Select, MenuItem, Stack,
    CircularProgress, Alert, Snackbar
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

// Constants remain the same
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
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Only keep local storage for avatar, everything else from server
    useEffect(() => {
      const fetchProfile = async () => {
          try {
              setIsLoading(true);
              // Get avatar from local storage only
              const localAvatar = localStorage.getItem('userAvatar');
              
              // Get everything else from the database
              const response = await axios.get(`${API_URL}/api/profile`, {
                  headers: { 'Authorization': `Bearer ${authToken}` }
              });

              // Process the dietary preferences from the server
              let serverPreferences = [];
              if (response.data.dietaryPreferences) {
                  if (Array.isArray(response.data.dietaryPreferences)) {
                      serverPreferences = response.data.dietaryPreferences;
                  } else if (typeof response.data.dietaryPreferences === 'string') {
                      try {
                          serverPreferences = JSON.parse(response.data.dietaryPreferences);
                      } catch {
                          serverPreferences = response.data.dietaryPreferences
                              .split(',')
                              .map(pref => pref.trim())
                              .filter(pref => pref !== '');
                      }
                  }
              }
              
              // Process allergies from the server
              let serverAllergies = [];
              if (response.data.allergies) {
                  if (Array.isArray(response.data.allergies)) {
                      serverAllergies = response.data.allergies;
                  } else if (typeof response.data.allergies === 'string') {
                      try {
                          serverAllergies = JSON.parse(response.data.allergies);
                      } catch {
                          serverAllergies = response.data.allergies
                              .split(',')
                              .map(allergy => allergy.trim())
                              .filter(allergy => allergy !== '');
                      }
                  }
              }
              
              // For debugging only
              console.log('Server preferences received:', response.data.dietaryPreferences);
              console.log('Processed preferences:', serverPreferences);
              console.log('Server allergies received:', response.data.allergies);
              console.log('Processed allergies:', serverAllergies);
              
              setProfile({ 
                  ...response.data, 
                  password: '',
                  avatarUrl: localAvatar || '',
                  dietaryPreferences: serverPreferences || [],
                  allergies: serverAllergies || []
              });
              setIsLoading(false);
          } catch (error) {
              console.error('Profile fetch error:', error);
              setMessage('Failed to fetch user profile');
              setIsLoading(false);
          }
      };
  
      if (authToken) fetchProfile();
    }, [authToken]);

    // Save changes immediately to the server
    const handleDietaryChange = async (event) => {
        const newPreferences = Array.isArray(event.target.value) ? event.target.value : [];
        
        // Update local state first for responsive UI
        setProfile(prev => ({
            ...prev,
            dietaryPreferences: newPreferences
        }));
        
        // Then update on server
        try {
            console.log('Sending dietary preferences to server:', newPreferences);
            const response = await axios.put(`${API_URL}/api/profile`, 
                { dietaryPreferences: newPreferences },
                { headers: { 'Authorization': `Bearer ${authToken}` }}
            );
            console.log('Server response for dietary update:', response.data);
        } catch (error) {
            console.error('Failed to update dietary preferences:', error);
        }
    };

    // Add allergy and save to server
    const handleAddAllergy = async () => {
        if (newAllergy && !profile.allergies.includes(newAllergy)) {
            const updatedAllergies = [...profile.allergies, newAllergy];
            
            // Update local state
            setProfile({ 
                ...profile, 
                allergies: updatedAllergies 
            });
            setNewAllergy('');
            
            // Update server
            try {
                await axios.put(`${API_URL}/api/profile`, 
                    { allergies: updatedAllergies },
                    { headers: { 'Authorization': `Bearer ${authToken}` }}
                );
            } catch (error) {
                console.error('Failed to update allergies:', error);
            }
        }
    };

    // Remove allergy and save to server
    const handleRemoveAllergy = async (allergyToRemove) => {
        const updatedAllergies = profile.allergies.filter(allergy => allergy !== allergyToRemove);
        
        // Update local state
        setProfile({
            ...profile,
            allergies: updatedAllergies
        });
        
        // Update server
        try {
            await axios.put(`${API_URL}/api/profile`, 
                { allergies: updatedAllergies },
                { headers: { 'Authorization': `Bearer ${authToken}` }}
            );
        } catch (error) {
            console.error('Failed to update allergies:', error);
        }
    };

    // Toggle allergy selection
    const handleToggleAllergy = async (allergy) => {
        const isSelected = profile.allergies.includes(allergy);
        let updatedAllergies;
        
        if (isSelected) {
            // Remove allergy
            updatedAllergies = profile.allergies.filter(a => a !== allergy);
        } else {
            // Add allergy
            updatedAllergies = [...profile.allergies, allergy];
        }
        
        // Update local state
        setProfile({
            ...profile,
            allergies: updatedAllergies
        });
        
        // Update server
        try {
            await axios.put(`${API_URL}/api/profile`, 
                { allergies: updatedAllergies },
                { headers: { 'Authorization': `Bearer ${authToken}` }}
            );
        } catch (error) {
            console.error('Failed to update allergies:', error);
        }
    };

    // Main profile update function
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
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
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (status === 200) {
                setMessage(data.message || 'Profile updated successfully');
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                
                // Clear password field after successful update
                setProfile(prev => ({
                    ...prev,
                    password: ''
                }));
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setMessage(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    // Avatar functions remain local storage based
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1 * 1024 * 1024) { // 1MB limit
            setMessage('Image is too large. Maximum size is 1MB for browser storage.');
            return;
        }

        setIsUploading(true);
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const dataUrl = event.target.result;
                
                // Save to localStorage
                localStorage.setItem('userAvatar', dataUrl);
                
                // Update UI
                setProfile(prev => ({ ...prev, avatarUrl: dataUrl }));
                
                setMessage('Profile picture saved to your browser');
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } catch (error) {
                console.error('Error saving image to localStorage:', error);
                setMessage('Failed to save image. It might be too large for browser storage.');
            } finally {
                setIsUploading(false);
            }
        };
        
        reader.onerror = () => {
            setMessage('Failed to read the image file');
            setIsUploading(false);
        };
        
        reader.readAsDataURL(file);
    };

    const handleClearAvatar = () => {
        localStorage.removeItem('userAvatar');
        setProfile(prev => ({ ...prev, avatarUrl: '' }));
        setMessage('Profile picture removed');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
      <Container sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom>
              Profile
          </Typography>
          {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
              </Box>
          ) : (
          <Grid2 container spacing={4}>
              {/* Left side - Profile Picture */}
              <Grid2 item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', position: 'sticky', top: 100 }}>
                    <Avatar
                        src={profile.avatarUrl || ''}
                        alt={profile.username || 'Profile'}
                        sx={{ 
                            width: 200, 
                            height: 200, 
                            margin: 'auto', 
                            mb: 2,
                            boxShadow: 3,
                            bgcolor: 'primary.main'
                        }}
                    >
                        {!profile.avatarUrl && profile.username && profile.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
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
                                startIcon={isUploading ? <CircularProgress size={16} /> : <PhotoCamera />}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Processing...' : 'Change Photo'}
                            </Button>
                        </label>
                        {profile.avatarUrl && (
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={handleClearAvatar}
                            >
                                Remove
                            </Button>
                        )}
                    </Box>                    
                </Box>
              </Grid2>

              {/* Right side - Profile Information */}
              <Grid2 item xs={12} md={8}>
                  {message && !showSuccess && (
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
                                      value={profile.username || ''}
                                      onChange={handleChange}
                                  />
                              </Grid2>
                              <Grid2 item xs={12}>
                                  <TextField
                                      fullWidth
                                      label="Email"
                                      name="email"
                                      type="email"
                                      value={profile.email || ''}
                                      onChange={handleChange}
                                  />
                              </Grid2>
                              <Grid2 item xs={12}>
                                  <TextField
                                      fullWidth
                                      label="Password"
                                      name="password"
                                      type="password"
                                      value={profile.password || ''}
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
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Changes are saved automatically
                      </Typography>
                      <FormControl fullWidth>
                          <Select
                              multiple
                              value={Array.isArray(profile.dietaryPreferences) ? profile.dietaryPreferences : []}
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
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Click to select/deselect (changes save automatically)
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        {COMMON_ALLERGIES.map((allergy) => {
                            const isSelected = Array.isArray(profile.allergies) && 
                                              profile.allergies.includes(allergy);
                            
                            return (
                                <Chip
                                    key={allergy}
                                    label={allergy}
                                    onClick={() => handleToggleAllergy(allergy)}
                                    color={isSelected ? "primary" : "default"}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: isSelected ? 'primary.light' : 'action.hover',
                                        },
                                    }}
                                />
                            );
                        })}
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
                          {Array.isArray(profile.allergies) && profile.allergies
                              .filter(allergy => !COMMON_ALLERGIES.includes(allergy))
                              .map((allergy) => (
                                  <Chip
                                      key={allergy}
                                      label={allergy}
                                      onDelete={() => handleRemoveAllergy(allergy)}
                                      color="primary"
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
                          Save Profile
                      </Button>
                  </Box>
              </Grid2>
          </Grid2>
          )}
          
          <Snackbar 
              open={showSuccess} 
              autoHideDuration={3000} 
              onClose={() => setShowSuccess(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
              <Alert severity="success" onClose={() => setShowSuccess(false)}>
                  {message}
              </Alert>
          </Snackbar>
      </Container>
    );
};

export default Profile;