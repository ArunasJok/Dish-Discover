// src/pages/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [telemetry, setTelemetry] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch user profile, search history, and telemetry data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
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
        const res = await axios.get('http://localhost:5000/api/searchhistory', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setSearchHistory(res.data);
      } catch (error) {
        console.error('Error fetching search history:', error);
      }
    };

    const fetchTelemetry = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/telemetry', {
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

  return (
    <div className="App">
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <h1>Welcome back, {user ? user.username : 'User'}!</h1>
      {user && user.lastVisited && (
        <p>Last visited: {new Date(user.lastVisited).toLocaleString()}</p>
      )}
      
      <h2>Your Recipe Search History (Last Week)</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Search Title</th>
            <th>Date</th>
            <th>Popular Ingredients</th>
          </tr>
        </thead>
        <tbody>
          {searchHistory.length > 0 ? (
            searchHistory.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.searchTitle}</td>
                <td>{new Date(entry.searchDate).toLocaleString()}</td>
                <td>{entry.popularIngredients.join(', ')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No search history available.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Telemetry Data</h2>
      <ul>
        <li>
          Most popular searched ingredients:{' '}
          {telemetry.popularIngredients ? telemetry.popularIngredients.join(', ') : 'N/A'}
        </li>
        <li>Recipes searched in the last week: {telemetry.recipesLastWeek || 0}</li>
      </ul>
    </div>
  );
};

export default Dashboard;
