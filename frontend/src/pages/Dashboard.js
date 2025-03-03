// Dashboard page for the user to navigate to different pages
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="App">
      <h1>Dashboard</h1>
      <p>Welcome back! Here’s a quick overview of your account.</p>
      <div>
        <h3>Quick Links</h3>
        <ul>
          <li>
            <Link to="/ingredients">Find New Recipes</Link>
          </li>
          <li>
            <Link to="/my-recipes">My Recipes</Link>
          </li>
          <li>
            <Link to="/meal-planner">Meal Planner</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/shopping-list">Shopping List</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
