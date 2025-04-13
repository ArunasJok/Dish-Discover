// This file is responsible for handling AI-related routes, including chat interactions with OpenAI's API.
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const User = require('../models/User');
const verifyToken = require('../middlewares/authenticationMiddleware');

// Request logging middleware
router.use((req, res, next) => {
    const requestId = Date.now().toString(36);
    req.requestId = requestId; // Store for use in response

    // Log request
    console.log(`[${requestId}] AI Request:`, {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl,
        hasAuth: !!req.headers.authorization,
        hasBody: !!Object.keys(req.body || {}).length
    });

    // Log response
    res.on('finish', () => {
        console.log(`[${requestId}] AI Response:`, {
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            duration: Date.now() - parseInt(requestId, 36)
        });
    });

    next();
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'NO_API_KEY_FOUND'
});

router.post('/chat', verifyToken, async (req, res) => {
    try {
        const { message, ingredients, history } = req.body;
        
        // Get user profile with error handling
        let dietaryRestrictions = [];
        try {
            const user = await User.findById(req.user.userId);
            if (user) {
                dietaryRestrictions = [...(user.dietaryPreferences || []), ...(user.allergies || [])];
            }
        } catch (error) {
            console.error('Error fetching user preferences:', error);
            // Continue without preferences if there's an error
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful cooking assistant. ${
                        dietaryRestrictions.length 
                            ? `Consider these dietary restrictions: ${dietaryRestrictions.join(', ')}. ` 
                            : ''
                    }Available ingredients: ${ingredients}.${
                        dietaryRestrictions.length 
                            ? ' Ensure all suggestions avoid any allergens and comply with dietary preferences.' 
                            : ''
                    }`
                },
                ...(Array.isArray(history) ? history : []),
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ 
            error: 'Failed to get AI response',
            details: error.message,
            errorType: error.name,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;