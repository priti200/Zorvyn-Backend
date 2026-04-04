// Middleware to enforce role-based access control

module.exports = function (requiredRoles) {
  return (req, res, next) => {
    try {
      const userRole = req.user.role; // Assuming req.user is populated by authentication middleware

      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
};