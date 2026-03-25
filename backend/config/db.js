const mongoose = require('mongoose');

const connectDB = async () => {
  let retries = 10;
  while (retries > 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected successfully');
      return;
    } catch (err) {
      retries--;
      console.log(`MongoDB connection failed. Retries left: ${retries}. Error: ${err.message}`);
      if (retries === 0) {
        console.error('Could not connect to MongoDB. Exiting.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;
