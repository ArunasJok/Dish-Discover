// Description: Main entry point for the backend server. This file is responsible for setting up the server, connecting to the database, and defining the routes for the API.
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

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse the request body as JSON, log HTTP requests, and enable CORS. 
// Error handler middleware is used to catch any errors that occur during the request processing.
app.use(express.json());
app.use(require('morgan')('dev'));
app.use(require('cors')());


//Route integration
app.use('/api/auth', authenticationRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/ai', aiRoutes);

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

app.use(errorHandler);

// Start the server and listen on the port
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;