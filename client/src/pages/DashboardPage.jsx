import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getLoansByEmail } from "../services/localApi";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Footer from "../components/Footer.jsx";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    if (user?.email) {
      const list = getLoansByEmail(user.email);
      setLoans(list);
    }
  }, [user]);

  const pending = loans.filter(l => l.status === "Pending").length;
  const approved = loans.filter(l => l.status === "Approved").length;
  const rejected = loans.filter(l => l.status === "Rejected").length;
  const totalAmount = loans.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);

  const getStatusIcon = (status) => {
    switch(status) {
      case "Approved":
        return <CheckCircle className="w-5 h-5 text-accent-emerald" />;
      case "Rejected":
        return <XCircle className="w-5 h-5 text-accent-red" />;
      default:
        return <AlertCircle className="w-5 h-5 text-accent-amber" />;
    }
  };

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
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400">Manage and track your loan applications</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-brand-500/20 rounded-lg p-6 hover:border-brand-500/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-white">{loans.length}</p>
              </div>
              <DollarSign className="w-10 h-10 text-brand-500/50" />
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
              <CheckCircle className="w-10 h-10 text-accent-emerald/50" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-accent-red/20 rounded-lg p-6 hover:border-accent-red/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Borrowed</p>
                <p className="text-3xl font-bold text-white">₹{totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <Clock className="w-10 h-10 text-accent-red/50" />
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur border border-brand-500/20 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-brand p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Loan Applications</h2>
              <p className="text-blue-100 text-sm">Track and manage all your loan requests</p>
            </div>
            <Link 
              to="/apply"
              className="px-6 py-2 bg-white hover:bg-blue-50 text-brand-700 font-semibold rounded-lg transition"
            >
              + New Application
            </Link>
          </div>

          {/* Content */}
          <div className="p-6">
            {loans.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-4">No applications yet</p>
                <Link 
                  to="/apply"
                  className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition"
                >
                  Apply for a Loan Now
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-700">
                      <th className="py-4 px-4 font-semibold">ID</th>
                      <th className="py-4 px-4 font-semibold">Amount</th>
                      <th className="py-4 px-4 font-semibold">Duration</th>
                      <th className="py-4 px-4 font-semibold">EMI</th>
                      <th className="py-4 px-4 font-semibold">Status</th>
                      <th className="py-4 px-4 font-semibold">Applied On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((l, idx) => (
                      <motion.tr 
                        key={l.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-slate-700 hover:bg-slate-700/50 transition"
                      >
                        <td className="py-4 px-4">
                          <span className="text-slate-300 font-mono text-sm">{l.id.toString().slice(0, 8)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white font-semibold">₹{Number(l.amount).toLocaleString('en-IN')}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-300">{l.duration} months</td>
                        <td className="py-4 px-4 text-slate-300">₹{(l.emi || 0).toLocaleString('en-IN')}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(l.status)}`}>
                            {getStatusIcon(l.status)}
                            {l.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-sm">
                          {new Date(l.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          <Link 
            to="/apply"
            className="bg-slate-800/50 backdrop-blur border border-brand-500/20 rounded-lg p-6 hover:border-brand-500/50 transition text-center"
          >
            <p className="text-brand-400 font-semibold mb-2">Apply for Loan</p>
            <p className="text-slate-400 text-sm">Submit a new loan application instantly</p>
          </Link>
          <Link 
            to="/emi-calculator"
            className="bg-slate-800/50 backdrop-blur border border-brand-500/20 rounded-lg p-6 hover:border-brand-500/50 transition text-center"
          >
            <p className="text-brand-400 font-semibold mb-2">EMI Calculator</p>
            <p className="text-slate-400 text-sm">Calculate monthly EMI for any amount</p>
          </Link>
          <div className="bg-slate-800/50 backdrop-blur border border-brand-500/20 rounded-lg p-6 text-center">
            <p className="text-brand-400 font-semibold mb-2">Contact Support</p>
            <p className="text-slate-400 text-sm">📞 Call us at +91-XXXX-XXXX-XX</p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
