// This file defines the RecipeCard component, which is used to display a recipe's details in a card format. It includes features like adding ingredients to a shopping list, rating recipes, and deleting recipes. The component uses Material-UI for styling and layout.
import React, { useState} from 'react';
import {
    Typography,
    Button,
    Box,
    Stack,
    Grid2,
    Card,
    CardMedia,
    CardContent,
    Paper,
    Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import RateRecipe from './RateRecipe';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const RecipeCard = ({
    recipe,
    onDelete,
    onSave,
    showRating = false,
    showSaveButton = false,
    showDeleteButton = false,
    hideTitle = false,
    onRatingUpdated,
}) => {
    // Check if recipe has extendedIngredients
    const initialCheckedState = recipe.extendedIngredients
        ? recipe.extendedIngredients.map(() => false)
        : [];
    const [checkedState, setCheckedState] = useState(initialCheckedState);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Function to handle checkbox state change
    const handleCheck = (index) => {
        const updatedChecked = [...checkedState];
        updatedChecked[index] = !updatedChecked[index];
        setCheckedState(updatedChecked);
    };
    // Function to get selected ingredients based on checked state
    const getSelectedIngredients = () => {
        return recipe.extendedIngredients?.filter((_, index) => checkedState[index]) || [];
    };
    // Function to add selected ingredients to shopping list
    const addToShoppingList = () => {
       
        const selectedIngredients = getSelectedIngredients();
        
        if (selectedIngredients.length === 0) return;        
       
        const existingList = JSON.parse(localStorage.getItem('shoppingList') || '[]');        
        
        const newItems = selectedIngredients.map(ingredient => ({
            ...ingredient,
            recipeTitle: recipe.title,
            addedOn: new Date().toISOString()
        }));        
       
        const combined = [...existingList];
        newItems.forEach(item => {
            const existingIndex = combined.findIndex(existing => 
                existing.id === item.id && existing.recipeTitle === item.recipeTitle
            );
            if (existingIndex === -1) {
                combined.push(item);
            }
        });        
      
        localStorage.setItem('shoppingList', JSON.stringify(combined));        
        
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 2000);        
        
        setCheckedState(initialCheckedState);
    };
    // Function to handle rating update
    const selectedCount = checkedState.filter(Boolean).length;

    return (
        <Card elevation={3}>
            <CardContent>
                {/* Only display title if hideTitle is false */}
                {!hideTitle && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">{recipe.title}</Typography>
                        <Stack direction="row" spacing={2}>
                            {showRating && (
                                <RateRecipe
                                    recipeId={recipe._id}
                                    spoonacularId={recipe.spoonacularId}
                                    onRatingUpdated={onRatingUpdated}
                                />
                            )}
                            {showSaveButton && (
                                <Button variant="contained" color="primary" onClick={onSave}>
                                    Save Recipe
                                </Button>
                            )}
                            {showDeleteButton && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => onDelete(recipe.spoonacularId)}
                                >
                                    Delete
                                </Button>
                            )}
                        </Stack>
                    </Box>
                )}

                <Grid2 container spacing={2} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    <Grid2 item xs={12} md={6} sx={{ flex: '1 1 50%' }}>
                        <CardMedia
                            component="img"
                            sx={{
                                width: '100%',
                                height: '400px',
                                objectFit: 'cover',
                                borderRadius: 1,
                            }}
                            image={recipe.image}
                            alt={recipe.title}
                        />
                    </Grid2>
                    <Grid2 item xs={12} md={6} sx={{ flex: '1 1 50%' }}>
                        <Paper
                            elevation={2}
                            sx={{
                                width: '100%',
                                p: 2,
                                height: '400px',
                                overflowY: 'auto',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                    Ingredients
                                </Typography>
                                <Tooltip title={selectedCount === 0 ? "Select ingredients first" : "Add to shopping list"}>
                                    <span>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            startIcon={<AddShoppingCartIcon />}
                                            onClick={addToShoppingList}
                                            disabled={selectedCount === 0}
                                        >
                                            Add to List {selectedCount > 0 && `(${selectedCount})`}
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Box>
                            <Grid2 container spacing={2}>
                              <Grid2 item xs={6}>
                                  {recipe.extendedIngredients?.map((ing, index) =>
                                      index % 2 === 0 ? (
                                          <Box key={index} sx={{ mb: 1 }}>
                                              <FormControlLabel
                                                  control={
                                                      <Checkbox
                                                          checked={checkedState[index] || false}
                                                          onChange={() => handleCheck(index)}
                                                          size="small"
                                                      />
                                                  }
                                                  label={
                                                      <Typography variant="body2" sx={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                                          {ing.original}
                                                      </Typography>
                                                  }
                                              />
                                          </Box>
                                      ) : null
                                  )}
                              </Grid2>
                              <Grid2 item xs={6}>
                                  {recipe.extendedIngredients?.map((ing, index) =>
                                      index % 2 !== 0 ? (
                                          <Box key={index} sx={{ mb: 1 }}>
                                              <FormControlLabel
                                                  control={
                                                      <Checkbox
                                                          checked={checkedState[index] || false}
                                                          onChange={() => handleCheck(index)}
                                                          size="small"
                                                      />
                                                  }
                                                  label={
                                                      <Typography variant="body2" sx={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                                          {ing.original}
                                                      </Typography>
                                                  }
                                              />
                                          </Box>
                                      ) : null
                                  )}
                              </Grid2>
                            </Grid2>
                            {showSuccessToast && (
                                <Box 
                                    sx={{ 
                                        position: 'absolute', 
                                        bottom: 16, 
                                        left: '50%', 
                                        transform: 'translateX(-50%)',
                                        bgcolor: 'success.main',
                                        color: 'white',
                                        py: 1,
                                        px: 2,
                                        borderRadius: 1,
                                        boxShadow: 2
                                    }}
                                >
                                    Added to shopping list!
                                </Box>
                            )}
                        </Paper>
                    </Grid2>
                </Grid2>

                {/* Rest of your component */}
                <Grid2 item xs={12}>
                    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Instructions
                        </Typography>
                        {recipe.instructions ? (
                            <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
                        ) : (
                            <Typography variant="body1">No instructions available.</Typography>
                        )}
                    </Paper>
                </Grid2>

                {showRating && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                            Rating: {recipe.rating.toFixed(1)} ({recipe.ratingCount} ratings)
                        </Typography>
                        <Button
                            component={Link}
                            to={`/recipe/${recipe.spoonacularId}`}
                            color="primary"
                            variant="outlined"
                            size="small"
                        >
                            View Details
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default RecipeCard;