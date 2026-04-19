import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL_NON_POOLING });

async function reset() {
  await pool.query('DROP TABLE IF EXISTS post_details CASCADE');
  await pool.query('DROP TABLE IF EXISTS post CASCADE');
  await pool.query('DROP TABLE IF EXISTS under_category CASCADE');
  await pool.query('DROP TABLE IF EXISTS category CASCADE');
  await pool.query('DROP TABLE IF EXISTS users CASCADE');
  console.log('All tables dropped');
  pool.end();
}

reset();