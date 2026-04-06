const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'testsecret'; // Use default secret for tests

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication failed: Invalid token format' });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    const decoded = jwt.verify(token, SECRET); // Verify token
    req.user = decoded; // Attach user info to req
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};