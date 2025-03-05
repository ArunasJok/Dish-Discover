// Login page
import React, { useState, useContext } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';



const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const data = await loginUser(credentials);
      if (data.token) {
        login(data.token); 
        setMessage('Login successful!');
        navigate('/dashboard');
      } else {
        setMessage('Login failed!');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h2>Please Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
          value={credentials.email}
          required 
        />
        <br />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          value={credentials.password}
          required 
        />
        <br />
        <button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;