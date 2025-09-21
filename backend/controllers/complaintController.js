const pool = require("../config/db");

// ✅ School: Create new complaint
exports.createComplaint = async (req, res) => {
  try {
    const { designation, school_name, issue, image_url, user_id } = req.body;

    if (!designation || !school_name || !issue || !user_id) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const result = await pool.query(
      `INSERT INTO complaints (designation, school_name, issue, image_url, user_id, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'Pending', NOW(), NOW())
       RETURNING *`,
      [designation, school_name, issue, image_url, user_id]
    );

    const complaint = result.rows[0];

    // Notify admins in real time (if using socket.io)
    if (req.io) req.io.emit("newComplaint", complaint);

    res.status(201).json(complaint);
  } catch (err) {
    console.error("❌ Error creating complaint:", err.message);
    res.status(500).json({ message: "Error creating complaint" });
  }
};

// ✅ Admin: Assign complaint to worker
exports.assignComplaint = async (req, res) => {
  try {
    const { complaint_id, worker_id } = req.body;

    if (!complaint_id || !worker_id) {
      return res.status(400).json({ message: "Complaint ID and Worker ID required" });
    }

    const result = await pool.query(
      `UPDATE complaints
       SET worker_id = $1, status = 'Assigned', updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [worker_id, complaint_id]
    );

    const updatedComplaint = result.rows[0];
    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Notify school & worker in real time
    if (req.io) req.io.emit("complaintAssigned", updatedComplaint);

    res.json(updatedComplaint);
  } catch (err) {
    console.error("❌ Error assigning complaint:", err.message);
    res.status(500).json({ message: "Error assigning complaint" });
  }
};

// ✅ Worker: Update complaint status
exports.updateStatus = async (req, res) => {
  try {
    const { complaint_id, status } = req.body;

    if (!complaint_id || !status) {
      return res.status(400).json({ message: "Complaint ID and Status required" });
    }

    const result = await pool.query(
      `UPDATE complaints
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, complaint_id]
    );

    const updatedComplaint = result.rows[0];
    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Notify school & admin in real time
    if (req.io) req.io.emit("statusUpdated", updatedComplaint);

    res.json(updatedComplaint);
  } catch (err) {
    console.error("❌ Error updating status:", err.message);
    res.status(500).json({ message: "Error updating complaint status" });
  }
};

// ✅ School: Get all complaints by user
exports.getComplaintsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `SELECT c.*, 
              u.name AS reported_by, 
              w.name AS assigned_worker
       FROM complaints c
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN users w ON c.worker_id = w.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching complaints:", err.message);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// ✅ Admin: Assign worker (alias for assignComplaint)
exports.assignWorker = async (req, res) => {
  try {
    const { complaint_id, worker_id } = req.body;

    if (!complaint_id || !worker_id) {
      return res.status(400).json({ message: "Complaint ID and Worker ID required" });
    }

    const result = await pool.query(
      `UPDATE complaints 
       SET worker_id = $1, status = 'Assigned', updated_at = NOW() 
       WHERE id = $2
       RETURNING *`,
      [worker_id, complaint_id]
    );

    const updatedComplaint = result.rows[0];
    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.io) req.io.emit("complaintAssigned", updatedComplaint);

    res.json({ message: "Worker assigned successfully", complaint: updatedComplaint });
  } catch (err) {
    console.error("❌ Error assigning worker:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
