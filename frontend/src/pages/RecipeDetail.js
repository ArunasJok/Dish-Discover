// RecipeDetail component to display the details of a recipe
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeDetail } from '../services/apiService';
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
        const data = await getRecipeDetail(id);
        setRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        setMessage('Failed to load recipe details.');
      }
    };
    fetchRecipe();
  }, [id]);

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
