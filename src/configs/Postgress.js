const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "humanAi",
  password: "1512",
  port: 5432, 
});

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:",err);
  } else {
    console.log("Connected to PostgreSQL at", result.rows[0].now);
  }
});

module.exports = pool;
