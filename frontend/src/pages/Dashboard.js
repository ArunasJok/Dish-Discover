// src/pages/Dashboard.js
import React, { useState, useEffect, useContext, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Button,
  Fade
} from '@mui/material';
import { keyframes } from '@mui/system';
import * as emoji from 'node-emoji';
//import pluralize from 'pluralize';
import missingImage from '../images/missingIngredient.png';

const PIXABAY_API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;
const PIXABAY_API_URL = 'https://pixabay.com/api/';

const Dashboard = () => {
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [telemetry, setTelemetry] = useState({ ingredientCounts: {}, popularIngredients: [] });
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [recipeOfDay, setRecipeOfDay] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();
  const [ingredientImages, setIngredientImages] = useState({});

  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    } else {
      sessionStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);
  
  const slideIn = keyframes`
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `;

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 10000); // Stay visible for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const fetchRandomRecipes = useCallback(async () => {
    try {
      // First try to get from cache
      const cached = localStorage.getItem('randomRecipes');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = new Date().getTime();
        const twoHours = 2 * 60 * 60 * 1000;
        if (now - timestamp < twoHours) {
          console.log('Using cached recipe data');
          setRecipeOfDay(data.recipeOfDay);
          setRecommendations(data.recommendations);
          setLoading(false);
          return; // Use cached data if it's less than 2 hours old
        }
      }

      setLoading(true);
      console.log('Cache expired or not found, fetching fresh recipes...');
  
      console.log('Fetching fresh random recipes...');
      const res = await axios.get(`${API_URL}/api/external/recipes/random`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
  
      if (!res.data || !res.data.recipeOfDay) {
        throw new Error('Invalid response format');
      }
  
      // Cache the new data
      localStorage.setItem('randomRecipes', JSON.stringify({
        data: res.data,
        timestamp: new Date().getTime()
      }));
  
      setRecipeOfDay(res.data.recipeOfDay);
      setRecommendations(res.data.recommendations || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching random recipes:', error);      
      setErrorMessage('Failed to load recipes. Please try again later.');

      // Try to use cached data as fallback
      const cached = localStorage.getItem('randomRecipes');
    if (cached) {
      console.log('Using cached data as fallback');
      const { data } = JSON.parse(cached);
      setRecipeOfDay(data.recipeOfDay);
      setRecommendations(data.recommendations);
    } else {
      setErrorMessage('Failed to load recipes. Please try again later.');
    }
  } finally {
    setLoading(false);
  }
}, [authToken]);

  useEffect(() => {
  if (authToken && !recipeOfDay) {
    fetchRandomRecipes();
  }
}, [authToken, fetchRandomRecipes, recipeOfDay]);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setErrorMessage('Failed to fetch user profile.');
      }
    };

    const fetchSearchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/searchhistory`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setSearchHistory(res.data);
      } catch (error) {
        console.error('Error fetching search history:', error);
      }
    };

    // const fetchTelemetry = async () => {
    //   try {
    //     const res = await axios.get(`${API_URL}/api/telemetry`, {
    //       headers: { 'Authorization': `Bearer ${authToken}` }
    //     });
    //     setTelemetry(res.data);
    //   } catch (error) {
    //     console.error('Error fetching telemetry:', error);
    //   }
    // };

    const fetchTelemetry = async () => {
      try {
        console.log('Fetching telemetry data...');
        const res = await axios.get(`${API_URL}/api/telemetry/ingredients`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('Raw telemetry response:', res.data);
        
        if (Object.keys(res.data.ingredientCounts).length === 0) {
          console.log('No ingredient data found');
          return;
        }
    
        setTelemetry({
          ingredientCounts: res.data.ingredientCounts,
          popularIngredients: res.data.popularIngredients
        });
      } catch (error) {
        console.error('Error fetching telemetry:', error);
        setTelemetry({
          ingredientCounts: {},
          popularIngredients: []
        });
      }
    };

    if (authToken) {
      fetchProfile();
      fetchSearchHistory();
      fetchTelemetry();
    }
  }, [authToken]);

  const filteredHistory = searchHistory.filter((entry) => {
    const lowerFilter = filter.toLowerCase();
    return (
      entry.searchTitle.toLowerCase().includes(lowerFilter) ||
      entry.popularIngredients.join(' ').toLowerCase().includes(lowerFilter)
    );
  });

  


  const getIngredientEmoji = (ingredient) => {
    const key = ingredient.toLowerCase();
    const found = emoji.get(key);
    return found !== `:${key}:` ? found : '🥦'; // if not found, return broccoli as default
  };

  // const ingredientImageUrl = async (ingredient) => {
  //   try {
  //     const result = await unsplash.search.getPhotos({
  //       query: `${ingredient} food ingredient`,
  //       perPage: 1,
  //       orientation: 'square'
  //     });
  
  //     if (result.response?.results?.length > 0) {
  //       return result.response.results[0].urls.small;
  //     }
  //     return missingImage;
  //   } catch (error) {
  //     console.error(`Error fetching image for ${ingredient}:`, error);
  //     return missingImage;
  //   }
  // };

  useEffect(() => {
    const loadImages = async () => {
      const newImages = {};
      // Only fetch images for top 10 ingredients
      const topIngredients = telemetry.popularIngredients.slice(0, 10);
      
      for (const ingredient of topIngredients) {
        try {
          const searchQuery = `${ingredient.toLowerCase().trim()} isolated`;
          console.log(`Fetching image for: ${searchQuery}`);
  
          const result = await axios.get(PIXABAY_API_URL, {
            params: {
              key: PIXABAY_API_KEY,
              q: searchQuery,
              image_type: 'photo',
              orientation: 'horizontal',
              safesearch: true,
              per_page: 3,
              category: 'food'
            }
          });
          
          if (result.data.hits.length > 0) {
            // Find most relevant image
            const relevantPhoto = result.data.hits.find(photo => 
              photo.tags.toLowerCase().includes(ingredient.toLowerCase())
            );
            
            newImages[ingredient] = relevantPhoto ? 
              relevantPhoto.webformatURL : 
              result.data.hits[0].webformatURL;
          } else {
            console.warn(`No results found for ${ingredient}`);
            newImages[ingredient] = missingImage;
          }
  
        } catch (error) {
          console.error(`Error loading image for ${ingredient}:`, error);
          newImages[ingredient] = missingImage;
        }
      }
      setIngredientImages(newImages);
    };
  
    if (telemetry.popularIngredients?.length > 0) {
      loadImages();
    }
  }, [telemetry.popularIngredients]);

  // const ingredientImageUrl = (ingredient) => {
  //   const singular = pluralize.singular(ingredient);
  //   const formatted = singular.toLowerCase().replace(/\s+/g, '-');
  //   return `https://spoonacular.com/cdn/ingredients_100x100/${formatted}.jpg`;
  // };

  const renderIngredientTiles = () => {
    if (!telemetry.popularIngredients || telemetry.popularIngredients.length === 0) {
      return <Typography variant="body1">No ingredient data available yet. Try searching for some recipes!</Typography>;
    }
  
    return (
      <Grid2 
        container 
        spacing={2} 
        sx={{ 
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr',                    // 1 column on mobile
            sm: 'repeat(2, 1fr)',         // 2 columns on small screens
            md: 'repeat(3, 1fr)',         // 3 columns on medium screens
            lg: 'repeat(5, 1fr)'          // 5 columns on large screens
          },
          gap: 2
        }}
      >
        {telemetry.popularIngredients.slice(0, 10).map((ingredient, idx) => (
          <Card 
            key={idx}
            sx={{ 
              aspectRatio: '1/1',         
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                '& .ingredient-overlay': {
                  opacity: 1
                }
              }
            }}
          >
            <CardMedia
              component="img"
              image={ingredientImages[ingredient] || missingImage}
              alt={ingredient}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = missingImage;
              }}
              sx={{ 
                height: '100%',
                width: '100%',
                objectFit: 'cover'
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                color: 'rgba(255, 255, 255, 0.7)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                zIndex: 3,
                fontSize: '0.7rem'
              }}
            >
              Photo by Pixabay
            </Typography>
            <Box
              className="ingredient-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                opacity: 0,
                transition: 'opacity 0.3s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2
              }}
            >
              <Typography 
                variant="h6"
                sx={{ 
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  mb: 1,
                  textTransform: 'capitalize',
                  textAlign: 'center'
                }}
              >
                {ingredient} {getIngredientEmoji(ingredient)}
              </Typography>
              <Typography 
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  textAlign: 'center'
                }}
              >
                Searched {telemetry.ingredientCounts[ingredient] || 0} times
              </Typography>
            </Box>
          </Card>
        ))}
      </Grid2>
    );
  };

    return (
      <Container sx={{ mt: 4 }}>
        {errorMessage && (
          <Typography variant="body1" color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}

<Fade in={showWelcome} timeout={5000}>
  <Box 
    sx={{ 
      position: 'fixed', 
      top: 100,          
      right: 40,        
      textAlign: 'right',
      backgroundColor: 'background.paper',
      padding: 3,       
      borderRadius: 2, 
      boxShadow: 3,   
      zIndex: 1100,   
      maxWidth: 300, 
      minWidth: 250,
      animation: `${slideIn} 1.5s ease-out`,
      '&:hover': {
        boxShadow: 6,
        animation: 'none',
      },
      transition: 'all 1.5s ease-in-out',
    }}
  >
    <Typography 
      variant="h6" 
      color="primary" 
      sx={{ 
        fontWeight: 600,
        mb: 1,
        fontSize: '1.1rem'
      }}
    >
      Welcome back, {user && user.username ? user.username : 'User'}!
    </Typography>
    {user && user.lastVisited && (
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          fontSize: '0.875rem',
          opacity: 0.8
        }}
      >
        Last visited: {new Date(user.lastVisited).toLocaleString()}
      </Typography>
    )}
  </Box>
