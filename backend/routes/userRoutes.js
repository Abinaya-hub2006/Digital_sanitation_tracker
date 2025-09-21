const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Get all workers
router.get("/workers", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM users WHERE role = 'worker'");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
