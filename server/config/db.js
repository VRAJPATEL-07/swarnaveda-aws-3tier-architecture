/*
  MongoDB connection helper with in-memory fallback for local dev
*/
const mongoose = require('mongoose');
let mongod;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  try {
    if (uri) {
      console.log('Attempting to connect to MongoDB using MONGO_URI');
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected');
    } else {
      // Fallback to in-memory MongoDB for development when MONGO_URI isn't provided
      console.log('MONGO_URI not set, falling back to in-memory MongoDB');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to in-memory MongoDB');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  } catch (err) {
    console.error('Error closing DB:', err.message);
  }
};

process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = connectDB;
