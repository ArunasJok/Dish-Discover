// Dummy page for Ingredients
import React, { useState } from 'react';
//import axios from 'axios';
import { getSpoonacularRecipes } from '../services/apiService';


const Ingredients = () => {
  // State to store the ingredients as string and fetched recipes array
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState('');

  // Updating the ingredients state as the user types
  const handleChange = (e) => {
    setIngredients(e.target.value);
  };

  // Handle the form submission to fetch recipe recommendations
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredients) {
      setMessage('Please enter some ingredients.');
      return;
    }
    try {
      const data = await getSpoonacularRecipes(ingredients);
      setRecipes(data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setMessage('Failed to fetch recipes. Please try again.');
    }
  };

  return (
    <div className="App">
      <h2>Find Recipes by Ingredients</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Get Recipes</button>
      </form>
      {message && <p>{message}</p>}
      <div style={{ marginTop: '20px' }}>
        <h3>Recipe Recommendations</h3>
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id} style={{ marginBottom: '15px' }}>
                <strong>{recipe.title}</strong>
                <p>Used Ingredients: {recipe.usedIngredients.map(ing => ing.name).join(', ')}</p>
                <p>Missed Ingredients: {recipe.missedIngredients.map(ing => ing.name).join(', ')}</p>
                <p>Likes: {recipe.likes}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recipes to display. Enter ingredients and click "Get Recipes".</p>
        )}
      </div>
    </div>
  );
};

export default Ingredients;