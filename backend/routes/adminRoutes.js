const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { protect } = require("../middleware/auth");
const bcrypt = require("bcryptjs");

// ✅ Create worker
router.post("/workers", protect, async (req, res) => {
  try {
    if (req.user.role_id !== 1) {
      return res.status(403).json({ msg: "Only admin can create workers" });
    }

    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      "INSERT INTO users (username, password, role_id) VALUES ($1, $2, 4) RETURNING id, username",
      [username, hashedPassword]
    );

    res.json({ msg: "Worker created", worker: result.rows[0] });
  } catch (err) {
    console.error("❌ Error creating worker:", err);
    res.status(500).json({ error: "Failed to create worker" });
  }
});

// ✅ Get workers
router.get("/workers", protect, async (req, res) => {
  try {
    if (req.user.role_id !== 1) {
      return res.status(403).json({ msg: "Only admin can view workers" });
    }

    const result = await db.query(
      "SELECT id, username FROM users WHERE role_id = 4 ORDER BY username ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching workers:", err);
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

// ✅ Get all complaints (for admin dashboard)
router.get("/complaints", protect, async (req, res) => {
  try {
    if (req.user.role_id !== 1) {
      return res.status(403).json({ msg: "Only admin can view complaints" });
    }

    const result = await db.query(`
      SELECT 
        c.id, c.issue, c.designation, c.status, c.created_at,
        s.username AS school_name,
        w.username AS worker_name, c.worker_id
      FROM complaints c
      JOIN users s ON c.user_id = s.id
      LEFT JOIN users w ON c.worker_id = w.id
      ORDER BY c.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching complaints:", err);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

// ✅ Assign worker to complaint
router.put("/complaints/:id/assign", protect, async (req, res) => {
  try {
    if (req.user.role_id !== 1) {
      return res.status(403).json({ msg: "Only admin can assign complaints" });
    }

    const { worker_id } = req.body;
    const { id } = req.params;

    await db.query(
      "UPDATE complaints SET worker_id = $1, status = 'assigned' WHERE id = $2",
      [worker_id, id]
    );

    const result = await db.query("SELECT * FROM complaints WHERE id = $1", [id]);
    const updatedComplaint = result.rows[0];

    // 🔑 broadcast update
    req.io.emit("complaintAssigned", updatedComplaint);

    res.json(updatedComplaint);
  } catch (err) {
    console.error("❌ Error assigning worker:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/analytics", protect, async (req, res) => {
  try {
    const bySchool = await db.query(`
      SELECT s.username AS school_name, COUNT(*) 
      FROM complaints c
      JOIN users s ON c.user_id = s.id
      GROUP BY s.username
    `);

    const byWorker = await db.query(`
      SELECT w.username AS worker_name, COUNT(*) 
      FROM complaints c
      JOIN users w ON c.worker_id = w.id
      WHERE c.status = 'finished'
      GROUP BY w.username
    `);

    res.json({ bySchool: bySchool.rows, byWorker: byWorker.rows });
  } catch (err) {
    console.error("❌ Analytics error:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
