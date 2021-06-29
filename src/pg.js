const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.dbhost,
  port: process.env.dbport,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  max: 20,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 2000,
});

pool.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected to database");
  }
});

module.exports = pool;
