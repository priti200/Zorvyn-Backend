const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Register a new user
console.log('Registering /auth/register route');
router.post('/register', async (req, res) => {
  try {
    console.log('Received request for /auth/register:', req.body);
    const { username, email, password, role } = req.body;

    console.log('Checking if user already exists in the database...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully:', hashedPassword);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword, role });
    console.log('Saving new user to the database...');
    await newUser.save();

    console.log('User registered successfully:', newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in /auth/register:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login a user
console.log('Registering /auth/login route');
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Received request for /auth/login:', req.body);

    // Check if user exists
    console.log('Checking if user exists in the database...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Stored password hash:', user.password);
    console.log('Provided password:', password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isMatch);
    if (!isMatch) {
      console.log('Invalid credentials for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    console.log('Generating JWT for user:', user._id);
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('JWT generated successfully:', token);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Example of applying role-based access control
router.get('/admin-only', roleCheck(['Admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome, Admin!' });
});

module.exports = router;