const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ✅ Common middleware to check token
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role_id }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Admin-only middleware
const authenticateAdmin = (req, res, next) => {
  if (!req.user || req.user.role_id !== 1) {
    return res.status(403).json({ message: "Admin access denied" });
  }
  next();
};

// ✅ Worker-only middleware
const authenticateWorker = (req, res, next) => {
  if (!req.user || req.user.role_id !== 4) {
    return res.status(403).json({ message: "Worker access denied" });
  }
  next();
};

// ✅ School-only middleware
const authenticateSchool = (req, res, next) => {
  if (!req.user || req.user.role_id !== 2) {
    return res.status(403).json({ message: "School access denied" });
  }
  next();
};

module.exports = {
  protect,
  authenticateAdmin,
  authenticateWorker,
  authenticateSchool,
};
