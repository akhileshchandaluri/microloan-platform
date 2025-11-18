const Loan = require('../models/Loan');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { sendLoanApprovalEmail, sendLoanRejectionEmail } = require('../utils/emailService');

// Get all loans
exports.getAllLoans = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const { page = 1, limit = 10, status } = req.query;
    let query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const loans = await Loan.find(query)
      .populate('user', 'name email phone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Loan.countDocuments(query);

    return res.json({
      success: true,
      loans,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get loans error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update loan status
exports.updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const loan = await Loan.findByIdAndUpdate(
      loanId,
      { status },
      { new: true }
    ).populate('user', 'name email phone');

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    // Log the action
    await AuditLog.create({
      adminId: req.user.id,
      action: status === 'Approved' ? 'APPROVE_LOAN' : 'REJECT_LOAN',
      loanId,
      details: `Loan ${loanId} status changed to ${status}`
    });

    if (status === 'Approved') {
      await sendLoanApprovalEmail(loan.user.email, loan);
    } else if (status === 'Rejected') {
      await sendLoanRejectionEmail(loan.user.email, 'Admin review');
    }

    return res.json({ success: true, message: 'Status updated', loan });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};

// Get admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalLoans = await Loan.countDocuments();
    const pendingLoans = await Loan.countDocuments({ status: 'Pending' });
    const approvedLoans = await Loan.countDocuments({ status: 'Approved' });
    const rejectedLoans = await Loan.countDocuments({ status: 'Rejected' });

    const totalAmountResult = await Loan.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalAmount = totalAmountResult[0]?.total || 0;

    const approvalRate = totalLoans > 0 ? ((approvedLoans / totalLoans) * 100).toFixed(2) : 0;

    const totalUsers = await User.countDocuments({ role: 'user' });

    return res.json({
      success: true,
      stats: {
        totalApplications: totalLoans,
        pendingLoans,
        approvedLoans,
        rejectedLoans,
        totalAmount,
        approvalRate,
        totalUsers
      }
    });
  } catch (err) {
    console.error('Get stats error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    return res.json({ success: true, users });
  } catch (err) {
    console.error('Get all users error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};