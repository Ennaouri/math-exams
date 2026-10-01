import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  try {
    const res = await prisma.$queryRawUnsafe('UPDATE "Post" SET name = $1 WHERE id = $2 RETURNING *', 'Test', 1);
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
