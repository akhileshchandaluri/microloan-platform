const express = require('express');
const router = express.Router();

const {
  createLoan,
  getMyLoans,
  getAllLoans,
  updateLoanStatus
} = require('../controllers/loanController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// User submit loan
router.post('/', protect, createLoan);

// User history
router.get('/me', protect, getMyLoans);

// Admin get all
router.get('/', protect, adminOnly, getAllLoans);

// Admin update status
router.patch('/:id/status', protect, adminOnly, updateLoanStatus);

module.exports = router;
