const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
    pool.on('error', (err) => console.error('[db] pool error', err.message));
  }
  return pool;
}

async function query(sql, params) {
  const p = getPool();
  if (!p) return { rows: [], rowCount: 0 };
  return p.query(sql, params);
}

module.exports = { query, getPool, isEnabled: () => !!process.env.DATABASE_URL };
