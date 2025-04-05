import React from 'react';
import {
  Typography,
  Button,
  Box,
  Stack,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import RateRecipe from './RateRecipe';
import DeleteIcon from '@mui/icons-material/Delete';

const RecipeCard = ({ 
  recipe, 
  onDelete, 
  onSave,
  showRating = false,
  showSaveButton = false,
  showDeleteButton = false,
  hideTitle = false,
  onRatingUpdated 
}) => {
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
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={onSave}
                    >
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

        <Grid2 container spacing={2}>
          <Grid2 item xs={12} md={5}>
            <CardMedia
              component="img"
              sx={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: 1
              }}
              image={recipe.image}
              alt={recipe.title}
            />
          </Grid2>
          <Grid2 item xs={12} md={7}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                height: '400px',
                overflowY: 'auto'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
                Ingredients
              </Typography>
              <List dense sx={{ pt: 0 }}>
                {recipe.extendedIngredients?.map((ing, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={ing.original}
                      sx={{ 
                        '& .MuiListItemText-primary': {
                          fontSize: '0.85rem',
                          lineHeight: 1.2
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid2>
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