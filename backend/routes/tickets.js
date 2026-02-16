const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  host: "db",          // or localhost
  user: "postgres",
  password: "postgres",
  database: "ticketing",
  port: 5432,
});

/* ================================
   GET ticket details by ID
   ================================ */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.created_at,
        u.full_name AS created_by
      FROM tickets t
      JOIN users u ON t.created_by = u.id
      WHERE t.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================================
   GET comments for a ticket
   ================================ */
router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.full_name AS author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.ticket_id = $1
      ORDER BY c.created_at ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================================
   POST add a comment
   ================================ */
router.post("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { user_id, userId, content, text } = req.body;

  const uid = user_id || userId;
  const comment = content || text;

  if (!uid) {
    return res.status(400).json({ message: "User id required" });
  }

  if (!comment) {
    return res.status(400).json({ message: "Comment content required" });
  }

  try {
    // Fetch user role to enforce that ADMIN cannot add comments
    const userRes = await pool.query(`SELECT role FROM users WHERE id = $1`, [uid]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const role = (userRes.rows[0].role || "").toUpperCase().trim();
    if (role === "ADMIN") {
      return res.status(403).json({ message: "Admins are not allowed to add comments" });
    }

    await pool.query(
      `
      INSERT INTO comments (ticket_id, user_id, content)
      VALUES ($1, $2, $3)
      `,
      [id, uid, comment]
    );

    res.status(201).json({ message: "Comment added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
