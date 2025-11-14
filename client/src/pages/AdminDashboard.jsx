import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Clock, LogOut } from "lucide-react";
import AnalyticsCharts from "../components/AnalyticsCharts.jsx";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Load loans
  const loadLoans = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/loans", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        setLoans(res.data.loans);
      } else {
        toast.error("Failed to load loans");
      }
    } catch (err) {
      console.error("Load loans error:", err);
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadLoans();
  }, [token]);

  // Update loan status
  const updateLoanStatus = async (loanId, newStatus) => {
    try {
      const res = await axios.put(
        `/api/loans/${loanId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        toast.success(`Loan ${newStatus.toLowerCase()} successfully!`);
        loadLoans();
      } else {
        toast.error("Failed to update loan");
      }
    } catch (err) {
      console.error("Update loan error:", err);
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  // Filter loans
  const filteredLoans = filter === "All" 
    ? loans 
    : loans.filter(loan => loan.status === filter);

  // Calculate stats
  const stats = {
    total: loans.length,
    pending: loans.filter(l => l.status === "Pending").length,
    approved: loans.filter(l => l.status === "Approved").length,
    rejected: loans.filter(l => l.status === "Rejected").length,
    totalAmount: loans.reduce((sum, l) => sum + (Number(l.amount) || 0), 0),
    approvalRate: loans.length > 0 ? Math.round((loans.filter(l => l.status === "Approved").length / loans.length) * 100) : 0
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Welcome, {user.name || "Admin"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Total Applications</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              Pending
            </p>
            <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Approved
            </p>
            <p className="text-3xl font-bold text-green-500">{stats.approved}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Rejected
            </p>
            <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Total Amount</p>
            <p className="text-3xl font-bold text-blue-400">
              ₹{(stats.totalAmount / 100000).toFixed(1)}L
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Approval Rate</p>
            <p className="text-3xl font-bold text-purple-400">{stats.approvalRate}%</p>
          </div>
        </div>

        {/* Analytics Charts Section */}
        {loans.length > 0 && <AnalyticsCharts loans={loans} />}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["All", "Pending", "Approved", "Rejected"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Loans Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading loans...</div>
          ) : filteredLoans.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No {filter.toLowerCase()} loans found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700 border-b border-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Applicant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">EMI</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Purpose</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Applied</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.map((loan) => (
                    <tr key={loan._id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                      <td className="px-6 py-4">
                        <p className="text-white font-semibold">{loan.name}</p>
                        <p className="text-slate-400 text-sm">{loan.email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        <p className="text-sm">{loan.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        ₹{Number(loan.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {loan.duration} months
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        ₹{(Number(loan.emi) || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {loan.purpose}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit ${
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
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(loan.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        {loan.status === "Pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateLoanStatus(loan._id, "Approved")}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateLoanStatus(loan._id, "Rejected")}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}