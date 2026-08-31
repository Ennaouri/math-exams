const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const conn = process.env.POSTGRES_URL_NO_SSL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
const pool = new Pool({ connectionString: conn, max: 1, ssl: false });

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_event (
        id           SERIAL PRIMARY KEY,
        title        VARCHAR(500) NOT NULL,
        event_date   DATE NOT NULL,
        event_time   TIME,                        -- optional start time
        end_date     DATE,                         -- null = same-day event
        type         VARCHAR(100) NOT NULL DEFAULT 'examen',
        -- 'examen_national' | 'examen_regional' | 'concours' | 'devoir_surveille' | 'autre'
        niveau       VARCHAR(100),
        -- 'tronc-commun' | '1bac' | '2bac' | 'concours' | 'all'
        niveau_label VARCHAR(200),
        description  TEXT,
        location     VARCHAR(300),
        pdf_url      TEXT,                         -- official PDF link
        source_url   TEXT,                         -- official website link
        is_active    BOOLEAN DEFAULT true,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_exam_event_date ON exam_event(event_date)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_exam_event_type ON exam_event(type)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_exam_event_niveau ON exam_event(niveau)`);

    // Seed some example Moroccan exam events for 2025-2026
    await pool.query(`
      INSERT INTO exam_event (title, event_date, end_date, type, niveau, niveau_label, description)
      VALUES
        ('BAC National — Session Normale 2026', '2026-06-02', '2026-06-05', 'examen_national', '2bac', '2ème BAC', 'Examen du Baccalauréat session normale — mathématiques'),
        ('BAC National — Session Rattrapage 2026', '2026-07-07', '2026-07-08', 'examen_national', '2bac', '2ème BAC', 'Session de rattrapage du Baccalauréat'),
        ('Examens Régionaux 1ère BAC S1', '2026-01-19', '2026-01-21', 'examen_regional', '1bac', '1ère BAC', 'Examens régionaux du premier semestre'),
        ('Examens Régionaux 1ère BAC S2', '2026-05-11', '2026-05-13', 'examen_regional', '1bac', '1ère BAC', 'Examens régionaux du second semestre'),
        ('Examens Régionaux 2ème BAC S1', '2026-01-22', '2026-01-24', 'examen_regional', '2bac', '2ème BAC', 'Examens régionaux du premier semestre'),
        ('Concours ENSA / ENSA 2026', '2026-07-15', NULL, 'concours', 'concours', 'Concours Post-BAC', 'Concours d''entrée aux Écoles Nationales des Sciences Appliquées'),
        ('Concours CNC 2026', '2026-07-20', '2026-07-22', 'concours', 'concours', 'Concours Post-BAC', 'Concours National Commun — Classes Préparatoires'),
        ('Concours ENCG 2026', '2026-07-25', NULL, 'concours', 'concours', 'Concours Post-BAC', 'Concours d''entrée aux Écoles Nationales de Commerce et de Gestion')
      ON CONFLICT DO NOTHING
    `);

    console.log('Migration reussie : table exam_event creee avec donnees de depart');
  } catch (e) {
    console.error('Erreur migration:', e.message);
  } finally {
    await pool.end();
  }
}
run();
