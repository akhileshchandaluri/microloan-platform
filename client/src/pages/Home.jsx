import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, TrendingUp, Shield, Users, Zap } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Fast & Secure <span className="text-blue-400">Microloans</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          Get instant loans up to ₹5 lakhs with minimal documentation. Apply, approve, and receive funds in 24 hours.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold border border-slate-600 transition"
          >
            Sign In
          </button>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section variants={itemVariants} className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose MicroLoan?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Instant Approval",
              desc: "Get approved in minutes with our AI-powered verification"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "100% Secure",
              desc: "Your data is encrypted and secured with bank-grade security"
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "Flexible Terms",
              desc: "Choose loan amount and duration that suits your needs"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Expert Support",
              desc: "24/7 customer support team ready to help you"
            },
            {
              icon: <CheckCircle className="w-8 h-8" />,
              title: "Low Interest",
              desc: "Competitive interest rates starting from 9% p.a."
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "Quick Disbursal",
              desc: "Funds transferred within 24 hours of approval"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-slate-800 border border-slate-700 p-6 rounded-lg hover:border-blue-500 transition"
            >
              <div className="text-blue-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How it Works */}
      <motion.section variants={itemVariants} className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { num: "01", title: "Sign Up", desc: "Create account in 2 minutes" },
            { num: "02", title: "Apply", desc: "Fill loan details and submit" },
            { num: "03", title: "Verify", desc: "We verify your documents" },
            { num: "04", title: "Get Funds", desc: "Receive money in your account" }
          ].map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section variants={itemVariants} className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Your Loan?</h2>
          <p className="text-lg text-blue-100 mb-6">Join thousands of satisfied customers today</p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white hover:bg-slate-100 text-blue-600 px-8 py-3 rounded-lg font-semibold transition"
          >
            Apply Now
          </button>
        </div>
      </motion.section>

      {/* Empty space for footer */}
      <div className="py-8"></div>
    </motion.div>
  );
}