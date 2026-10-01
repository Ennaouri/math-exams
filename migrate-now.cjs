const { Client } = require('pg');

const neonUrl = 'postgres://default:FCqxK1h3VbLG@ep-snowy-bonus-a2fek21y.eu-central-1.aws.neon.tech/verceldb?sslmode=require&options=endpoint%3Dep-snowy-bonus-a2fek21y';
const supabaseUrl = 'postgresql://postgres.lhbyledytktdvuwekmot:Ennaouri@1020@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function migrate() {
  const neon = new Client({ connectionString: neonUrl });
  const supa = new Client({ connectionString: supabaseUrl });
  
  await neon.connect();
  await supa.connect();

  const tables = ['users', 'Category', 'UnderCategory', 'Post', 'PostDetails'];

  for (const table of tables) {
    console.log(`Migrating ${table}...`);
    
    const colRes = await neon.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [table]);
    const neonCols = colRes.rows.map(r => r.column_name);
    
    const supaColRes = await supa.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [table]);
    const supaCols = supaColRes.rows.map(r => r.column_name);

    const commonCols = neonCols.filter(c => supaCols.includes(c));
    if (commonCols.length === 0) continue;

    // Delete existing
    await supa.query(`DELETE FROM "${table}"`);

    const { rows } = await neon.query(`SELECT "${commonCols.join('", "')}" FROM "${table}" ORDER BY id ASC`);
    console.log(`Found ${rows.length} rows for ${table}`);

    for (const row of rows) {
      const keys = commonCols;
      const values = keys.map((k, i) => `$${i + 1}`);
      const params = keys.map(k => row[k]);
      
      const query = `INSERT INTO "${table}" ("${keys.join('", "')}") VALUES (${values.join(', ')})`;
      await supa.query(query, params);
    }

    const maxRes = await supa.query(`SELECT MAX(id) FROM "${table}"`);
    const maxId = maxRes.rows[0].max;
    if (maxId) {
      await supa.query(`SELECT setval('public."${table}_id_seq"', ${maxId})`);
      console.log(`Sequence for ${table} set to ${maxId}`);
    }
  }

  await neon.end();
  await supa.end();
  console.log('Migration complete!');
}

migrate().catch(console.error);
