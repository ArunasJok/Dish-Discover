import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import { keyframes } from '@mui/system';
import { AuthContext } from '../context/AuthContext';
import { useRecipes } from '../hooks/useRecipes';
import { useUserData } from '../hooks/useUserData';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';

// Import components
import WelcomeMessage from '../components/dashboard/WelcomeMessage';
import RecipeOfTheDay from '../components/dashboard/RecipeOfTheDay';
import RecommendedRecipes from '../components/dashboard/RecommendedRecipes';
import IngredientTiles from '../components/dashboard/IngredientTiles';
import SearchHistory from '../components/dashboard/SearchHistory';

const PIXABAY_API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;
const PIXABAY_API_URL = 'https://pixabay.com/api/';

const formatError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

const Dashboard = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Custom hooks for data fetching
  const { 
    loading: recipesLoading, 
    recipeOfDay, 
    recommendations, 
    error: recipesError 
  } = useRecipes(authToken);

  console.log('Recommendations:', recommendations);

  const {
    user,
    searchHistory,
    telemetry,
    loading: userDataLoading,
    error: userDataError
  } = useUserData(authToken);

  const { showWelcome } = useWelcomeMessage();

  // Local state
  const [filter, setFilter] = useState('');  

  // Animation setup
  const slideIn = keyframes`
    from { opacity: 0; transform: translateX(100px); }
    to { opacity: 1; transform: translateX(0); }
  `;

  // Navigation handler
  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

   // Filter logic
   const filteredHistory = searchHistory.filter(entry => {
    if (!entry || !entry.searchTitle) return false;
    
    const lowerFilter = (filter || '').toLowerCase();
    const titleMatch = entry.searchTitle.toLowerCase().includes(lowerFilter);
    const ingredientsMatch = Array.isArray(entry.popularIngredients) && 
      entry.popularIngredients.join(' ').toLowerCase().includes(lowerFilter);
    
    return titleMatch || ingredientsMatch;
  });

  // Combine errors for display
  const displayError = recipesError || userDataError 
    ? formatError(recipesError || userDataError)
    : null; 

    const validTelemetry = {
      ingredientCounts: telemetry?.ingredientCounts || {},
      popularIngredients: Array.isArray(telemetry?.popularIngredients) 
        ? telemetry.popularIngredients 
        : []
    };

  return (
    <Container sx={{ mt: 8 }}>
      {displayError && (
        <Typography variant="body1" color="error" gutterBottom>
          {displayError}
        </Typography>
      )}

      <WelcomeMessage 
        user={user} 
        showWelcome={showWelcome} 
        slideIn={slideIn} 
      />

      <Box sx={{ mb: 6 }}>
        <RecipeOfTheDay 
          loading={recipesLoading}
          recipeOfDay={recipeOfDay || {}}
          onViewRecipe={handleViewRecipe}
        />
      </Box>

      <Box sx={{ mb: 6 }}>
        <RecommendedRecipes 
          loading={recipesLoading}
          recommendations={Array.isArray(recommendations) ? recommendations : []}
          onViewRecipe={handleViewRecipe}
        />
      </Box>

      <Box sx={{ mb: 6 }}>
        <IngredientTiles 
          telemetry={validTelemetry}          
        />
      </Box>

      <SearchHistory 
        filteredHistory={filteredHistory}
        filter={filter}
        onFilterChange={setFilter}
        loading={userDataLoading}
      />
    </Container>
  );
};

export default Dashboard;