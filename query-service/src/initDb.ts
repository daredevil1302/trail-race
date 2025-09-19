import { pool } from "./db.js";

export const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS races (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      distance VARCHAR(50) NOT NULL
    );
  `);

  console.log("Races table is ready");
};
