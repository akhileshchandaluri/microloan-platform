import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
      <div className="app-container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-blue-400">MicroLoan+</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-300">Home</Link>
          <Link to="/apply" className="hover:text-blue-300">Apply Loan</Link>

          {user?.role === "user" && <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>}
          {user?.role === "admin" && <Link to="/admin/dashboard" className="hover:text-blue-300">Admin</Link>}

          {!user && (
            <>
              <Link to="/signup" className="hover:text-blue-300">Signup</Link>
              <Link to="/login" className="hover:text-blue-300">Login</Link>
              <Link to="/admin/login" className="hover:text-blue-300">Admin</Link>
            </>
          )}

          {user && (
            <>
              <span className="text-sm text-slate-300">Hi, {user.name ?? user.email}</span>
              <button onClick={doLogout} className="px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

