const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable' });
client.connect().then(() => {
  console.log('Connected!');
  return client.query('SELECT count(*) FROM "Category"');
}).then(res => {
  console.log('Categories count:', res.rows[0].count);
  process.exit(0);
}).catch(err => {
  console.error(err.message);
  process.exit(1);
});
