// Route that aggregates telemetry data for the current user
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authenticationMiddleware');
const SearchHistory = require('../models/SearchHistory');
const mongoose = require('mongoose');

router.get('/', verifyToken, async (req, res) => {
    try {     
      const userId = new mongoose.Types.ObjectId(req.user.userId);      
      // Count how many searches in the last week for the current user
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recipesLastWeek = await SearchHistory.countDocuments({
        user: userId,
        searchDate: { $gte: oneWeekAgo }
      });
  
      // Aggregate the most popular ingredients in search history for this user
      const popularIngredientsAgg = await SearchHistory.aggregate([
        { $match: { user: userId } },
        { $unwind: "$popularIngredients" },
        { $group: { _id: "$popularIngredients", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      const popularIngredients = popularIngredientsAgg.map(item => item._id);
  
      res.json({ recipesLastWeek, popularIngredients });
    } catch (error) {
      console.error("Error fetching telemetry data:", error);
      res.status(500).json({ error: 'Failed to fetch telemetry data' });
    }
  });
  
  module.exports = router;
