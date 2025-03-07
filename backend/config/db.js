// Database connection configuration

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Using the connection string from Azure Cosmos DB
    //const conn = await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {     
    //});
    const conn = await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
