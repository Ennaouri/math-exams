import pg from 'pg';
import fs from 'fs';

const { Client } = pg;

const client = new Client({
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
  ssl: true,
});

async function migrate() {
  const schema = fs.readFileSync('./schema.sql', 'utf-8');
  
  await client.connect();
  await client.query(schema);
  console.log('Tables created successfully!');
  
  await client.end();
}

migrate().catch(console.error);