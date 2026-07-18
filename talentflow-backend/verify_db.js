const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSchema() {
  try {
    console.log("--- 1. Confirming Database Connection ---");
    const dbUrl = process.env.DATABASE_URL;
    console.log("DATABASE_URL includes 'render.com':", dbUrl ? dbUrl.includes('render.com') : false);
    
    console.log("\n--- 2. Checking Columns ---");
    const cols = await prisma.$queryRaw`
      SELECT table_name, column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name IN ('Resume', 'Application')
      AND column_name IN ('resumeId', 'bucket', 'fileName', 'mimeType', 'size', 'storageKey', 'type', 'version');
    `;
    console.log(JSON.stringify(cols, null, 2));

    console.log("\n--- 3. Checking Foreign Keys ---");
    const fks = await prisma.$queryRaw`
      SELECT
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name,
          tc.constraint_name,
          rc.delete_rule,
          rc.update_rule
      FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
          JOIN information_schema.referential_constraints AS rc
            ON rc.constraint_name = tc.constraint_name
      WHERE tc.constraint_name = 'Application_resumeId_fkey';
    `;
    console.log(JSON.stringify(fks, null, 2));

    console.log("\n--- 4. Checking _prisma_migrations ---");
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, started_at, finished_at 
      FROM _prisma_migrations 
      WHERE migration_name LIKE '%sync_s3_metadata%';
    `;
    console.log(JSON.stringify(migrations, null, 2));
    
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
