
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authenticationMiddleware');
const User = require('../models/User'); 

// Protected route to get the current user's profile
router.get('/', verifyToken, async (req, res) => {
    try {
        console.log("req.user:", req.user);
        if (!req.user || !req.user.userId) {
          return res.status(401).json({ error: 'User not authenticated' });
        }
        console.log("Fetching profile for user ID:", req.user.userId);
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        console.error("Error in GET /api/profile:", error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
      }
    });

//Protected route to update the current user's profile
router.put('/', verifyToken, async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Update fields only if they are provided in the request
      if (username) user.username = username;
      if (email) user.email = email;
      // Only update the password if a new one is provided (non-empty)
      if (password && password.trim() !== '') {
        user.password = password; // The pre-save hook will hash this new password
      }
      await user.save();
      res.json({ message: 'Profile updated successfully', user: { username: user.username, email: user.email } });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

module.exports = router;
