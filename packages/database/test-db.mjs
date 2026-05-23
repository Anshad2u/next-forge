import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
try {
  const result = await sql`SELECT * FROM "Page"`;
  console.log("Pages:", JSON.stringify(result));
} catch (e) {
  console.error("DB Error:", e.message);
}
