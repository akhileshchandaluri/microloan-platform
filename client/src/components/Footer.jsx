import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4">MicroLoan</h3>
            <p className="text-slate-400 text-sm mb-4">
              Fast, secure, and transparent microloan solutions for everyone.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              <span>India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition">
                  User Login
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-blue-400 transition">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-400 transition">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#faq" className="hover:text-blue-400 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-400 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-blue-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-blue-400 transition">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-slate-400 text-sm">
              <div className="flex items-center gap-2 hover:text-blue-400 transition cursor-pointer">
                <Mail className="w-4 h-4" />
                <span>info@microloan.com</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-400 transition cursor-pointer">
                <Phone className="w-4 h-4" />
                <span>+91 1800-LOAN-NOW</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright */}
          <div className="text-slate-400 text-sm text-center md:text-left">
            <p>
              © {currentYear} Microloan Management Platform — Developed by <span className="text-blue-400 font-semibold">Akhilesh & Team</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">All rights reserved | Made with ❤️ in India</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition"
              title="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition"
              title="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Top Scroll Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition opacity-0 hover:opacity-100 scroll-to-top-btn"
        title="Back to top"
      >
        ↑
      </button>

      {/* Scroll Show/Hide Script */}
      <style>{`
        .scroll-to-top-btn {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        body:not(:has(.scroll-to-top-btn:hover)) .scroll-to-top-btn {
          opacity: 0;
        }
      `}</style>
    </footer>
  );
}