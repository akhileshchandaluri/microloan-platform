import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoanForm() {
  const [formData, setFormData] = useState({
    amount: 10000,
    duration: 6,
    purpose: "Business"
  });

  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const calcEMI = (p, n, annualRate = 12) => {
    const r = annualRate / 12 / 100;
    if (!p || !n) return 0;
    return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  const emi = calcEMI(Number(formData.amount), Number(formData.duration));
  const total = emi * Number(formData.duration);
  const totalInterest = total - Number(formData.amount);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.duration || !formData.purpose)
      return toast.error("Fill all fields");

    if (Number(formData.amount) < 5000)
      return toast.error("Minimum ₹5,000");

    if (Number(formData.amount) > 500000)
      return toast.error("Maximum ₹5,00,000");

    try {
      setSaving(true);

      const res = await axios.post(
        "/api/loans/apply",
        { ...formData, emi },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        toast.success("Application submitted successfully!");
        setTimeout(() => (window.location.href = "/dashboard"), 800);
      } else {
        toast.error(res.data?.message || "Failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={submit} className="bg-slate-800 p-6 rounded">
        <h3 className="text-xl font-bold text-white mb-4">Apply for a Loan</h3>

        <label className="block text-sm text-slate-300 mb-1">Amount</label>
        <input
          type="range"
          name="amount"
          min="5000"
          max="500000"
          step="5000"
          value={formData.amount}
          onChange={handleChange}
          className="w-full mb-2"
        />
        <div className="flex justify-between text-xs text-slate-400 mb-3">
          <span>₹5K</span>
          <span>₹5L</span>
        </div>

        <label className="block text-sm text-slate-300 mb-1">
          Duration (months)
        </label>
        <input
          type="range"
          name="duration"
          min="3"
          max="60"
          step="1"
          value={formData.duration}
          onChange={handleChange}
          className="w-full mb-3"
        />

        <label className="block text-sm text-slate-300 mb-1">Purpose</label>
        <select
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className="w-full p-2 rounded mb-4 bg-slate-700 text-white border border-slate-600"
        >
          <option>Business</option>
          <option>Education</option>
          <option>Medical</option>
          <option>Home Renovation</option>
          <option>Debt Consolidation</option>
          <option>Other</option>
        </select>

        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
          <div>
            <p className="text-slate-400 text-xs">EMI</p>
            <p className="font-bold text-white">
              ₹{emi.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Total Interest</p>
            <p className="font-bold text-amber-400">
              ₹{totalInterest.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Total</p>
            <p className="font-bold text-emerald-400">
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <label className="text-slate-300 text-sm mb-3 block">
          <input type="checkbox" required className="mr-2" /> I agree to terms
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-brand-500 text-white p-3 rounded"
        >
          {saving ? "Processing..." : "Apply Now"}
        </button>
      </form>
    </div>
  );
}