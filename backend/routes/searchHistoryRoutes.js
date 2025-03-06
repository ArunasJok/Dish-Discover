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

module.exports = router;
