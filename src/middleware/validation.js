function validateRegister(req, res, next) {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
}

function validateRecord(req, res, next) {
  const { title, amount, type } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (amount === undefined || amount === null || typeof amount !== 'number' || amount <= 0) {
    errors.push('Amount must be a positive number');
  }
  if (!type || !['income', 'expense'].includes(type)) {
    errors.push('Type must be "income" or "expense"');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateRecord,
};
