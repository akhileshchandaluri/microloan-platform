const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
  applyLoan,
  getMyLoans,
  getAllLoans,
  updateLoanStatus
} = require('../controllers/loanController');
const { loanApplicationLimiter } = require('../middleware/userRateLimit');

const router = express.Router();

// Apply for a new loan (protected - user must be authenticated)
router.post('/apply', authenticate, loanApplicationLimiter, applyLoan);

// Get user's own loans (protected)
router.get('/my-loans', authenticate, getMyLoans);

// Get all loans (admin only - protected)
router.get('/all', authenticate, getAllLoans);

// Update loan status (admin only - protected)
router.put('/update-status', authenticate, updateLoanStatus);

// Get single loan by ID (protected)
router.get('/:loanId', authenticate, async (req, res) => {
  try {
    const Loan = require('../models/Loan');
    const loan = await Loan.findById(req.params.loanId).populate('user', 'name email phone');
    
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    // Check if user owns this loan or is admin
    if (loan.user._id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    return res.json({ success: true, loan });
  } catch (err) {
    console.error('Get loan error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// Delete loan (admin only - protected)
router.delete('/:loanId', authenticate, async (req, res) => {
  try {
    const Loan = require('../models/Loan');
    
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    // Check if admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can delete loans' });
    }

    await Loan.findByIdAndDelete(req.params.loanId);

    return res.json({ success: true, message: 'Loan deleted successfully' });
  } catch (err) {
    console.error('Delete loan error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

module.exports = router;