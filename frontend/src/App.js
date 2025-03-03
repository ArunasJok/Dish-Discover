// This is the main component of the frontend.

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Ingredients from './pages/Ingredients';
import RecipeDetail from './pages/RecipeDetail';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
