import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-400">
          MicroLoan
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        {/* Navigation Links */}
        <div className={`absolute md:relative top-16 md:top-0 left-0 right-0 md:flex gap-6 items-center ${menuOpen ? "bg-slate-800 p-4 flex flex-col" : "hidden"}`}>
          
          {!user ? (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white transition">
                User Login
              </Link>
              <Link to="/admin/login" className="text-slate-300 hover:text-white transition">
                Admin Login
              </Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                Sign Up
              </Link>
            </>
          ) : user.role === "admin" ? (
            <>
              <Link to="/admin/dashboard" className="text-slate-300 hover:text-white transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-slate-300 hover:text-white transition">
                Dashboard
              </Link>
              <Link to="/apply" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                Apply Loan
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}