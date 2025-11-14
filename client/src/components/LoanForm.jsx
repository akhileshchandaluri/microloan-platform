import { useState, useEffect } from "react";
import { createLoan } from "../services/localApi";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function LoanForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: 10000,
    duration: 6,
    purpose: "Business"
  });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const interestRate = 12; // 12% annual
  
  const calculateEMI = () => {
    const p = Number(formData.amount);
    const r = interestRate / 12 / 100;
    const n = Number(formData.duration);
    
    if (p === 0 || n === 0) return 0;
    return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  const emi = calculateEMI();
  const totalAmount = emi * formData.duration;
  const totalInterest = totalAmount - formData.amount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.duration || !formData.purpose) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.amount < 5000) {
      toast.error("Minimum loan amount is ₹5,000");
      return;
    }

    if (formData.amount > 500000) {
      toast.error("Maximum loan amount is ₹5,00,000");
      return;
    }

    setSaving(true);
    const loan = createLoan({
      name: user?.name || "",
      email: user?.email || "",
      amount: formData.amount,
      duration: formData.duration,
      purpose: formData.purpose,
      emi: emi
    });
    setSaving(false);
    setSubmitted(true);
    toast.success("Application submitted successfully!");
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-slate-800/50 backdrop-blur border border-brand-500/20 rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-accent-emerald/20 rounded-full">
              <CheckCircle className="w-12 h-12 text-accent-emerald" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
          <p className="text-slate-300 mb-2">Your loan application has been submitted successfully.</p>
          <p className="text-slate-400 text-sm">You'll be redirected to your dashboard in a moment...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur border border-brand-500/20 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-brand p-8">
          <h2 className="text-3xl font-bold text-white mb-2">Apply for a Loan</h2>
          <p className="text-blue-100">Get instant approval for loans up to ₹5 lakhs</p>
        </div>

        <form onSubmit={submit} className="p-8 space-y-6">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold text-white">Loan Amount</label>
              <span className="text-2xl font-bold text-brand-400">₹{formData.amount.toLocaleString('en-IN')}</span>
            </div>
            <input 
              type="range" 
              name="amount"
              min="5000" 
              max="500000" 
              step="5000"
              value={formData.amount}
              onChange={handleChange}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>₹5K</span>
              <span>₹5L</span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold text-white">Loan Duration</label>
              <span className="text-2xl font-bold text-brand-400">{formData.duration} months</span>
            </div>
            <input 
              type="range" 
              name="duration"
              min="3" 
              max="60" 
              step="1"
              value={formData.duration}
              onChange={handleChange}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>3 months</span>
              <span>60 months</span>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Purpose of Loan</label>
            <select 
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            >
              <option>Business</option>
              <option>Education</option>
              <option>Medical</option>
              <option>Home Renovation</option>
              <option>Debt Consolidation</option>
              <option>Other</option>
            </select>
          </div>

          {/* EMI Breakdown Card */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 bg-slate-700/50 rounded-lg p-6 border border-slate-600"
          >
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Monthly EMI</p>
              <p className="text-2xl font-bold text-brand-400">₹{emi.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-center border-l border-r border-slate-600">
              <p className="text-slate-400 text-sm mb-2">Total Interest</p>
              <p className="text-2xl font-bold text-amber-400">₹{totalInterest.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Total Amount</p>
              <p className="text-2xl font-bold text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>

          {/* Info Box */}
          <div className="bg-brand-500/10 border border-brand-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-brand-200 font-semibold mb-1">Interest Rate: {interestRate}% per annum</p>
              <p className="text-slate-400">Rates may vary based on credit score and loan amount</p>
            </div>
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded bg-slate-700 border-slate-600" required />
            <span className="text-sm text-slate-300">I agree to the <a href="#" className="text-brand-400 hover:text-brand-300">terms and conditions</a></span>
          </label>

          {/* Submit Button */}
          <motion.button 
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            {saving ? "Processing..." : "Apply Now"}
          </motion.button>

          {/* Info Text */}
          <p className="text-center text-slate-400 text-sm">
            ✓ Instant approval • ✓ 0% documentation • ✓ Funds in 24 hours
          </p>
        </form>
      </motion.div>
    </div>
  );
}
