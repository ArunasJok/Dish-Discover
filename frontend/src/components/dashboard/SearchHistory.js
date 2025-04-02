import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';

const SearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/searchhistory`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setSearchHistory(response.data);
      } catch (error) {
        console.error('Error fetching search history:', error);
        setError('Failed to load search history');
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchHistory();
    }
  }, [authToken]);

  const handleClearHistory = async () => {
    try {
      await axios.delete(`${API_URL}/api/searchhistory`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
      setError('Failed to clear history');
    }
  };

  const filteredHistory = searchHistory.filter(entry => {
    if (!entry || !entry.searchTitle) return false;
    
    const searchTerm = (filter || '').toLowerCase();
    
    // Check for title match
    const titleMatch = entry.searchTitle.toLowerCase().includes(searchTerm);
    
    // Check for ingredients match with null checks
    const ingredientsMatch = Array.isArray(entry.popularIngredients) && 
      entry.popularIngredients.some(ing => 
        ing && ing.toLowerCase().includes(searchTerm)
      );
    
    return titleMatch || ingredientsMatch;
  });

  useEffect(() => {
    console.log('Search History:', searchHistory);
  }, [searchHistory]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            fontFamily: '"Montserrat", "Arial", sans-serif',
            borderBottom: '2px solid',
            borderColor: 'primary.light',
            paddingBottom: 1
          }}
        >
          Recipe History
        </Typography>
        <Tooltip title="Clear history">
          <IconButton onClick={handleClearHistory} size="small">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="Filter recipes"
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
                <TableCell>Search Query</TableCell>
                <TableCell>Ingredients</TableCell>
                <TableCell>Search Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.map((entry) => (
                <TableRow 
                  key={entry._id} 
                  hover
                  onClick={() => navigate('/search', { 
                    state: { ingredients: entry.popularIngredients.join(',') }
                  })}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{entry.searchTitle}</TableCell>
                  <TableCell>{entry.popularIngredients.slice(0, 3).join(', ')}</TableCell>
                  <TableCell>{new Date(entry.searchDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No search history available.</Typography>
      )}
    </Box>
  );
};

export default SearchHistory;