import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL_NON_POOLING });

async function createPostDetails() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "PostDetails" (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      thumbnail TEXT,
      description TEXT,
      slug VARCHAR(255) UNIQUE NOT NULL,
      post_id INTEGER REFERENCES "Post"(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('PostDetails table created');
  pool.end();
}

createPostDetails();