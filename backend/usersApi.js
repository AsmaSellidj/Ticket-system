const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// ✅ MIDDLEWARE (ORDER MATTERS)
app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "ticketing",
  password: "postgres",
  port: 5432,
});

// REGISTER
app.post("/register", async (req, res) => {
  const { full_name, email, password, role, societyId } = req.body;

  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (full_name, email, password_hash, role, society_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, role
      `,
      [full_name, email, hash, role, societyId || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "User already exists or invalid data" });
  }
});

app.listen(5001, () => {
  console.log("Users API running on port 5001");
});
