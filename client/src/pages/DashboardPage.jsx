import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Clock, LogOut, Plus, Filter, Search } from "lucide-react";
import EMICalculator from "../components/EMICalculator.jsx";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Load user loans
  const loadLoans = async () => {
    try {
      setLoading(true);
      let query = "?sortBy=" + sortBy;
      if (filter !== "All") query += "&status=" + filter;

      const res = await axios.get(`/api/loans/my-loans${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        setLoans(res.data.loans);
      } else {
        toast.error("Failed to load loans");
      }
    } catch (err) {
      console.error("Load loans error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadLoans();
  }, [token, filter, sortBy]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    // Implement search if needed
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {user.name}</h1>
            <p className="text-slate-400 text-sm">Manage your loan applications</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/apply")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Apply New Loan
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* EMI Calculator Section */}
        <div className="mb-8">
          <EMICalculator />
        </div>

        {/* Loans Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Loan Applications</h2>
          
          {loading ? (
            <div className="bg-slate-800 rounded-lg p-8 text-center text-slate-400">
              Loading your applications...
            </div>
          ) : loans.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-8 text-center">
              <p className="text-slate-400 mb-4">You haven't applied for any loans yet</p>
              <button
                onClick={() => navigate("/apply")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                Apply for Loan Now
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {loans.map((loan) => (
                <div
                  key={loan._id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition"
                >
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    {/* Amount */}
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Amount</p>
                      <p className="text-xl font-bold text-white">
                        ₹{Number(loan.amount).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Duration */}
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Duration</p>
                      <p className="text-xl font-bold text-white">
                        {loan.duration} months
                      </p>
                    </div>

                    {/* EMI */}
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Monthly EMI</p>
                      <p className="text-xl font-bold text-blue-400">
                        ₹{Number(loan.emi).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Purpose */}
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Purpose</p>
                      <p className="text-white font-semibold">
                        {loan.purpose}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex justify-end">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                          loan.status === "Approved"
                            ? "bg-green-500/20 text-green-400"
                            : loan.status === "Rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {loan.status === "Approved" && <CheckCircle className="w-4 h-4" />}
                        {loan.status === "Rejected" && <XCircle className="w-4 h-4" />}
                        {loan.status === "Pending" && <Clock className="w-4 h-4" />}
                        {loan.status}
                      </span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400">
                    <p>Applied on: {new Date(loan.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search & Filter */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search loans..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/30 border border-slate-600 rounded text-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900/30 border border-slate-600 rounded px-4 py-2 text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">💡 Quick Tips</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>✓ Use the EMI Calculator above to estimate your monthly payment</li>
            <li>✓ Lower loan amount = Lower EMI and total interest</li>
            <li>✓ Longer duration = Lower EMI but higher total interest</li>
            <li>✓ Check your loan status regularly on this dashboard</li>
            <li>✓ Once approved, you'll receive funds within 2-3 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
}