const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    enum: ['APPROVE_LOAN', 'REJECT_LOAN', 'UPDATE_LOAN', 'DELETE_LOAN'],
    required: true
  },
  loanId: mongoose.Schema.Types.ObjectId,
  details: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);