const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Create a database connection pool
 * @param {string} database - Database name
 * @returns {Pool} PostgreSQL connection pool
 */
const createPool = (database) => {
  const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST || 'localhost',
    database: database,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  return pool;
};

/**
 * Execute a query with error handling
 * @param {Pool} pool - Database pool
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (pool, text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

module.exports = {
  createPool,
  query
};
