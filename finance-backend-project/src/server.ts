const express = require('express');
const app = express();
// Load environment and connect to DB
require('dotenv').config();
const connectDB = require('./config/db');
connectDB();

const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const authMiddleware = require('./middleware/auth');

app.use(express.json());

// Public routes
console.log('Setting up public routes');
app.use('/auth', authRoutes); // Mount all auth routes under /auth

// Apply authentication middleware for all other routes except public ones
console.log('Applying authentication middleware');
app.use((req, res, next) => {
  if (req.path.startsWith('/auth/register') || req.path.startsWith('/auth/login')) {
    return next(); // Skip middleware for public routes
  }
  authMiddleware(req, res, next);
});

// Protected routes
console.log('Setting up protected routes');
app.use('/records', recordRoutes);

module.exports = app; // Export the app instance for testing