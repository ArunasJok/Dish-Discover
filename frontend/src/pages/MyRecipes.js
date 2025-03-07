// MyRecipes page component
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import RateRecipe from '../components/RateRecipe';
import { API_URL } from '../config';

const MyRecipes = () => {
  const { authToken } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState('');

  const fetchMyRecipes = useCallback(async () => {
    try {
      const res = await axios.get(`${config.API_URL}/api/recipes/my`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setRecipes(res.data);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      setMessage('Failed to fetch saved recipes');
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      fetchMyRecipes();
    }
  }, [authToken, fetchMyRecipes]);

  return (
    <div className="App">
      <h2>My Saved Recipes</h2>
      {message && <p>{message}</p>}
      {recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe._id} style={{ marginBottom: '15px' }}>
              <Link to={`/recipe/${recipe.spoonacularId}`}>
                <strong>{recipe.title}</strong>
              </Link>
              <div>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  style={{ width: '200px', height: 'auto', marginTop: '10px' }}
                />
              </div>
              <p>Current Rating: {recipe.rating.toFixed(1)} ({recipe.ratingCount} ratings)</p>
              <RateRecipe recipeId={recipe._id} onRatingUpdated={fetchMyRecipes} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved recipes found.</p>
      )}
    </div>
  );
};

export default MyRecipes;
