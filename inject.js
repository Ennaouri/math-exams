
const { db } = require("@vercel/postgres");
require("dotenv").config();

async function main() {
  const client = await db.connect();
  
  // Find a post detail
  const { rows } = await client.sql`SELECT * FROM post_details LIMIT 1`;
  if (rows.length === 0) {
    console.log("No post details found!");
    return;
  }
  
  const detail = rows[0];
  const samplePdf = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  
  await client.sql`UPDATE post_details SET thumbnail = ${samplePdf}, description = ${"Un PDF de test injecté par moi"} WHERE id = ${detail.id}`;
  
  console.log("Injecté un PDF de test dans :", detail.name);
  process.exit(0);
}

main().catch(console.error);

