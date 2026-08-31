const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const conn = process.env.POSTGRES_URL_NO_SSL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
const pool = new Pool({ connectionString: conn, max: 1, ssl: false });

async function run() {
  try {
    // Ensure live_session exists first (may not be in local dev DB)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS live_session (
        id              SERIAL PRIMARY KEY,
        formation_id    INTEGER,
        title           VARCHAR(255) NOT NULL,
        description     TEXT,
        niveau          VARCHAR(100) NOT NULL,
        niveau_label    VARCHAR(255) NOT NULL,
        instructor_name VARCHAR(255) DEFAULT 'Professeur Maths-Exams',
        scheduled_at    TIMESTAMP NOT NULL,
        duration_minutes INTEGER DEFAULT 90,
        meeting_url     VARCHAR(500),
        replay_url      VARCHAR(500),
        status          VARCHAR(50) DEFAULT 'upcoming',
        resources_count INTEGER DEFAULT 0,
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS live_notification (
        id          SERIAL PRIMARY KEY,
        live_id     INTEGER REFERENCES live_session(id) ON DELETE CASCADE,
        user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
        email       VARCHAR(255) NOT NULL,
        user_name   VARCHAR(255),
        notified    BOOLEAN DEFAULT false,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(live_id, user_id)
      )
    `);
    await pool.query('CREATE INDEX IF NOT EXISTS idx_live_notif_live_id ON live_notification(live_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_live_notif_notified ON live_notification(notified)');
    console.log('Migration reussie : tables live_session et live_notification creees');
  } catch (e) {
    console.error('Erreur migration:', e.message);
  } finally {
    await pool.end();
  }
}
run();
