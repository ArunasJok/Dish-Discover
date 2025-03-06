// Database connection configuration
// The connectDB function is responsible for connecting to the MongoDB database.
const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dishdiscover';

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
