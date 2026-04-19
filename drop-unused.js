import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL_NON_POOLING });

async function dropUnused() {
  await pool.query('DROP TABLE IF EXISTS post_details CASCADE');
  await pool.query('DROP TABLE IF EXISTS post CASCADE');
  await pool.query('DROP TABLE IF EXISTS under_category CASCADE');
  await pool.query('DROP TABLE IF EXISTS category CASCADE');
  console.log('Dropped lowercase tables');
  pool.end();
}

dropUnused();