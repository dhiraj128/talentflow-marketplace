/**
 * TalentFlow Production PostgreSQL Backup Tool
 * Generates a clean schema + data backup without exposing credentials or mutating database.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment from talentflow-backend/.env if DATABASE_URL is not set in env
const backendEnvPath = path.resolve(__dirname, '../talentflow-backend/.env');
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
}

const dbUrl = process.argv[2] || process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('================================================================');
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('================================================================');
  console.error('Please set $env:DATABASE_URL or pass database URL argument:');
  console.error('  node scripts/backup-pg.js <DATABASE_URL>');
  process.exit(1);
}

// Mask credentials for display
const maskedUrl = dbUrl.replace(/:\/\/([^:]+):([^@]+)@/, '://[REDACTED_USER]:[REDACTED_PASS]@');
console.log('================================================================');
console.log('TALENTFLOW PRODUCTION POSTGRESQL BACKUP TOOL');
console.log('================================================================');
console.log(`Source Database Target: ${maskedUrl}`);

const backupsDir = path.resolve(__dirname, '../backups');
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputFile = path.join(backupsDir, `talentflow-backup-${timestamp}.sql`);

console.log(`Output Backup File:    ${outputFile}`);

function findPgDump() {
  try {
    execSync('pg_dump --version', { stdio: 'ignore' });
    return 'pg_dump';
  } catch {
    const pgDirs = ['C:\\Program Files\\PostgreSQL', 'C:\\Program Files (x86)\\PostgreSQL'];
    for (const dir of pgDirs) {
      if (fs.existsSync(dir)) {
        const versions = fs.readdirSync(dir);
        for (const ver of versions) {
          const exePath = path.join(dir, ver, 'bin', 'pg_dump.exe');
          if (fs.existsSync(exePath)) {
            return `"${exePath}"`;
          }
        }
      }
    }
    return null;
  }
}

async function performPrismaExport() {
  console.log('\nExecuting Prisma Engine SQL backup export...');
  const prismaClientPath = path.resolve(__dirname, '../talentflow-backend/node_modules/@prisma/client');
  const { PrismaClient } = require(prismaClientPath);
  const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

  let sqlOutput = `-- TalentFlow Production Backup Export\n-- Timestamp: ${new Date().toISOString()}\n\n`;

  // Query table list from information_schema
  const tablesRes = await prisma.$queryRawUnsafe(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;"
  );
  const tables = tablesRes.map((r) => r.table_name);
  console.log(`   Found ${tables.length} tables to export: ${tables.join(', ')}`);

  for (const table of tables) {
    sqlOutput += `-- Table: ${table}\n`;
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM "${table}";`);

    if (!rows || rows.length === 0) {
      sqlOutput += `-- No records in ${table}\n\n`;
      continue;
    }

    const columns = Object.keys(rows[0]);
    const colList = columns.map((c) => `"${c}"`).join(', ');

    for (const row of rows) {
      const values = columns.map((col) => {
        const val = row[col];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
        if (typeof val === 'number') return val;
        if (val instanceof Date) return `'${val.toISOString()}'`;
        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
        return `'${String(val).replace(/'/g, "''")}'`;
      });
      sqlOutput += `INSERT INTO "${table}" (${colList}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;\n`;
    }
    sqlOutput += '\n';
  }

  await prisma.$disconnect();
  fs.writeFileSync(outputFile, sqlOutput, 'utf-8');
}

async function runBackup() {
  const pgDumpExe = findPgDump();
  if (pgDumpExe) {
    console.log(`\nExecuting System pg_dump (${pgDumpExe})...`);
    const command = `${pgDumpExe} "${dbUrl}" --clean --if-exists --no-owner --no-privileges -f "${outputFile}"`;
    execSync(command, { stdio: 'inherit' });
  } else {
    console.log('\nSystem pg_dump not found in PATH, using Prisma Engine exporter...');
    await performPrismaExport();
  }

  const stats = fs.statSync(outputFile);
  const sizeKb = (stats.size / 1024).toFixed(2);

  console.log('\n================================================================');
  console.log('BACKUP EXPORT SUCCESSFUL!');
  console.log('================================================================');
  console.log(`File:       ${outputFile}`);
  console.log(`File Size:  ${sizeKb} KB (${stats.size} bytes)`);
  console.log(`Timestamp:  ${new Date().toISOString()}`);
  console.log('\nNote: Backup file is stored in backups/ and is ignored by Git.');
}

runBackup().catch((err) => {
  console.error('\nBackup process failed:', err.message);
  process.exit(1);
});
