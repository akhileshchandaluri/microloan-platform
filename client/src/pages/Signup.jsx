import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Check, X } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Enhanced password validation rules
  const validatePassword = (password) => {
    const rules = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]{}]/.test(password),
    };
    return rules;
  };

  const getPasswordStrength = (password) => {
    const rules = validatePassword(password);
    const passedRules = Object.values(rules).filter(Boolean).length;
    if (passedRules <= 2) return { strength: "Weak", color: "text-red-500", bgColor: "bg-red-500" };
    if (passedRules <= 3) return { strength: "Fair", color: "text-yellow-500", bgColor: "bg-yellow-500" };
    if (passedRules <= 4) return { strength: "Good", color: "text-blue-500", bgColor: "bg-blue-500" };
    return { strength: "Strong", color: "text-green-500", bgColor: "bg-green-500" };
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    const passwordRules = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRules.minLength) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!passwordRules.hasUpperCase) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!passwordRules.hasLowerCase) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!passwordRules.hasNumber) {
      newErrors.password = "Password must contain at least one number";
    } else if (!passwordRules.hasSpecialChar) {
      newErrors.password = "Password must contain at least one special character (!@#$%^&*)";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post("/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        pan: null
      });

      if (res.data.success) {
        toast.success("Signup successful! Please log in.");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setFormData({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
        // Redirect to dashboard
        setTimeout(() => window.location.href = "/dashboard", 1000);
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  const passwordRules = validatePassword(formData.password);
  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold mb-2 text-white">Create Account</h2>
        <p className="text-slate-400 mb-6">Join us and apply for loans today</p>

        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full p-2 border rounded bg-slate-900/30 text-white placeholder-slate-500 ${
                errors.name ? "border-red-500" : "border-slate-600"
              }`}
              placeholder="John Doe"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-2 border rounded bg-slate-900/30 text-white placeholder-slate-500 ${
                errors.email ? "border-red-500" : "border-slate-600"
              }`}
              placeholder="you@example.com"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full p-2 border rounded bg-slate-900/30 text-white placeholder-slate-500 ${
                errors.phone ? "border-red-500" : "border-slate-600"
              }`}
              placeholder="10-digit phone number"
              pattern="[0-9]{10}"
              required
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full p-2 border rounded bg-slate-900/30 text-white placeholder-slate-500 pr-10 ${
                  errors.password ? "border-red-500" : "border-slate-600"
                }`}
                placeholder="Enter strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2.5 text-slate-400 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Password Strength:</span>
                  <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded h-2">
                  <div
                    className={`h-2 rounded ${passwordStrength.bgColor} transition-all`}
                    style={{
                      width: `${(Object.values(passwordRules).filter(Boolean).length / 5) * 100}%`,
                    }}
                  />
                </div>

                {/* Password Rules Checklist */}
                <div className="bg-slate-900/50 p-3 rounded text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    {passwordRules.minLength ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <X size={14} className="text-red-500" />
                    )}
                    <span className={passwordRules.minLength ? "text-green-500" : "text-slate-400"}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRules.hasUpperCase ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <X size={14} className="text-red-500" />
                    )}
                    <span className={passwordRules.hasUpperCase ? "text-green-500" : "text-slate-400"}>
                      One uppercase letter (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRules.hasLowerCase ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <X size={14} className="text-red-500" />
                    )}
                    <span className={passwordRules.hasLowerCase ? "text-green-500" : "text-slate-400"}>
                      One lowercase letter (a-z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRules.hasNumber ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <X size={14} className="text-red-500" />
                    )}
                    <span className={passwordRules.hasNumber ? "text-green-500" : "text-slate-400"}>
                      One number (0-9)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRules.hasSpecialChar ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <X size={14} className="text-red-500" />
                    )}
                    <span className={passwordRules.hasSpecialChar ? "text-green-500" : "text-slate-400"}>
                      One special character (!@#$%^&*)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full p-2 border rounded bg-slate-900/30 text-white placeholder-slate-500 pr-10 ${
                  errors.confirmPassword ? "border-red-500" : "border-slate-600"
                }`}
                placeholder="Re-enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2.5 text-slate-400 hover:text-white"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            Sign Up
          </button>

          <p className="text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:text-blue-300">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}