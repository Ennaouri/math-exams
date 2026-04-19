import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL_NON_POOLING });

async function check() {
  const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log('Tables:', tables.rows);
  
  const catCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Category'");
  console.log('Category columns:', catCols.rows);
  
  const catCols2 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'category'");
  console.log('category (lowercase) columns:', catCols2.rows);
  
  pool.end();
}

check();