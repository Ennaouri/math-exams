import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL_NON_POOLING });

async function check() {
  const catCount = await pool.query('SELECT COUNT(*) FROM "Category"');
  console.log('"Category" count:', catCount.rows[0]);
  
  const catCount2 = await pool.query('SELECT COUNT(*) FROM category');
  console.log('category count:', catCount2.rows[0]);
  
  const postCount = await pool.query('SELECT COUNT(*) FROM "Post"');
  console.log('"Post" count:', postCount.rows[0]);
  
  const postCount2 = await pool.query('SELECT COUNT(*) FROM post');
  console.log('post count:', postCount2.rows[0]);

  pool.end();
}

check();