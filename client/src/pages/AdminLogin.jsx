import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Shield } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@microloan.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      console.log("Admin login response:", res.data);

      if (!res.data.success) {
        toast.error(res.data.message || "Login failed");
        return;
      }

      const { token, user } = res.data;

      // Check if user is admin
      if (user.role !== "admin") {
        toast.error("Only admins can access this panel");
        return;
      }

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", "admin");

      toast.success("Admin logged in successfully!");
      navigate("/admin/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Server error";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
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
        <div className="bg-slate-800/50 backdrop-blur border border-blue-500/20 rounded-2xl shadow-2xl p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-slate-400">Restricted access for administrators</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-blue-400" />
                <input 
                  type="email"
                  placeholder="admin@microloan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-blue-400" />
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Security Warning */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-200">
              ⚠️ Unauthorized access attempts are logged and monitored.
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-6 disabled:opacity-50 transition duration-200"
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
              <Link to="/login" className="text-blue-400 font-semibold ml-2 hover:text-blue-300">
                User Login
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-4 border-t border-slate-700">
            <Link to="/" className="text-blue-400 font-semibold hover:text-blue-300">
              Back to Home
            </Link>
          </div>

          {/* Footer */}
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