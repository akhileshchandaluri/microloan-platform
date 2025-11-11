const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema(
  {
    applicantName: { type: String, required: true },
    amount: { type: Number, required: true },
    termMonths: { type: Number, default: 12 },
    interestRate: { type: Number, default: 10 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", LoanSchema);
