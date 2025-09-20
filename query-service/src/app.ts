import express from "express";
import { pool } from "./db.js";
import { auth, Authed } from "./auth.js";

const app = express();
app.use(express.json());
app.use(auth);

//races endpoints
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

//application endpoints
app.get("/applications", async (req: Authed, res) => {
  if (req.user?.role === "Administrator") {
    const result = await pool.query("SELECT * FROM applications");
    return res.json(result.rows);
  }

  if (req.user?.role === "Applicant") {
    const result = await pool.query(
      "SELECT * FROM applications WHERE user_id = $1",
      [req.user.sub]
    );
    return res.json(result.rows);
  }

  res.status(403).json({ error: "Forbidden" });
});

app.get("/applications/:id", async (req: Authed, res) => {
  const { id } = req.params;

  if (req.user?.role === "Administrator") {
    const result = await pool.query(
      "SELECT * FROM applications WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res.json(result.rows[0]);
  }

  if (req.user?.role === "Applicant") {
    const result = await pool.query(
      "SELECT * FROM applications WHERE id = $1 AND user_id = $2",
      [id, req.user.sub]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res.json(result.rows[0]);
  }

  res.status(403).json({ error: "Forbidden" });
});

export default app;
