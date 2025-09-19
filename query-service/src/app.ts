import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.get("/races/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM races WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Race not found" });
  }

  res.json(result.rows[0]);
});

app.get("/races", async (_req, res) => {
  const result = await pool.query("SELECT * FROM races");
  res.json(result.rows);
});

export default app;
