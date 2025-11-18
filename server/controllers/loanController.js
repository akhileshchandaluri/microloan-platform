const Loan = require('../models/Loan');

// Interest mapping per purpose (annual %)
const interestRates = {
  Business: 12,
  Education: 10,
  Personal: 16,
  Other: 14
};

function getInterestForPurpose(purpose) {
  if (!purpose) return interestRates.Other;
  const key = Object.keys(interestRates).find(k => k.toLowerCase() === String(purpose).toLowerCase());
  return key ? interestRates[key] : interestRates.Other;
}

function calculateEMI(principal, annualRatePercent, months) {
  const P = Number(principal);
  const r = (Number(annualRatePercent) / 100) / 12;
  const n = Number(months);
  
  if (P <= 0 || n <= 0 || r <= 0) return 0;
  
  const numerator = P * r * Math.pow(1 + r, n);
  const denominator = Math.pow(1 + r, n) - 1;
  return Math.round(numerator / denominator);
}

exports.applyLoan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, duration, purpose } = req.body;

    console.log('Apply Loan Request:', { userId, amount, duration, purpose });

    // Validate required fields
    if (!amount || !duration || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Amount, duration, and purpose are required"
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Determine interest rate based on purpose
    const finalInterestRate = getInterestForPurpose(purpose);

    // Calculate EMI
    const emi = calculateEMI(amount, finalInterestRate, duration);

    // Create loan
    const loan = new Loan({
      user: userId,
      amount: Number(amount),
      duration: Number(duration),
      purpose,
      interestRate: Number(finalInterestRate),
      emi,
      status: 'Pending'
    });

    const savedLoan = await loan.save();

    console.log('Loan created:', savedLoan);

    return res.status(201).json({
      success: true,
      message: 'Loan application submitted',
      loan: {
        _id: savedLoan._id,
        amount: savedLoan.amount,
        duration: savedLoan.duration,
        purpose: savedLoan.purpose,
        interestRate: savedLoan.interestRate,
        emi: savedLoan.emi,
        status: savedLoan.status,
        createdAt: savedLoan.createdAt
      }
    });
  } catch (err) {
    console.error('Apply loan error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};

exports.getMyLoans = async (req, res) => {
  try {
    const { status, sortBy } = req.query;
    let query = { user: req.user.id };

    // Filter by status
    if (status && ['Pending', 'Approved', 'Rejected'].includes(status)) {
      query.status = status;
    }

    // Sort options
    let sort = { createdAt: -1 };
    if (sortBy === 'amount-high') sort = { amount: -1 };
    if (sortBy === 'amount-low') sort = { amount: 1 };
    if (sortBy === 'newest') sort = { createdAt: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };

    const loans = await Loan.find(query).sort(sort);
    return res.json({ success: true, loans });
  } catch (err) {
    console.error('Get loans error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can view all loans' });
    }

    const { status, purpose, search, sortBy } = req.query;
    let query = {};

    if (status) query.status = status;
    if (purpose) query.purpose = purpose;
    
    if (search) {
      query.$or = [
        { 'user.name': new RegExp(search, 'i') },
        { 'user.email': new RegExp(search, 'i') }
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'amount-high') sort = { amount: -1 };
    if (sortBy === 'amount-low') sort = { amount: 1 };

    const loans = await Loan.find(query)
      .populate('user', 'name email phone')
      .sort(sort);

    return res.json({ success: true, loans });
  } catch (err) {
    console.error('Get all loans error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateLoanStatus = async (req, res) => {
  try {
    const { loanId, status } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can update loan status' });
    }

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const loan = await Loan.findByIdAndUpdate(loanId, { status }, { new: true });

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    return res.json({ success: true, message: 'Loan status updated', loan });
  } catch (err) {
    console.error('Update loan error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};
