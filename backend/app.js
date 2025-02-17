// Importing the Express library and creating an instance of the Express app
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db'); // Import database connection

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse the request body as JSON, log HTTP requests, and enable CORS
app.use(express.json());
app.use(require('morgan')('dev'));
app.use(require('cors')());

const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api/recipes', recipeRoutes);

//Defining route for the root URL
app.get('/', (req, res) => {
    res.send('Dish Discover Backend is running');
});

// Start the server and listen on the port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});