const jwt = require('jsonwebtoken');

const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'default_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;
