// Frontend code for the Dish Discover application
// This file is responsible for setting up the main application structure, including routing and layout.
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyRecipes from './pages/MyRecipes';
import Profile from './pages/Profile';
import ShoppingList from './pages/ShoppingList';
import DishAI from './pages/DishAI';
import Ingredients from './pages/Ingredients';
import RecipeDetail from './pages/RecipeDetail';


function App() {
  return (
    <Router>
      <Layout bgColor="primary.light">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected / Authenticated Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/meal-planner" element={<DishAI />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