</Fade>

 {/* Recipe of the Day Section */}
{loading ? (
  <Typography>Loading Recipe of the Day...</Typography>
) : recipeOfDay ? (
  <Box 
    sx={{ 
      mb: 4, 
      width: '100%',
      height: { xs: '500px', md: '600px' },
      position: 'relative',
      borderRadius: 3,
      overflow: 'hidden',
      boxShadow: 3,
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
        zIndex: 1
      }
    }}
  >

    {/* Recipe of the Day Label */}
    <Box
  sx={{
    position: 'absolute',
    top: 60,
    right: -70,
    transform: 'rotate(45deg)',
    background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
    padding: '10px 70px',
    zIndex: 2,
    backdropFilter: 'blur(8px)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '4px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(4px)',
      borderRadius: 'inherit',
    }
  }}
>
  <Typography 
    variant="overline" 
    sx={{ 
      color: 'white',
      fontWeight: 700,
      letterSpacing: 3,
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      position: 'relative',
      zIndex: 1
    }}
  >
    Recipe of the Day
  </Typography>
</Box>

    <Box
      component="img"
      src={recipeOfDay.image}
      alt={recipeOfDay.title}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }}
    />
    <Box 
      sx={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: { xs: 3, md: 6 },
        zIndex: 2,
        color: 'white'
      }}
    >      
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 2,
          fontWeight: 700,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        {recipeOfDay.title}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 3,
          maxWidth: '800px',
          color: 'rgba(255,255,255,0.9)',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        {recipeOfDay.summary.replace(/<[^>]*>/g, '').slice(0, 300)}...
      </Typography>
      <Button 
        variant="contained" 
        sx={{ 
          px: 4,
          py: 1.5,
          borderRadius: 2,
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
            transform: 'scale(1.05)'
          },
          transition: 'all 0.3s ease-in-out'
        }}
        onClick={() => handleViewRecipe(recipeOfDay.id)}
      >
        View Recipe
      </Button>
    </Box>
  </Box>
) : null}

      {/* Recommendations Section */}
