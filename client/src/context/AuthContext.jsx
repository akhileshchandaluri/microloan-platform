import { createContext, useContext, useState, useEffect } from "react";
import { getUsersFromStorage } from "../services/localApi";

/**
 * AuthContext provides:
 *  - user: null | {email, role, name, phone, pan}
 *  - login(email,password) -> { success, message }
 *  - signup(name,email,password,phone,pan) -> { success, message }
 *  - logout()
 *
 * NOTE: admin credentials are hard-coded for demo:
 *  email: admin@microloan.com
 *  password: admin123
 */

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // init from storage
  useEffect(() => {
    const s = sessionStorage.getItem("microloan_user");
    if (s) setUser(JSON.parse(s));
  }, []);

  const persistUser = (u) => {
    if (u) sessionStorage.setItem("microloan_user", JSON.stringify(u));
    else sessionStorage.removeItem("microloan_user");
  };

  const login = (email, password) => {
    // admin special case
    if (email === "admin@microloan.com" && password === "admin123") {
      const admin = { email, role: "admin", name: "Admin" };
      setUser(admin);
      persistUser(admin);
      return { success: true };
    }

    // check stored users
    const users = getUsersFromStorage();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      const logged = { email: found.email, name: found.name, phone: found.phone, pan: found.pan, role: "user" };
      setUser(logged);
      persistUser(logged);
      return { success: true };
    }

    return { success: false, message: "Invalid credentials" };
  };

  const signup = (name, email, password, phone, pan) => {
    // basic checks
    if (!name || !email || !password || !phone) return { success: false, message: "All fields required" };

    const users = getUsersFromStorage();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email already registered" };
    }

    const newUser = { name, email, password, phone, pan: pan || "" };
    users.push(newUser);
    localStorage.setItem("microloan_users", JSON.stringify(users));

    const logged = { email, name, phone, pan: pan || "", role: "user" };
    setUser(logged);
    persistUser(logged);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    persistUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook
export function useAuth() {
  return useContext(AuthContext);
}
