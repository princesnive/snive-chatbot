const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD || "",
  port: process.env.PGPORT, 
});

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:",err);
  } else {
    console.log("Connected to PostgreSQL at", result.rows[0].now);
  }
});

module.exports = pool;
