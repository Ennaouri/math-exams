require('dotenv').config();
const pg = require('pg');
const crypto = require('crypto');
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
});

async function fixAdmin() {
  try {
    const hash = crypto.createHash('sha256').update('admin').digest('hex');
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hash, 'admin@example.com']);
    console.log('Password updated!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixAdmin();