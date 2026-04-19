import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL_NON_POOLING });

pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'post'")
  .then(r => { console.log(r.rows); pool.end(); });