// RecipeDetail component to display the details of a recipe
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeDetail } from '../services/apiService';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const data = await getRecipeDetail(id);
        setRecipe(data);
      } catch (err) {
        setError('Failed to fetch recipe details.');
      }
    };
    fetchRecipeDetail();
  }, [id]);

  if (error) return <p>{error}</p>;
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
      <h3>Ingredients</h3>
      <ul>
        {recipe.extendedIngredients?.map((ing) => (
          <li key={ing.id}>{ing.original}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeDetail;
