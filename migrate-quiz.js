const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const conn = process.env.POSTGRES_URL_NO_SSL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
const pool = new Pool({ connectionString: conn, max: 1, ssl: false });

async function run() {
  try {
    // Quiz metadata (one quiz per post)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz (
        id          SERIAL PRIMARY KEY,
        post_id     INTEGER REFERENCES "Post"(id) ON DELETE CASCADE,
        title       VARCHAR(500) NOT NULL DEFAULT 'QCM de vérification',
        description TEXT,
        time_limit  INTEGER DEFAULT 0,  -- seconds, 0 = no limit
        is_active   BOOLEAN DEFAULT true,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id)
      )
    `);

    // Individual questions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_question (
        id            SERIAL PRIMARY KEY,
        quiz_id       INTEGER REFERENCES quiz(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        explanation   TEXT,        -- shown after answer
        position      INTEGER DEFAULT 0,
        choices       JSONB NOT NULL,
        correct_index INTEGER NOT NULL,  -- 0-based index into choices array
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User attempts (one per user per quiz, stores answers)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_attempt (
        id          SERIAL PRIMARY KEY,
        quiz_id     INTEGER REFERENCES quiz(id) ON DELETE CASCADE,
        user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
        answers     JSONB NOT NULL DEFAULT '[]',   -- [{ question_id, chosen_index }]
        score       INTEGER DEFAULT 0,
        total       INTEGER DEFAULT 0,
        completed   BOOLEAN DEFAULT false,
        started_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        UNIQUE(quiz_id, user_id)
      )
    `);

    await pool.query('CREATE INDEX IF NOT EXISTS idx_quiz_post_id ON quiz(post_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_quiz_question_quiz_id ON quiz_question(quiz_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_quiz_attempt_user ON quiz_attempt(user_id)');

    console.log('Migration reussie : tables quiz, quiz_question, quiz_attempt creees');
  } catch (e) {
    console.error('Erreur migration:', e.message);
  } finally {
    await pool.end();
  }
}
run();
