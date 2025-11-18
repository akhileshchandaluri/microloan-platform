import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CheckCircle, XCircle, Clock, LogOut, Eye } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [updatingLoan, setUpdatingLoan] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token || user.role !== "admin") {
      navigate("/admin/login");
      return;
    }
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsRes = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.data?.success) {
        setStats(statsRes.data.stats);
      }

      // Load loans
      const loansRes = await axios.get("/api/admin/loans", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (loansRes.data?.success) {
        setLoans(loansRes.data.loans);
      }
    } catch (err) {
      console.error("Load data error:", err);
      if (err.response?.status === 401) {
        navigate("/admin/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (loanId, newStatus) => {
    try {
      setUpdatingLoan(loanId);
      const res = await axios.put(
        `/api/admin/loans/${loanId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        toast.success("Loan status updated");
        setLoans(loans.map(loan => loan._id === loanId ? res.data.loan : loan));
        setSelectedLoan(null);
        loadData();
      } else {
        toast.error(res.data?.message || "Failed to update");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setUpdatingLoan(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    toast.success("Logged out");
    navigate("/");
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);

  const getFilteredLoans = () => {
    if (filter === "All") return loans;
    return loans.filter(loan => loan.status === filter);
  };

  const chartData = [
    { name: "Pending", value: stats?.pendingLoans || 0, fill: "#f59e0b" },
    { name: "Approved", value: stats?.approvedLoans || 0, fill: "#10b981" },
    { name: "Rejected", value: stats?.rejectedLoans || 0, fill: "#ef4444" }
  ];

  const COLORS = ["#f59e0b", "#10b981", "#ef4444"];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Welcome, {user.name}</p>
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
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Total Applications</p>
            <p className="text-3xl font-bold text-white">{stats?.totalApplications || 0}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">{stats?.pendingLoans || 0}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-400">{stats?.approvedLoans || 0}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-400">{stats?.rejectedLoans || 0}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-blue-400">{formatCurrency(stats?.totalAmount || 0)}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Approval Rate</p>
            <p className="text-3xl font-bold text-purple-400">{stats?.approvalRate || 0}%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Loan Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Status Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Pending</span>
                  <span className="text-yellow-400 font-semibold">{stats?.pendingLoans || 0}</span>
                </div>
                <div className="w-full bg-slate-700 rounded h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded"
                    style={{
                      width: `${stats?.totalApplications > 0 ? (stats?.pendingLoans / stats?.totalApplications) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Approved</span>
                  <span className="text-green-400 font-semibold">{stats?.approvedLoans || 0}</span>
                </div>
                <div className="w-full bg-slate-700 rounded h-2">
                  <div
                    className="bg-green-400 h-2 rounded"
                    style={{
                      width: `${stats?.totalApplications > 0 ? (stats?.approvedLoans / stats?.totalApplications) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Rejected</span>
                  <span className="text-red-400 font-semibold">{stats?.rejectedLoans || 0}</span>
                </div>
                <div className="w-full bg-slate-700 rounded h-2">
                  <div
                    className="bg-red-400 h-2 rounded"
                    style={{
                      width: `${stats?.totalApplications > 0 ? (stats?.rejectedLoans / stats?.totalApplications) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Loan Applications</h2>
            <div className="flex gap-2">
              {["All", "Pending", "Approved", "Rejected"].map(status => (
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
          </div>

          {getFilteredLoans().length === 0 ? (
            <div className="text-center text-slate-400 py-8">No loans found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300">Applicant</th>
                    <th className="text-left py-3 px-4 text-slate-300">Amount</th>
                    <th className="text-left py-3 px-4 text-slate-300">Duration</th>
                    <th className="text-left py-3 px-4 text-slate-300">Purpose</th>
                    <th className="text-left py-3 px-4 text-slate-300">Interest</th>
                    <th className="text-left py-3 px-4 text-slate-300">EMI</th>
                    <th className="text-left py-3 px-4 text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-slate-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredLoans().map(loan => (
                    <tr key={loan._id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-white">{loan.user?.name || "N/A"}</td>
                      <td className="py-3 px-4 text-white">{formatCurrency(loan.amount)}</td>
                      <td className="py-3 px-4 text-white">{loan.duration} months</td>
                      <td className="py-3 px-4 text-white">{loan.purpose}</td>
                      <td className="py-3 px-4 text-orange-400">{loan.interestRate}% p.a.</td>
                      <td className="py-3 px-4 text-blue-400">{formatCurrency(loan.emi)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          loan.status === "Approved"
                            ? "bg-green-500/20 text-green-400"
                            : loan.status === "Rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedLoan(loan)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Loan Detail Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">Loan Details</h3>

            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              <div className="bg-slate-900/50 p-3 rounded">
                <p className="text-slate-400 text-sm">Applicant</p>
                <p className="text-white font-semibold">{selectedLoan.user?.name}</p>
              </div>

              <div className="bg-slate-900/50 p-3 rounded">
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white">{selectedLoan.user?.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/50 p-3 rounded">
                  <p className="text-slate-400 text-sm">Amount</p>
                  <p className="text-blue-400 font-semibold">{formatCurrency(selectedLoan.amount)}</p>
                </div>
                <div className="bg-slate-900/50 p-3 rounded">
                  <p className="text-slate-400 text-sm">Duration</p>
                  <p className="text-white font-semibold">{selectedLoan.duration} months</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/50 p-3 rounded">
                  <p className="text-slate-400 text-sm">Purpose</p>
                  <p className="text-white font-semibold">{selectedLoan.purpose}</p>
                </div>
                <div className="bg-slate-900/50 p-3 rounded">
                  <p className="text-slate-400 text-sm">Interest</p>
                  <p className="text-orange-400 font-semibold">{selectedLoan.interestRate}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/50 p-3 rounded">
                  <p className="text-slate-400 text-sm">Monthly EMI</p>
                  <p className="text-blue-400 font-semibold">{formatCurrency(selectedLoan.emi)}</p>
                </div>
                <div className="bg-slate-900/50 p-3 rounded">
                  <p className="text-slate-400 text-sm">Total Payable</p>
                  <p className="text-green-400 font-semibold">{formatCurrency(selectedLoan.emi * selectedLoan.duration)}</p>
                </div>
              </div>

              <div className="bg-slate-900/50 p-3 rounded">
                <p className="text-slate-400 text-sm">Applied on</p>
                <p className="text-white">{new Date(selectedLoan.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
            </div>

            {selectedLoan.status === "Pending" && (
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => handleUpdateStatus(selectedLoan._id, "Approved")}
                  disabled={updatingLoan === selectedLoan._id}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition"
                >
                  {updatingLoan === selectedLoan._id ? "Updating..." : "Approve"}
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedLoan._id, "Rejected")}
                  disabled={updatingLoan === selectedLoan._id}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition"
                >
                  {updatingLoan === selectedLoan._id ? "Updating..." : "Reject"}
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedLoan(null)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}