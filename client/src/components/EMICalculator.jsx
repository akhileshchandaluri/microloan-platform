import React, { useState, useMemo } from "react";

export default function EMICalculator() {
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(12);

  // Fixed 14% p.a. for sample EMI calculator
  const annualInterest = 14;
  const monthlyRate = annualInterest / 12 / 100;

  const emi = useMemo(() => {
    const P = Number(amount) || 0;
    const n = Number(tenure) || 1;
    if (P <= 0 || n <= 0) return 0;
    const r = monthlyRate;
    const numerator = P * r * Math.pow(1 + r, n);
    const denominator = Math.pow(1 + r, n) - 1;
    return denominator === 0 ? 0 : Math.round(numerator / denominator);
  }, [amount, tenure, monthlyRate]);

  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - amount;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-3">📊 EMI Calculator (Sample: 14% p.a.)</h2>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Loan Amount */}
        <div>
          <label className="text-slate-300 text-sm mb-2 block">Loan Amount (₹)</label>
          <input
            type="number"
            className="w-full bg-slate-900/30 border border-slate-700 rounded px-3 py-2 text-white"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value || 0))}
            min={1000}
            step={1000}
          />
        </div>

        {/* Tenure */}
        <div>
          <label className="text-slate-300 text-sm mb-2 block">Tenure (months)</label>
          <input
            type="number"
            className="w-full bg-slate-900/30 border border-slate-700 rounded px-3 py-2 text-white"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value || 1))}
            min={1}
            max={360}
          />
        </div>

        {/* Interest Rate */}
        <div>
          <label className="text-slate-300 text-sm mb-2 block">Interest Rate (annual)</label>
          <div className="mt-2 text-white font-semibold text-lg bg-slate-900/30 p-2 rounded">
            {annualInterest}% p.a.
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Monthly EMI</p>
          <p className="text-2xl font-bold text-blue-400">₹{emi.toLocaleString("en-IN")}</p>
        </div>

        <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Interest</p>
          <p className="text-2xl font-bold text-orange-400">₹{totalInterest.toLocaleString("en-IN")}</p>
        </div>

        <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Amount Payable</p>
          <p className="text-2xl font-bold text-green-400">₹{totalAmount.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-200">
        ℹ️ This is a sample calculator with fixed 14% interest. Your actual interest rate will depend on the loan purpose (Business: 12%, Education: 10%, Personal: 16%).
      </div>
    </div>
  );
}