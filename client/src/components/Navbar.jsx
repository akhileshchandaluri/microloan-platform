import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const doLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const navLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/" className="text-slate-300 hover:text-white transition font-medium">Home</Link>
          <Link to="/login" className="text-slate-300 hover:text-white transition font-medium">Login</Link>
          <Link to="/signup" className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition">Sign Up</Link>
          <Link to="/admin/login" className="text-slate-400 hover:text-slate-200 text-sm transition">Admin</Link>
        </>
      );
    }

    if (user.role === "user") {
      return (
        <>
          <Link to="/" className="text-slate-300 hover:text-white transition font-medium">Home</Link>
          <Link to="/apply" className="text-slate-300 hover:text-white transition font-medium">Apply Loan</Link>
          <Link to="/dashboard" className="text-slate-300 hover:text-white transition font-medium">Dashboard</Link>
          <Link to="/emi-calculator" className="text-slate-300 hover:text-white transition font-medium">EMI Calculator</Link>
        </>
      );
    }

    if (user.role === "admin") {
      return (
        <>
          <Link to="/admin/dashboard" className="text-slate-300 hover:text-white transition font-medium">Dashboard</Link>
          <Link to="/admin/loans" className="text-slate-300 hover:text-white transition font-medium">Loan Requests</Link>
          <Link to="/admin/analytics" className="text-slate-300 hover:text-white transition font-medium">Analytics</Link>
          <Link to="/admin/users" className="text-slate-300 hover:text-white transition font-medium">Users</Link>
        </>
      );
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-brand-500/20 rounded-lg group-hover:bg-brand-500/30 transition">
              <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-brand bg-clip-text text-transparent">MicroLoan+</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks()}
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </div>
                <button 
                  onClick={doLogout}
                  className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-slate-800 bg-slate-800/50 py-4 space-y-2"
          >
            <div className="flex flex-col gap-3 px-2">
              {navLinks()}
              {user && (
                <button 
                  onClick={doLogout}
                  className="w-full mt-4 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

