import { pool } from "./db.js";

export const initDb = async () => {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    role VARCHAR(50) NOT NULL
  );
`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS races (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      distance VARCHAR(50) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id UUID PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      club VARCHAR(255),
      race_id UUID NOT NULL,
      user_id TEXT NOT NULL
    );
  `);

  console.log("Races table is ready");
};
