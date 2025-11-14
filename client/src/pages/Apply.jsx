import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Footer from "../components/Footer.jsx";

export default function Apply() {
  const [amount, setAmount] = useState(50000);
  const [duration, setDuration] = useState(12);
  const [purpose, setPurpose] = useState("Business");
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [total, setTotal] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Interest rates per purpose
  const interestRates = {
    Business: 12,
    Education: 10,
    Personal: 16,
    Other: 14
  };

  const getInterestRate = (p) => {
    return interestRates[p] || interestRates.Other;
  };

  // Calculate EMI
  const calculateEMI = (principal, rate, months) => {
    const P = Number(principal);
    const r = (Number(rate) / 100) / 12;
    const n = Number(months);
    
    if (P <= 0 || n <= 0 || r <= 0) return 0;
    
    const numerator = P * r * Math.pow(1 + r, n);
    const denominator = Math.pow(1 + r, n) - 1;
    return Math.round(numerator / denominator);
  };

  useEffect(() => {
    const rate = getInterestRate(purpose);
    const calculatedEmi = calculateEMI(amount, rate, duration);
    const totalPayable = calculatedEmi * duration;
    const interest = totalPayable - amount;

    setEmi(calculatedEmi);
    setTotal(totalPayable);
    setTotalInterest(interest);
  }, [amount, duration, purpose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error("Please agree to terms and conditions");
      return;
    }

    try {
      setLoading(true);
      const rate = getInterestRate(purpose);
      
      const res = await axios.post(
        "/api/loans/apply",
        {
          amount,
          duration,
          purpose,
          interestRate: rate,
          emi
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data?.success) {
        toast.success("Loan application submitted successfully!");
        setTimeout(() => window.location.href = "/dashboard", 2000);
      } else {
        toast.error(res.data?.message || "Failed to apply");
      }
    } catch (err) {
      console.error("Apply error:", err);
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-900 pt-20"
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <h1 className="text-3xl font-bold text-white mb-2">Apply for a Loan</h1>
          <p className="text-slate-400 mb-6">Fill in the details below to apply</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-semibold">Loan Amount</label>
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(amount)}
                </div>
              </div>
              <input
                type="range"
                min={5000}
                max={500000}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-slate-400 text-sm mt-2">
                <span>₹5K</span>
                <span>₹500K</span>
              </div>

              {/* Amount Input Field */}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value || 5000))}
                min={5000}
                max={500000}
                step={5000}
                className="w-full mt-3 bg-slate-900/30 border border-slate-600 rounded px-4 py-2 text-white"
                placeholder="Or type amount"
              />
            </div>

            {/* Duration */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-semibold">Loan Duration (Months)</label>
                <div className="text-2xl font-bold text-blue-400">{duration}</div>
              </div>
              <input
                type="range"
                min={1}
                max={120}
                step={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-slate-400 text-sm mt-2">
                <span>1 month</span>
                <span>120 months</span>
              </div>

              {/* Duration Input Field */}
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value || 1))}
                min={1}
                max={120}
                className="w-full mt-3 bg-slate-900/30 border border-slate-600 rounded px-4 py-2 text-white"
                placeholder="Or type months"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="text-white font-semibold block mb-2">Loan Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-slate-900/30 border border-slate-600 rounded px-4 py-2 text-white"
              >
                <option value="Business">Business - 12% p.a.</option>
                <option value="Education">Education - 10% p.a.</option>
                <option value="Personal">Personal - 16% p.a.</option>
                <option value="Other">Other - 14% p.a.</option>
              </select>
            </div>

            {/* EMI Breakdown */}
            <div className="grid grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded border border-slate-700">
              <div>
                <p className="text-slate-400 text-sm mb-1">Monthly EMI</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(emi)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-orange-400">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>

            {/* Interest Rate Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
              <p className="text-blue-200 text-sm">
                ℹ️ Interest Rate for <strong>{purpose}</strong>: <strong>{getInterestRate(purpose)}% p.a.</strong>
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-slate-600"
              />
              <label htmlFor="terms" className="text-slate-300 text-sm">
                I agree to the terms and conditions
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              {loading ? "Processing..." : "Apply Now"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
