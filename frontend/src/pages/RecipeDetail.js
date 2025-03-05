// RecipeDetail component to display the details of a recipe
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
//import { getRecipeDetail } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';


const RecipeDetail = () => {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Calling integrated recipe detail endpoint.
        const res = await axios.get(`http://localhost:5000/api/external/recipes/${id}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setRecipe(res.data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setMessage('Failed to load recipe details.');
      }
    };

    if (authToken) {
      fetchRecipe();
    } else {
      setMessage('You must be logged in to view recipe details.');
    }
  }, [id, authToken]);

  const handleSave = async () => {
    try {
      const payload = {
        spoonacularId: recipe.id, 
        title: recipe.title,
        image: recipe.image,
        usedIngredients: recipe.usedIngredients || [],
        missedIngredients: recipe.missedIngredients || [],
        likes: recipe.likes || 0,
        details: recipe
      };
      const res = await axios.post('http://localhost:5000/api/recipes/save', payload, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error('Error saving recipe:', err);
      setMessage('Failed to save recipe.');
    }
  };

  
  if (!recipe) return <p>Loading recipe details...</p>;

  return (
    <div className="App">
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} style={{ maxWidth: '100%', marginBottom: '20px' }} />
      <h3>Instructions</h3>
      {recipe.instructions ? (
        <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      ) : (
        <p>No instructions available.</p>
      )}
      <button onClick={handleSave}>Save Recipe</button>
      {message && <p>{message}</p>}
      <ul>
        {recipe.extendedIngredients?.map((ing) => (
          <li key={ing.id}>{ing.original}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeDetail;
