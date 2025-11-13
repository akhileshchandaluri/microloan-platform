import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  const handle = (e) => {
    e.preventDefault();
    const res = signup(name, email, password);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center">
      <div className="app-container mx-auto max-w-md">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Create account</h2>
          <form onSubmit={handle} className="space-y-3">
            <input className="input" placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className="btn-primary">Sign up</button>
            {msg && <div className="text-red-400">{msg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
