import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email & password required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (res.data?.success && res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Logged in successfully!");

        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(res.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-slate-800 p-6 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Sign In</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full p-3 rounded mb-3 bg-slate-700 text-white border border-slate-600 placeholder-slate-400"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full p-3 rounded mb-4 bg-slate-700 text-white border border-slate-600 placeholder-slate-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-slate-400 mt-4">
          No account?
          <Link to="/signup" className="text-blue-400 ml-2 font-semibold">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}