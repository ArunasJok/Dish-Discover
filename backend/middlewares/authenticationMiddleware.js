const jwt = require('jsonwebtoken');

// Function to verify the token
const verifyToken = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    // Retrieve the token from the header (Bearer token)
    const authHeader = req.header('Authorization');
    //console.log("Authorization header:", authHeader); // Temporary debugging only
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    //Double checking token format
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Malformed token' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log("Decoded token:", decoded); // Temporary debugging only
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;