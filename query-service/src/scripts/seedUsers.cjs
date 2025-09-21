const { Pool } = require("pg");
const { randomUUID } = require("crypto");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "trail_race_app",
});

(async () => {
  await pool.query(
    "INSERT INTO users (id, first_name, last_name, email, dob, role) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING",
    [
      randomUUID(),
      "Alice",
      "Admin",
      "alice@example.com",
      "1980-01-01",
      "Administrator",
    ]
  );

  await pool.query(
    "INSERT INTO users (id, first_name, last_name, email, dob, role) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING",
    [
      randomUUID(),
      "Bob",
      "Runner",
      "bob@example.com",
      "1990-01-01",
      "Applicant",
    ]
  );

  console.log("Seeded users");
  await pool.end();
})();
