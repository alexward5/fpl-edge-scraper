const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.dbhost,
  port: process.env.dbport,
  database: process.env.database,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  max: 20,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
