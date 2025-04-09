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
    Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import RateRecipe from './RateRecipe';
import DeleteIcon from '@mui/icons-material/Delete';
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
    const initialCheckedState = recipe.extendedIngredients
        ? recipe.extendedIngredients.map(() => false)
        : [];
    const [checkedState, setCheckedState] = React.useState(initialCheckedState);

    const handleCheck = (index) => {
        const updatedChecked = [...checkedState];
        updatedChecked[index] = !updatedChecked[index];
        setCheckedState(updatedChecked);
    };

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
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
                                Ingredients
                            </Typography>
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
                        </Paper>
                    </Grid2>
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