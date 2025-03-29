// src/pages/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Grid2
} from '@mui/material';
import * as emoji from 'node-emoji';

const Dashboard = () => {
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [telemetry, setTelemetry] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('');


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setErrorMessage('Failed to fetch user profile.');
      }
    };

    const fetchSearchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/searchhistory`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setSearchHistory(res.data);
      } catch (error) {
        console.error('Error fetching search history:', error);
      }
    };

    const fetchTelemetry = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/telemetry`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setTelemetry(res.data);
      } catch (error) {
        console.error('Error fetching telemetry:', error);
      }
    };

    if (authToken) {
      fetchProfile();
      fetchSearchHistory();
      fetchTelemetry();
    }
  }, [authToken]);

  const filteredHistory = searchHistory.filter((entry) => {
    const lowerFilter = filter.toLowerCase();
    return (
      entry.searchTitle.toLowerCase().includes(lowerFilter) ||
      entry.popularIngredients.join(' ').toLowerCase().includes(lowerFilter)
    );
  });


  const getIngredientEmoji = (ingredient) => {
    const key = ingredient.toLowerCase();
    const found = emoji.get(key);
    return found !== `:${key}:` ? found : '🥦'; // if not found, return broccoli as default
  };

  const ingredientImageUrl = (ingredient) => {
    const formatted = ingredient.toLowerCase().replace(/\s+/g, '-');
    return `https://spoonacular.com/cdn/ingredients_100x100/${formatted}.jpg`;
  };

  const renderIngredientTiles = () => {
    if (!telemetry.popularIngredients || telemetry.popularIngredients.length === 0) {
      return <Typography variant="body1">No ingredient data available.</Typography>;
    }

    const ingredients = telemetry.popularIngredients.slice(0, 10);
    return (
      <Grid2 container spacing={2}>
        {ingredients.map((ingredient, idx) => (
          <Grid2 key={idx} xs={6} sm={4} md={2.4}>
            <Card sx={{ textAlign: 'center' }}>
              <CardMedia
                component="img"
                image={ingredientImageUrl(ingredient)}
                alt={ingredient}
                sx={{ width: '100%', height: 100, objectFit: 'cover' }}
              />
              <CardContent sx={{ py: 1, px: 1 }}>
                <Typography variant="body2">{ingredient}</Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    );
  };

    return (
      <Container sx={{ mt: 4 }}>
        {errorMessage && (
          <Typography variant="body1" color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}

        <Typography variant="h4" color="primary" gutterBottom>
          Welcome back, {user && user.username ? user.username : 'User'}! 👋
        </Typography>
        {user && user.lastVisited && (
          <Typography variant="body1" gutterBottom>
            Last visited: {new Date(user.lastVisited).toLocaleString()}
          </Typography>
        )}

        {/* Telemetry Section */}
        <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Most Popular Ingredients
        </Typography>
        {renderIngredientTiles()}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Most Popular Ingredients
          </Typography>
          {telemetry.popularIngredients && telemetry.popularIngredients.length > 0 ? (
            <Grid2 container spacing={2}>
              {telemetry.popularIngredients.slice(0, 10).map((ingredient, idx) => (
                <Grid2 key={idx} xs={6} sm={4} md={2.4}>
                  <Card sx={{ textAlign: 'center' }}>
                    <CardMedia
                      component="img"
                      image={ingredientImageUrl(ingredient)}
                      alt={ingredient}
                      sx={{ width: '100%', height: 100, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ py: 1, px: 1 }}>
                      <Typography variant="body2">{ingredient}</Typography>
                    </CardContent>
                  </Card>
                </Grid2>
              ))}
            </Grid2>
          ) : (
            <Typography variant="body1">No ingredient data available.</Typography>
          )}
        </Box>

        {/* Search History Section with Filtering */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Recipe Search History (Last Week)
          </Typography>
          <TextField
            label="Filter history"
            variant="outlined"
            fullWidth
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ mb: 2 }}
          />
          {filteredHistory.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Search Title</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Popular Ingredients</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistory.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell>{entry.searchTitle}</TableCell>
                      <TableCell>{new Date(entry.searchDate).toLocaleString()}</TableCell>
                      <TableCell>
                        {entry.popularIngredients.map((ingredient, index) => (
                          <span key={index} style={{ marginRight: 4 }}>
                            {getIngredientEmoji(ingredient)} {ingredient}
                          </span>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No search history available.</Typography>
          )}
        </Box>
      </Container>
    );
  };

  export default Dashboard;
