import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, Shield, Zap, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <motion.section 
        className="pt-20 pb-24 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-brand bg-clip-text text-transparent mb-6 leading-tight">
              Microloans Made Simple
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Get instant loans up to ₹5 lakhs with zero paperwork. Transparent interest rates, fast approval.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            {user ? (
              <>
                <Link 
                  to="/apply"
                  className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition duration-300 text-center"
                >
                  Apply for Loan
                </Link>
                <Link 
                  to="/dashboard"
                  className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition duration-300 text-center"
                >
                  My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/signup"
                  className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition duration-300 text-center"
                >
                  Get Started
                </Link>
                <Link 
                  to="/login"
                  className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition duration-300 text-center"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6 text-center"
          >
            <div className="p-6">
              <div className="text-3xl font-bold text-brand-400 mb-2">50K+</div>
              <div className="text-slate-400">Happy Users</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-brand-400 mb-2">₹500Cr+</div>
              <div className="text-slate-400">Disbursed</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-brand-400 mb-2">2 mins</div>
              <div className="text-slate-400">Loan Approval</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50 backdrop-blur"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-16 text-white">
            Why Choose Us?
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Instant Approval", desc: "Get approved in 2 minutes" },
              { icon: TrendingUp, title: "Transparent Rates", desc: "No hidden charges, ever" },
              { icon: Shield, title: "Secure & Safe", desc: "Bank-level encryption" },
              { icon: Users, title: "24/7 Support", desc: "Always here to help" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="p-6 rounded-lg bg-gradient-subtle border border-brand-500/20 hover:border-brand-500/50 transition"
              >
                <feature.icon className="w-10 h-10 text-brand-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-16 text-white">
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-6">
            {["Sign Up", "Apply", "Get Approved", "Receive Funds"].map((step, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {i + 1}
                </div>
                <p className="text-white font-semibold">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Trust Section */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50 backdrop-blur text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-4">Trusted by major banks & institutions</h3>
          <div className="flex justify-center gap-8 flex-wrap text-slate-400 text-sm">
            <span>✓ RBI Compliant</span>
            <span>✓ ISO Certified</span>
            <span>✓ Data Encrypted</span>
            <span>✓ Zero Fraud</span>
          </div>
        </motion.div>
      </motion.section>

      <Footer />
    </div>
  );
}
