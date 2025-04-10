// Database connection configuration

const mongoose = require('mongoose');

// Use local MongoDB connection for development
const connectDB = async () => {
  try {    
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

// Use Azure Cosmos DB connection for production
// const connectDB = async () => {
//     try {    
//       const conn = await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//       });
//       console.log(`MongoDB connected: ${conn.connection.host}`);
//     } catch (error) {
//       console.error(`Error connecting to MongoDB: ${error}`);
//       process.exit(1);
//     }
//   };


module.exports = connectDB;
