const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    next();
  };
};
