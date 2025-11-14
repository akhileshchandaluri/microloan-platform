const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
  getAllLoans,
  updateLoanStatus,
  getAdminStats,
  getAllUsers
} = require('../controllers/adminController');

const router = express.Router();

// Admin-only middleware
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

// Routes
router.get('/loans', authenticate, isAdmin, getAllLoans);
router.put('/loans/:loanId/status', authenticate, isAdmin, updateLoanStatus);
router.get('/stats', authenticate, isAdmin, getAdminStats);
router.get('/users', authenticate, isAdmin, getAllUsers);

module.exports = router;
