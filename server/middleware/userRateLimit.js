const rateLimit = require('express-rate-limit');

exports.loanApplicationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // 5 applications per day
  message: 'Too many loan applications. Try again tomorrow.',
  keyGenerator: (req) => req.user.id
});

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Try again later.'
});