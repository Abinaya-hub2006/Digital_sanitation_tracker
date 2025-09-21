const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body; // role = "admin" | "school" | "worker"

    if (!username || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // find role_id
    const roleResult = await pool.query("SELECT id FROM roles WHERE name=$1", [role]);
    if (roleResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const role_id = roleResult.rows[0].id;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3) RETURNING id, username, role_id",
      [username, hashedPassword, role_id]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const result = await pool.query(
      "SELECT u.id, u.username, u.password, u.role_id, r.name AS role FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.username=$1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role_id: user.role_id,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};
