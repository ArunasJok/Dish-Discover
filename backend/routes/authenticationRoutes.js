const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
const { body, validationResult } = require('express-validator');

//Registration route with validation
router.post('/register', 
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //If no validation errors, proceed to registration
        authenticationController.register(req, res, next);
    }
);

//Login route with validation
router.post('/login',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //If no validation errors, proceed to login
        authenticationController.login(req, res, next);
    }
);

module.exports = router;