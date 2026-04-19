import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL,
});

async function addColumns() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata JSONB');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS image TEXT');
    console.log('Columns added successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

addColumns();