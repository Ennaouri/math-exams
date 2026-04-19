import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL_NON_POOLING });

pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
  .then(r => { console.log(r.rows); pool.end(); });