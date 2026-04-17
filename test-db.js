require('dotenv').config();
const { sql } = require('@vercel/postgres');

async function test() {
  try {
    const result = await sql`SELECT count(*) as count FROM category`;
    console.log('Categories:', result.rows);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();