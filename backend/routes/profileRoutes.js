
const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const verifyToken = require('../middlewares/authenticationMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    }
});

// Handle avatar upload
router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
      }

      // Convert image to base64
      const base64Image = req.file.buffer.toString('base64');
      const avatarUrl = `data:${req.file.mimetype};base64,${base64Image}`;

      // Update user profile
      await User.findByIdAndUpdate(req.user.id, { avatarUrl });

      res.json({ avatarUrl });
  } catch (error) {
      console.error('Avatar upload error:', error);
      res.status(500).json({ error: 'Failed to upload avatar' });
  }
});
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
      const { username, email, password, dietaryPreferences, allergies } = req.body;
      console.log("Received update request:", {
        username, 
        email,
        hasPassword: !!password,
        dietaryPreferences,
        allergies
      });
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Update fields only if they are provided in the request
      if (username) user.username = username;
      if (email) user.email = email;
      // Update dietary preferences if provided (even empty arrays)
      if (dietaryPreferences !== undefined) {
        user.dietaryPreferences = Array.isArray(dietaryPreferences) 
          ? dietaryPreferences 
          : [];
        console.log("Setting dietary preferences:", user.dietaryPreferences);
      }
      
      // Update allergies if provided (even empty arrays)
      if (allergies !== undefined) {
        user.allergies = Array.isArray(allergies) 
          ? allergies 
          : [];
        console.log("Setting allergies:", user.allergies);
      }
      // Only update the password if a new one is provided (non-empty)
      if (password && password.trim() !== '') {
        user.password = password; // The pre-save hook will hash this new password
      }
      await user.save();
      const updatedUserData = {
        username: user.username,
        email: user.email,
        dietaryPreferences: user.dietaryPreferences,
        allergies: user.allergies
      };
      console.log("Updated user data:", updatedUserData);
      res.json({ 
        message: 'Profile updated successfully', 
        user: updatedUserData
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

module.exports = router;
