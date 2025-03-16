// Desc: Main App component that contains all the routes for the application
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
import MealPlanner from './pages/MealPlanner';
import Ingredients from './pages/Ingredients';
import RecipeDetail from './pages/RecipeDetail';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected / Authenticated Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
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
