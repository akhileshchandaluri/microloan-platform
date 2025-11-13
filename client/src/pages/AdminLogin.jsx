import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handle = (e) => {
    e.preventDefault();
    // admin uses fixed credentials: admin@microloan.com / admin123
    const res = login("admin@microloan.com", password);
    if (res.success) {
      navigate("/admin/dashboard");
    } else {
      setErr("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center">
      <div className="app-container mx-auto max-w-md">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Admin login</h2>
          <form onSubmit={handle} className="space-y-3">
            <input className="input" value="admin@microloan.com" disabled />
            <input className="input" type="password" placeholder="Admin password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className="btn-primary">Login as admin</button>
            {err && <div className="text-red-400">{err}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
