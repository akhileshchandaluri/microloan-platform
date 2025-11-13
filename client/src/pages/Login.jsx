import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setErr(res.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center">
      <div className="app-container mx-auto max-w-md">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handle} className="space-y-3">
            <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className="btn-primary">Login</button>
            {err && <div className="text-red-400">{err}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
