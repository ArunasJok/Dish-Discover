// src/pages/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
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
} from '@mui/material';

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

  const ingredientEmojis = {
    tomato: '🍅',
    cheese: '🧀',
    basil: '🌿',
    chicken: '🍗',
    garlic: '🧄',
    onion: '🧅',
    pepper: '🌶️',
  };

  const getIngredientEmoji = (ingredient) => {
    const lower = ingredient.toLowerCase();
    return ingredientEmojis[lower] || '🥦'; // default emoji if not found
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
          Telemetry Data
        </Typography>
        <Typography variant="body1">
          Most popular searched ingredients:{' '}
          {telemetry.popularIngredients ? telemetry.popularIngredients.join(', ') : 'N/A'}
        </Typography>
        <Typography variant="body1">
          Recipes searched in the last week: {telemetry.recipesLastWeek || 0}
        </Typography>
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
