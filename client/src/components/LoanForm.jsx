import { useState } from "react";
import { createLoan } from "../services/localApi";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function LoanForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(6);
  const [purpose, setPurpose] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name || !email || !amount || !duration) {
      setMsg("Please fill all fields.");
      return;
    }
    setSaving(true);
    const loan = createLoan({ name, email, amount, duration, purpose });
    setSaving(false);
    setMsg("Application submitted ✅");
    // after a short delay go to dashboard or reset
    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-3xl font-bold mb-4 text-blue-300">Apply for Loan</h2>

        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="Your Full Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="input" type="number" placeholder="Loan Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
          <input className="input" type="number" placeholder="Duration (months)" value={duration} onChange={(e)=>setDuration(e.target.value)} />
          <textarea className="input h-28" placeholder="Purpose of Loan" value={purpose} onChange={(e)=>setPurpose(e.target.value)} />
          <button className="btn-primary" disabled={saving}>{saving ? "Submitting..." : "Submit Application"}</button>
          {msg && <div className="text-sm text-green-400">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
