// This is a React component for a shopping list application.
// It allows users to add, delete, and mark items as completed. The items are grouped by recipe and stored in localStorage.
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, List, ListItem, ListItemText,
  IconButton, TextField, Button, Box, Paper, ListItemSecondaryAction, Alert, Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [message, setMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [completedItems, setCompletedItems] = useState([]);
  


  // Load shopping list from localStorage
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('shoppingList') || '[]');
    const savedCompleted = JSON.parse(localStorage.getItem('completedItems') || '[]');
    setItems(savedList);
    setCompletedItems(savedCompleted);
  }, []);

  // Save changes to localStorage
  const saveList = (newList) => {
    localStorage.setItem('shoppingList', JSON.stringify(newList));
    setItems(newList);
  };

  const saveCompleted = (newCompleted) => {
    localStorage.setItem('completedItems', JSON.stringify(newCompleted));
    setCompletedItems(newCompleted);
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      const newItemObj = {
        id: `custom-${Date.now()}`,
        original: newItem,
        name: newItem,
        recipeTitle: 'Custom Item',
        addedOn: new Date().toISOString()
      };
      
      saveList([...items, newItemObj]);
      setNewItem('');
      showMessage('Item added');
    }
  };

  const handleDeleteItem = (id) => {
    const updatedList = items.filter(item => item.id !== id);
    saveList(updatedList);
    showMessage('Item removed');
  };

  const handleClearList = () => {
    if (window.confirm('Are you sure you want to clear your shopping list?')) {
      saveList([]);
      saveCompleted([]);
      showMessage('Shopping list cleared');
    }
  };

  const toggleItemCompletion = (id) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    if (completedItems.includes(id)) {
      // Remove from completed
      saveCompleted(completedItems.filter(itemId => itemId !== id));
    } else {
      // Add to completed
      saveCompleted([...completedItems, id]);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Group items by recipe
  const itemsByRecipe = items.reduce((acc, item) => {
    const recipe = item.recipeTitle || 'Other Items';
    if (!acc[recipe]) {
      acc[recipe] = [];
    }
    acc[recipe].push(item);
    return acc;
  }, {});

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>        
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingCartIcon sx={{ mr: 1 }} /> Shopping List
        </Typography>
      </Box>

      {/* Add new item form */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Add new item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            sx={{ ml: 1 }}
          >
            Add
          </Button>
        </Box>
        
        {items.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearList}
            size="small"
          >
            Clear List
          </Button>
        )}
      </Paper>

      {/* Shopping list */}
      {items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your shopping list is empty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add ingredients from recipes or use the form above
          </Typography>
        </Paper>
      ) : (
        Object.entries(itemsByRecipe).map(([recipeTitle, recipeItems]) => (
          <Paper key={recipeTitle} sx={{ mb: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">{recipeTitle}</Typography>
            </Box>
            <List dense>
              {recipeItems.map((item) => {
                const isCompleted = completedItems.includes(item.id);
                return (
                  <ListItem 
                    key={item.id} 
                    divider
                    onClick={() => toggleItemCompletion(item.id)}
                    sx={{
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      color: isCompleted ? 'text.disabled' : 'text.primary',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <ListItemText 
                      primary={item.original} 
                      secondary={new Date(item.addedOn).toLocaleDateString()} 
                    />
                    <ListItemSecondaryAction>
                      {isCompleted && (
                        <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      )}
                      <IconButton edge="end" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        ))
      )}
      
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ShoppingList;