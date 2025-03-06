import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to Home after logout
  };

  // Links for users who are not logged in
  const publicLinks = (
    <>
      <li><NavLink to="/" end>Home</NavLink></li>
      <li><NavLink to="/about">About</NavLink></li>
      <li><NavLink to="/login">Login</NavLink></li>
      <li><NavLink to="/register">Register</NavLink></li>
    </>
  );

  // Links for authenticated users
  const dashboardLinks = (
    <>
      <li><NavLink to="/dashboard">Dashboard</NavLink></li>
      <li><NavLink to="/my-recipes">My Recipes</NavLink></li>
      <li><NavLink to="/meal-planner">Meal Planner</NavLink></li>
      <li><NavLink to="/ingredients">Find a dish</NavLink></li>
      <li><NavLink to="/profile">Profile</NavLink></li>
      <li><NavLink to="/shopping-list">Shopping List</NavLink></li>
      <li>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </li>
    </>
  );

  return (
    <header className="header">
      <div className="logo">
        <NavLink to="/" end>Dish Discover</NavLink>
      </div>
      <nav>
        <ul className="nav-links">
          {authToken ? dashboardLinks : publicLinks}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
