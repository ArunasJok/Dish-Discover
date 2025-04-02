// Route that returns search history for the current user
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authenticationMiddleware');
const SearchHistory = require('../models/SearchHistory');

// GET /api/searchhistory
// Returns an array of search history entries for the current user
router.get('/', verifyToken, async (req, res) => {
  try {
    // Assuming your token payload contains userId
    const histories = await SearchHistory.find({ user: req.user.userId }).sort({ searchDate: -1 });
    res.json(histories);
  } catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// DELETE /api/searchhistory
// Clears search history for the current user
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
// Adds a new search history entry
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Received history payload:', req.body); // Debug log
    console.log('User ID:', req.user.userId); // Debug log

    const { recipeId, title, ingredients, image } = req.body;

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
      user: req.user.userId,
      recipeId,
      title,
      ingredients: ingredients || [],
      image,
      searchDate: new Date()
    });

    const savedHistory = await newHistory.save();
    console.log('Saved history:', savedHistory); // Debug log

    res.status(201).json(savedHistory);
  } catch (error) {
    console.error('Error saving search history:', error);
    res.status(500).json({
      error: 'Failed to save search history',
      details: error.message
    });
  }
});

module.exports = router;
