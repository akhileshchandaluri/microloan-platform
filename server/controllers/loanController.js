const Loan = require('../models/Loan');

// Create Loan (User)
exports.createLoan = async (req, res) => {
  try {
    const { amount, duration, purpose } = req.body;

    if (!amount || !duration || !purpose) {
      return res.status(400).json({ message: "All fields required" });
    }

    const loan = await Loan.create({
      amount,
      duration,
      purpose,
      userId: req.user.id, // pulled from JWT
      status: "Pending"
    });

    res.status(201).json({ message: "Loan request submitted", loan });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User's Loan History
exports.getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin — Get ALL Loans
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin — Update Loan Status
exports.updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
