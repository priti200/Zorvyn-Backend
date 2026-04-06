const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance_dashboard';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      // these options are no longer required in mongoose v6+, kept for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
