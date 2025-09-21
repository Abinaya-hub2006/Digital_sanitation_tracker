const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { protect } = require("../middleware/auth");

// ✅ Get complaints assigned to this worker
router.get("/complaints", protect, async (req, res) => {
  try {
    if (req.user.role_id !== 4) {
      return res.status(403).json({ msg: "Only workers can view assigned complaints" });
    }

    const workerId = req.user.id;

    const result = await db.query(
      `SELECT id, issue, status, created_at, school_name
       FROM complaints
       WHERE worker_id = $1
       ORDER BY created_at DESC`,
      [workerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching complaints:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Worker updates complaint status (e.g., mark as finished)
router.put("/complaints/:id/status", protect, async (req, res) => {
  try {
    if (req.user.role_id !== 4) {
      return res.status(403).json({ msg: "Only workers can update complaint status" });
    }

    const { status } = req.body; // "finished"
    const { id } = req.params;

    const result = await db.query(
      "UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    const updatedComplaint = result.rows[0];

    // 🔑 notify dashboards
    req.io.emit("statusUpdated", updatedComplaint);

    res.json(updatedComplaint);
  } catch (err) {
    console.error("❌ Error updating complaint status:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
