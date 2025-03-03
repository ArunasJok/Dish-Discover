// Dummy Register page component
import React, { useState } from 'react';
//import axios from 'axios';
import { registerUser } from '../services/apiService';

const Register = () => {
   const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',

});
const [message, setMessage] = useState('');

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
  } catch (err) {
    setMessage(err.response?.data?.error || 'Registration failed');
  }
};

return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          onChange={handleChange} 
          value={formData.username}
          required 
        />
        <br />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
          value={formData.email}
          required 
        />
        <br />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          value={formData.password}
          required 
        />
        <br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;