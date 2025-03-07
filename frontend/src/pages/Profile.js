// Profile page for the user to update their profile information
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const Profile = () => {
  const [profile, setProfile] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const { authToken } = useContext(AuthContext);

  // Fetch the current user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        // Set profile without password (or leave password field empty for update)
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
      // Only send the password if it is not empty (optional)
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
    <div className="App">
      <h1>Profile</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="Enter new password (optional)"
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Profile;
