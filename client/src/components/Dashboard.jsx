import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Clock, LogOut, Plus, X } from "lucide-react";
import EMICalculator from "../components/EMICalculator.jsx";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Apply modal state & form
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(12);
  const [purpose, setPurpose] = useState("");

  // Interest mapping per purpose (annual %)
  const interestRates = {
    Business: 12,   // business loans @ 12% p.a.
    Education: 10,  // education loans @ 10% p.a.
    Personal: 16,   // personal loans @ 16% p.a.
    Default: 14     // fallback
  };

  const getInterestForPurpose = (p) => {
    if (!p) return interestRates.Default;
    const key = Object.keys(interestRates).find(k => k.toLowerCase() === p.toLowerCase());
    return key ? interestRates[key] : interestRates.Default;
  };

  // Load user loans
  const loadLoans = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/loans/my-loans", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        setLoans(res.data.loans);
      } else {
        toast.error("Failed to load loans");
      }
    } catch (err) {
      console.error("Load loans error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadLoans();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleOpenApply = () => {
    // reset form defaults
    setAmount(50000);
    setTenure(12);
    setPurpose("");
    setShowApplyModal(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      const interestRate = getInterestForPurpose(purpose);
      const res = await axios.post(
        "/api/loans/apply",
        { amount, duration: tenure, purpose, interestRate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        toast.success("Loan application submitted");
        setShowApplyModal(false);
        loadLoans();
      } else {
        toast.error(res.data?.message || "Failed to apply");
      }
    } catch (err) {
      console.error("Apply error:", err);
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-slate-900"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="bg-slate-800 border-b border-slate-700 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {user.name}</h1>
            <p className="text-slate-400 text-sm">Manage your loan applications</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleOpenApply}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Apply New Loan
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* EMI Calculator Section */}
        <motion.div variants={itemVariants}>
          <EMICalculator />
        </motion.div>

        {/* Loans Section */}
        <motion.div variants={itemVariants}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Loan Applications</h2>
            
            {loading ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center text-slate-400">
                Loading your applications...
              </div>
            ) : loans.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center">
                <p className="text-slate-400 mb-4">You haven't applied for any loans yet</p>
                <button
                  onClick={handleOpenApply}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Apply for Loan Now
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {loans.map((loan) => (
                  <motion.div
                    key={loan._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition"
                  >
                    <div className="grid md:grid-cols-6 gap-4 items-center">
                      {/* Amount */}
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Amount</p>
                        <p className="text-xl font-bold text-white">
                          ₹{Number(loan.amount).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Duration */}
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Duration</p>
                        <p className="text-xl font-bold text-white">
                          {loan.duration} months
                        </p>
                      </div>

                      {/* Interest Rate */}
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Interest Rate</p>
                        <p className="text-xl font-bold text-orange-400">
                          {loan.interestRate}% p.a.
                        </p>
                      </div>

                      {/* EMI */}
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Monthly EMI</p>
                        <p className="text-xl font-bold text-blue-400">
                          ₹{Number(loan.emi).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Purpose */}
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Purpose</p>
                        <p className="text-white font-semibold">
                          {loan.purpose}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="flex justify-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
                          loan.status === "Approved"
                            ? "bg-green-500/20 text-green-400"
                            : loan.status === "Rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {loan.status}
                        </span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400">
                      <p>Applied on: {new Date(loan.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div variants={itemVariants} className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">💡 Quick Tips</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>✓ Use the EMI Calculator above to estimate your monthly payment</li>
            <li>✓ Lower loan amount = Lower EMI and total interest</li>
            <li>✓ Longer duration = Lower EMI but higher total interest</li>
            <li>✓ Check your loan status regularly on this dashboard</li>
            <li>✓ Once approved, you'll receive funds within 2-3 business days</li>
          </ul>
        </motion.div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-slate-800 rounded-lg w-full max-w-xl p-6 relative">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-3 right-3 text-slate-300 hover:text-white"
              aria-label="Close apply modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">Apply for a Loan</h3>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm mb-2 block">Loan Amount</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1000}
                    max={200000}
                    step={500}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full"
                    aria-label="Loan amount"
                  />
                  <div className="min-w-[110px] text-right text-white font-semibold">
                    {formatCurrency(amount)}
                  </div>
                </div>
                <div className="text-slate-400 text-xs mt-1">Drag the slider or type amount below</div>
                <input
                  type="number"
                  value={amount}
                  min={1000}
                  max={200000}
                  step={500}
                  onChange={(e) => setAmount(Number(e.target.value || 0))}
                  className="mt-2 w-full bg-slate-900/30 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-2 block">Tenure (months)</label>
                <input
                  type="number"
                  value={tenure}
                  min={1}
                  max={120}
                  onChange={(e) => setTenure(Number(e.target.value || 1))}
                  className="w-full bg-slate-900/30 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-2 block">Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-900/30 border border-slate-700 rounded px-3 py-2 text-white"
                >
                  <option value="">Select purpose</option>
                  <option value="Business">Business</option>
                  <option value="Education">Education</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
                <div className="text-slate-400 text-xs mt-2">
                  Interest rate for selected purpose: <span className="font-semibold text-white">{getInterestForPurpose(purpose)}% p.a.</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowApplyModal(false); navigate("/apply"); }}
                  className="px-4 py-2 bg-transparent border border-slate-600 text-slate-300 rounded hover:bg-slate-700 transition"
                >
                  Open full apply page
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}