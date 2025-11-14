import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@microloan.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    const res = login(email, password);
    setLoading(false);

    if (res.success) {
      toast.success("Admin logged in successfully!");
      navigate("/admin/dashboard");
    } else {
      toast.error(res.message || "Login failed. Invalid credentials.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <div className="bg-slate-800/50 backdrop-blur border border-brand-500/20 rounded-2xl shadow-2xl p-8">
          {/* Header with Shield Icon */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-brand-500/20 rounded-full">
                <Shield className="w-8 h-8 text-brand-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-slate-400">Restricted access for administrators</p>
          </div>

          {/* Form */}
          <form onSubmit={handle} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-brand-400" />
                <input 
                  type="email"
                  placeholder="admin@microloan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-brand-400" />
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-brand-500/10 border border-brand-500/30 rounded-lg p-3 text-sm text-brand-200">
              ⚠️ Unauthorized access attempts are logged and monitored.
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Verifying..." : "Enter Admin Dashboard"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-600"></div>
            <span className="text-slate-400 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-600"></div>
          </div>

          {/* User Login Link */}
          <div className="text-center mb-4">
            <p className="text-slate-400">
              Not an admin? 
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold ml-2">
                User Login
              </Link>
            </p>
          </div>

          {/* Home Link */}
          <div className="text-center pt-4 border-t border-slate-700">
            <p className="text-slate-500 text-sm">
              <Link to="/" className="text-brand-400 hover:text-brand-300 font-semibold">
                Back to Home
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="text-center mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
              <span>🔐</span>
              This area is secure and encrypted
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
