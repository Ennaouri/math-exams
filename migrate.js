require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: process.env.POSTGRES_DATABASE,
  user: 'default',
  password: process.env.POSTGRES_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  const schema = fs.readFileSync('./schema.sql', 'utf-8');
  
  await client.connect();
  await client.query(schema);
  console.log('Tables created successfully!');
  
  await client.end();
}

migrate().catch(console.error);