// Context to handle the authentication state of the user.
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize the auth token with the value stored in local storage
  const [authToken, setAuthToken] = useState(null);

  // Function to handle login
  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem('token', token);
  };
  
  // Function to handle logout
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
