const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    next();
  } catch (err) {
    console.error('JWT error', err);
    return res.status(401).json({ message: 'Token invalid' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};
