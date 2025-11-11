const Loan = require("../models/Loan");

// 🟢 Create a new loan
exports.createLoan = async (req, res) => {
  try {
    const { applicantName, amount, termMonths, interestRate } = req.body;
    const loan = new Loan({ applicantName, amount, termMonths, interestRate });
    await loan.save();
    res.status(201).json(loan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get all loans
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get loan by ID
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

