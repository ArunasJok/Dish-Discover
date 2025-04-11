// Main entry point for the backend server. 
// This file is responsible for setting up the server, connecting to the database, and defining the routes for the API.
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db'); // Import database connection
const errorHandler = require('./middlewares/errorHandler'); // Import error handler middleware
// Import routes
const authenticationRoutes = require('./routes/authenticationRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const externalRoutes = require('./routes/externalRoutes');
const aiRoutes = require('./routes/aiRoutes');
const profileRoutes = require('./routes/profileRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');
const searchHistoryRoutes = require('./routes/searchhistoryRoutes');
const myRecipeRoutes = require('./routes/myRecipeRoutes');
const path = require('path');


const app = express();
const port = process.env.PORT

// Middleware to parse the request body as JSON, log HTTP requests, and enable CORS. 
app.use(express.json());
app.use(require('morgan')('dev'));
app.use(require('cors')());


//Route integration
app.use('/api/auth', authenticationRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/searchhistory', searchHistoryRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/recipes', myRecipeRoutes);
//app.use('/api', externalRoutes);


//Defining route for the root URL
app.get('/', (req, res) => {
    res.send('Dish Discover Backend is Running');
});

// Catch-all route errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

app.use(errorHandler);

// Connect to MongoDB
connectDB();

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});



module.exports = app;