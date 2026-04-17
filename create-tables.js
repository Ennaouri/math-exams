require('dotenv').config();
const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
});

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created');

    await pool.query(`
      INSERT INTO users (email, password, name, role)
      VALUES ('admin@example.com', '21232f297a57a5a743894a0e4a801fc3', 'Admin', 'admin')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('Admin user created (email: admin@example.com, password: admin)');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createTables();