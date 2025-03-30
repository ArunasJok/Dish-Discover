// Database connection configuration

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use local MongoDB connection for development
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dishdiscover', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
