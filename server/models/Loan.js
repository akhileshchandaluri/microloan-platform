const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Loan', loanSchema);