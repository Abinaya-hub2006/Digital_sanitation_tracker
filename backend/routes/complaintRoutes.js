const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { protect } = require("../middleware/auth");

// ✅ Submit complaint (School only)
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role_id !== 2) {
      return res.status(403).json({ msg: "Only schools can submit complaints" });
    }

    const { school_name, designation, issue } = req.body;
    const result = await db.query(
      `INSERT INTO complaints (school_name, designation, issue, user_id, status, created_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW()) RETURNING *`,
      [school_name, designation, issue, req.user.id]
    );

    res.json({ msg: "Complaint submitted", complaint: result.rows[0] });
  } catch (err) {
    console.error("❌ Submit complaint error:", err);
    res.status(500).json({ msg: "Failed to submit complaint" });
  }
});

// ✅ Get complaints submitted by the logged-in school
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role_id !== 2) {
      return res.status(403).json({ msg: "Only schools can view their complaints" });
    }

    const result = await db.query(
      "SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch complaints error:", err);
    res.status(500).json({ msg: "Failed to fetch complaints" });
  }
});

module.exports = router;
