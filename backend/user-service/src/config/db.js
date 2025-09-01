const { Pool } = require('pg');

const pool = new Pool({
  user: 'wastemanagement',
  host: 'localhost',
  database: 'wastemanagement_db',
  password: 'EcoCircle2024!',
  port: 5432,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = { 
  query: (text, params) => pool.query(text, params),
  pool
};
