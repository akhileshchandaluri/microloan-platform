// server/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
