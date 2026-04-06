const User = require('../models/User');

async function createUser({ username, email, password, role }) {
  const user = new User({ username, email, password, role });
  return user.save();
}

async function findByEmail(email) {
  return User.findOne({ email });
}

async function findById(id) {
  return User.findById(id);
}

module.exports = {
  createUser,
  findByEmail,
  findById,
};
