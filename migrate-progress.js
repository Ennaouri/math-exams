const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const conn = process.env.POSTGRES_URL_NO_SSL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

const pool = new Pool({ connectionString: conn, max: 1, ssl: false });

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id            SERIAL PRIMARY KEY,
        user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
        post_id       INTEGER REFERENCES "Post"(id) ON DELETE CASCADE,
        post_slug     VARCHAR(255) NOT NULL,
        post_name     VARCHAR(500),
        category_name VARCHAR(255),
        category_slug VARCHAR(255),
        viewed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, post_id)
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_progress_viewed_at ON user_progress(viewed_at DESC)');
    console.log('Migration reussie : table user_progress creee');
  } catch(e) {
    console.error('Erreur migration:', e.message);
  } finally {
    await pool.end();
  }
}
run();