<Typography variant="h5" gutterBottom>Recommended Recipes</Typography>
{loading && recommendations.length === 0 ? (
  <Typography>Loading recommendations...</Typography>
) : (
  <Grid2 
  container 
  spacing={3}
  sx={{
    width: '100%',
    margin:"0 auto",
    display: 'grid',
    gridTemplateColumns: { 
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)'      
    },
    gap: 3,
    }}
  >
    {recommendations.slice(0, 6).map((recipe) => (     
      
        <Card 
          key={recipe.id}
          sx={{ 
            position: 'relative',
            height: 250,
            width: '100%',            
            '&:hover .MuiCardContent-root': { 
              opacity: 1 
            },
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)'  // Added subtle zoom effect on hover
            }
          }}
          onClick={() => handleViewRecipe(recipe.id)}
        >
          <CardMedia
            component="img"
            sx={{
              height: '100%',
              width: '100%'
            }}
            image={recipe.image}
            alt={recipe.title}
          />
          <CardContent
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white',
                mb: 1,
                textAlign: 'center'
              }}
            >
              {recipe.title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 2,
                textAlign: 'center'
              }}
            >
              {recipe.summary.replace(/<[^>]*>/g, '').slice(0, 100)}...
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ 
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                },
                alignSelf: 'center'
              }}
            >
              View Details
            </Button>
          </CardContent>
        </Card>      
    ))}
  </Grid2>
)}

        {/* Telemetry Section */}
        <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Most Searched Ingredients
        </Typography>
        {renderIngredientTiles()}
        </Box>
        

        {/* Search History Section with Filtering */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Recipe Search History (Last Week)
          </Typography>
          <TextField
            label="Filter history"
            variant="outlined"
            fullWidth
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ mb: 2 }}
          />
          {filteredHistory.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Search Title</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Popular Ingredients</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistory.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell>{entry.searchTitle}</TableCell>
                      <TableCell>{new Date(entry.searchDate).toLocaleString()}</TableCell>
                      <TableCell>
                        {entry.popularIngredients.map((ingredient, index) => (
                          <span key={index} style={{ marginRight: 4 }}>
                            {getIngredientEmoji(ingredient)} {ingredient}
                          </span>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No search history available.</Typography>
          )}
        </Box>
      </Container>
    );
  };

  export default Dashboard;
