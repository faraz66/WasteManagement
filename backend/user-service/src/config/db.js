const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = { 
  query: (text, params) => pool.query(text, params),
  pool
};
