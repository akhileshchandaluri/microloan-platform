import { useEffect, useState } from "react";
import { getAllLoans, updateLoanStatus } from "../services/localApi";
import { motion } from "framer-motion";
import { TrendingUp, Zap, AlertCircle, CheckCircle2, XCircle, Copy } from "lucide-react";
import Footer from "../components/Footer.jsx";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [loans, setLoans] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => setLoans(getAllLoans());

  const doApprove = (id) => {
    updateLoanStatus(id, "Approved");
    refresh();
    toast.success("Loan approved!");
  };

  const doReject = (id) => {
    updateLoanStatus(id, "Rejected");
    refresh();
    toast.error("Loan rejected");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("ID copied!");
  };

  // Analytics
  const total = loans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const pending = loans.filter(l => l.status === "Pending").length;
  const approved = loans.filter(l => l.status === "Approved").length;
  const rejected = loans.filter(l => l.status === "Rejected").length;
  const avgAmount = loans.length > 0 ? Math.round(total / loans.length) : 0;

  // Filter loans
  const filteredLoans = filter === "All" 
    ? loans 
    : loans.filter(l => l.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case "Approved":
        return "bg-accent-emerald/20 border-accent-emerald/50 text-accent-emerald";
      case "Rejected":
        return "bg-accent-red/20 border-accent-red/50 text-accent-red";
      default:
        return "bg-accent-amber/20 border-accent-amber/50 text-accent-amber";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Approved":
        return <CheckCircle2 className="w-5 h-5" />;
      case "Rejected":
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage loan applications and review requests</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-5 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-brand-500/20 rounded-lg p-6 hover:border-brand-500/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-white">{loans.length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-brand-500/50" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-accent-amber/20 rounded-lg p-6 hover:border-accent-amber/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold text-accent-amber">{pending}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-accent-amber/50" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-accent-emerald/20 rounded-lg p-6 hover:border-accent-emerald/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Approved</p>
                <p className="text-3xl font-bold text-accent-emerald">{approved}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-accent-emerald/50" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-accent-red/20 rounded-lg p-6 hover:border-accent-red/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Rejected</p>
                <p className="text-3xl font-bold text-accent-red">{rejected}</p>
              </div>
              <XCircle className="w-10 h-10 text-accent-red/50" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-brand-500/20 rounded-lg p-6 hover:border-brand-500/50 transition">
            <div>
              <p className="text-slate-400 text-sm mb-2">Total Disbursed</p>
              <p className="text-2xl font-bold text-white mb-2">₹{(total / 100000).toFixed(1)}L</p>
              <p className="text-xs text-slate-500">Avg: ₹{avgAmount.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur border border-brand-500/20 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header with Filters */}
          <div className="bg-gradient-brand p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-white">Loan Requests</h2>
                <p className="text-blue-100 text-sm">Approve or reject applications</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["All", "Pending", "Approved", "Rejected"].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      filter === status
                        ? "bg-white text-brand-700"
                        : "bg-blue-900/50 text-white hover:bg-blue-800/50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {filteredLoans.length === 0 ? (
              <div className="text-center py-12 px-6">
                <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No {filter === "All" ? "applications" : filter.toLowerCase() + " applications"} found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700 bg-slate-700/50">
                    <th className="py-4 px-6 font-semibold">Applicant</th>
                    <th className="py-4 px-6 font-semibold">Amount</th>
                    <th className="py-4 px-6 font-semibold">Duration</th>
                    <th className="py-4 px-6 font-semibold">EMI</th>
                    <th className="py-4 px-6 font-semibold">Purpose</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold">Applied</th>
                    <th className="py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.map((l, idx) => (
                    <motion.tr 
                      key={l.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-slate-700 hover:bg-slate-700/30 transition"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white font-semibold">{l.name}</p>
                          <p className="text-slate-400 text-sm">{l.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-semibold">₹{Number(l.amount).toLocaleString('en-IN')}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-300">{l.duration} mo</td>
                      <td className="py-4 px-6 text-slate-300">₹{(l.emi || 0).toLocaleString('en-IN')}</td>
                      <td className="py-4 px-6 text-slate-300 text-sm">{l.purpose || "—"}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(l.status)}`}>
                          {getStatusIcon(l.status)}
                          {l.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-sm">
                        {new Date(l.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2 flex-wrap">
                          {l.status === "Pending" && (
                            <>
                              <button 
                                onClick={() => doApprove(l.id)}
                                className="px-3 py-1 bg-accent-emerald hover:bg-accent-emerald/80 text-white rounded font-semibold text-sm transition"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => doReject(l.id)}
                                className="px-3 py-1 bg-accent-red hover:bg-accent-red/80 text-white rounded font-semibold text-sm transition"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => copyToClipboard(l.id)}
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm transition flex items-center gap-1"
                            title="Copy ID"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
