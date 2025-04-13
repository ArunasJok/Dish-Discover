// This file defines the routes for managing search history in the application.
// It includes routes for fetching, deleting, and creating search history entries.
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authenticationMiddleware');
const SearchHistory = require('../models/SearchHistory');

// GET /api/searchhistory
router.get('/', verifyToken, async (req, res) => {
  try {
    const histories = await SearchHistory.find({ user: req.user.userId })
      .sort({ searchDate: -1 });
    res.json(histories);
  } catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// DELETE /api/searchhistory
router.delete('/', verifyToken, async (req, res) => {
  try {
    await SearchHistory.deleteMany({ user: req.user.userId });
    res.json({ message: 'Search history cleared' });
  } catch (error) {
    console.error("Error clearing search history:", error);
    res.status(500).json({ error: 'Failed to clear search history' });
  }
});

// POST /api/searchhistory
router.post('/', verifyToken, async (req, res) => {
  try {
    const { recipeId, title, ingredients, image } = req.body;
    const userId = req.user.userId;

    // Debug logging
    console.log('Creating search history:', {
      userId,
      recipeId,
      title,
      ingredientsCount: ingredients?.length || 0,
      hasImage: !!image,
      timestamp: new Date().toISOString()
    });

    // Validate required fields
    if (!recipeId || !title) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          recipeId: !recipeId ? 'Recipe ID is required' : null,
          title: !title ? 'Title is required' : null
        }
      });
    }

    const newHistory = new SearchHistory({
      user: userId,
      recipeId,
      title,
      ingredients: ingredients || [],
      image,
      searchDate: new Date()
    });

    const savedHistory = await newHistory.save();
    
    // Debug logging
    console.log('Saved search history:', {
      id: savedHistory._id,
      userId: savedHistory.user,
      recipeId: savedHistory.recipeId,
      timestamp: savedHistory.searchDate
    });

    res.status(201).json(savedHistory);
  } catch (error) {
    console.error('Error saving search history:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.userId
    });
    
    res.status(500).json({
      error: 'Failed to save search history',
      details: error.message
    });
  }
});

module.exports = router;