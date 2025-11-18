const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [5000, 'Minimum loan amount is ₹5,000'],
    max: [500000, 'Maximum loan amount is ₹5,00,000']
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Minimum duration is 1 month'],
    max: [120, 'Maximum duration is 120 months']
  },
  purpose: {
    type: String,
    enum: ['Business', 'Education', 'Personal', 'Other'],
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  emi: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  rejectionReason: String,
  approvalDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Loan', loanSchema);