const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Registration failed' });
    }
};

// Login an existing user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await
        User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email' });
        }
        // Check if the password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        // Generate a token (ensure to have a .env file with a secret)
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'});

        res.json({ token, message: 'User logged in successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Login failed' });
    }
};