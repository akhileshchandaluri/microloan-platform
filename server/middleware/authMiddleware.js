const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getTokenFromHeader = (req) => {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.split(' ')[1];
  // fallback to cookie token if you store token in cookies
  if (req.cookies && req.cookies.token) return req.cookies.token;
  return null;
};

const protect = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // optionally fetch fresh user
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    return next();
  } catch (err) {
    console.error('Auth error:', err.message || err);
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};

module.exports = { protect, adminOnly };
