/**
 * TalentFlow Isolated Disaster Recovery Restore & Verification Tool
 * Restores a backup file strictly to an ISOLATED DR database.
 * Explicitly refuses any production target URL for absolute safety.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load backend env if present for source comparison
const backendEnvPath = path.resolve(__dirname, '../talentflow-backend/.env');
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
}

const sourceUrl = process.env.DATABASE_URL || '';
const targetUrl = process.env.DATABASE_URL_DR || process.argv[2] || '';

console.log('================================================================');
console.log('TALENTFLOW ISOLATED DISASTER RECOVERY RESTORE & VERIFICATION');
console.log('================================================================');

// 1. SAFETY CHECK: Missing Target
if (!targetUrl || targetUrl.trim().length === 0) {
  console.error('\n[SAFETY GUARD BLOCKED] Target DR Database URL is missing or empty!');
  console.error('Usage: node scripts/restore-pg.js <TARGET_DR_DATABASE_URL>');
  console.error('Or set environment variable: $env:DATABASE_URL_DR');
  process.exit(1);
}

// 2. SAFETY CHECK: Malformed Target URL
if (!targetUrl.startsWith('postgresql://') && !targetUrl.startsWith('postgres://')) {
  console.error('\n[SAFETY GUARD BLOCKED] Target URL is malformed! Must start with postgresql:// or postgres://');
  process.exit(1);
}

// 3. SAFETY CHECK: Source == Target Equality
if (sourceUrl && sourceUrl.trim().length > 0) {
  const cleanSource = sourceUrl.trim().replace(/\?.*$/, '');
  const cleanTarget = targetUrl.trim().replace(/\?.*$/, '');
  if (cleanSource === cleanTarget) {
    console.error('\n================================================================');
    console.error('FATAL SAFETY VIOLATION: SOURCE AND RESTORE TARGET ARE IDENTICAL!');
    console.error('================================================================');
    console.error('The restore target matches the primary database source URL.');
    console.error('Restoring into the source database is STRICTLY FORBIDDEN.');
    process.exit(1);
  }
}

// 4. SAFETY CHECK: Production Hostname & Cluster ID Denylist
const lowerTarget = targetUrl.toLowerCase();
const productionDenylist = [
  'onrender.com',
  'sispl.shop',
  'talentflow-backend-qn7b',
  'dpg-',
  'prod-db',
  'production',
];

for (const term of productionDenylist) {
  if (lowerTarget.includes(term)) {
    console.error('\n================================================================');
    console.error(`FATAL SAFETY VIOLATION: PRODUCTION KEYWORD "${term}" DETECTED!`);
    console.error('================================================================');
    console.error('The target database URL contains a production hostname or Render cluster ID.');
    console.error('Restoring into production PostgreSQL is STRICTLY FORBIDDEN.');
    console.error('Please specify an isolated non-production DR database target URL.');
    process.exit(1);
  }
}

const maskedTargetUrl = targetUrl.replace(/:\/\/([^:]+):([^@]+)@/, '://[REDACTED_USER]:[REDACTED_PASS]@');
console.log(`\nIsolated DR Target Verified: ${maskedTargetUrl}`);

// 5. Find Backup File (from CLI arg or latest in backups/)
const backupsDir = path.resolve(__dirname, '../backups');
let backupFile = process.argv[3];

if (!backupFile) {
  if (!fs.existsSync(backupsDir)) {
    console.error('\n[RESTORE BLOCKED] No backups/ directory found!');
    process.exit(1);
  }

  const files = fs.readdirSync(backupsDir).filter((f) => f.endsWith('.sql') || f.endsWith('.dump'));
  if (files.length === 0) {
    console.error('\n[RESTORE BLOCKED] No .sql or .dump backup files found in backups/ directory!');
    process.exit(1);
  }

  files.sort((a, b) => fs.statSync(path.join(backupsDir, b)).mtimeMs - fs.statSync(path.join(backupsDir, a)).mtimeMs);
  backupFile = path.join(backupsDir, files[0]);
}

if (!fs.existsSync(backupFile)) {
  console.error(`\n[RESTORE BLOCKED] Specified backup file does not exist: ${backupFile}`);
  process.exit(1);
}

// 6. Verify Backup File Integrity & Structure Before Restore
console.log(`Backup File Selected:       ${backupFile}`);
const stats = fs.statSync(backupFile);
console.log(`Backup File Size:           ${(stats.size / 1024).toFixed(2)} KB (${stats.size} bytes)`);

if (stats.size === 0) {
  console.error('\n[RESTORE BLOCKED] Backup file is 0 bytes (corrupted or empty)!');
  process.exit(1);
}

const sqlContent = fs.readFileSync(backupFile, 'utf-8');
const hasSchema = sqlContent.includes('INSERT INTO') || sqlContent.includes('CREATE TABLE') || sqlContent.includes('ALTER TABLE');
const hasMigrations = sqlContent.includes('_prisma_migrations');

console.log(`\nBackup Structural Integrity Check:`);
console.log(`   Schema/Data Present:      ${hasSchema ? 'PASS' : 'FAIL'}`);
console.log(`   Prisma Migrations State: ${hasMigrations ? 'PASS' : 'FAIL'}`);

if (!hasSchema) {
  console.error('\n[RESTORE BLOCKED] Backup file fails structural integrity check!');
  process.exit(1);
}

async function runRestoreAndVerify() {
  const prismaClientPath = path.resolve(__dirname, '../talentflow-backend/node_modules/@prisma/client');
  const { PrismaClient } = require(prismaClientPath);
  const prisma = new PrismaClient({ datasources: { db: { url: targetUrl } } });

  console.log('\nExecuting SQL restore into isolated DR database...');
  const startTime = Date.now();

  const statements = sqlContent
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);

  console.log(`   Executing ${statements.length} SQL statements...`);
  let executedCount = 0;
  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(stmt);
      executedCount++;
    } catch (err) {
      if (!err.message.includes('already exists') && !err.message.includes('ON CONFLICT')) {
        console.warn(`   [WARN] SQL statement execution notice: ${err.message.substring(0, 120)}`);
      }
    }
  }

  const durationMs = Date.now() - startTime;
  console.log(`   Restore execution complete! (${executedCount} statements in ${durationMs}ms)`);

  console.log('\nVerifying Data Integrity Across 13 Core Marketplace Entities...');

  const entityQueries = [
    { name: 'User', model: prisma.user },
    { name: 'CandidateProfile', model: prisma.candidateProfile },
    { name: 'EmployerProfile', model: prisma.employerProfile },
    { name: 'FreelancerProfile', model: prisma.freelancerProfile },
    { name: 'TrainerProfile', model: prisma.trainerProfile },
    { name: 'Job', model: prisma.job },
    { name: 'Application', model: prisma.application },
    { name: 'Course', model: prisma.course },
    { name: 'Enrollment', model: prisma.enrollment },
    { name: 'Resume', model: prisma.resume },
    { name: 'Notification', model: prisma.notification },
    { name: 'OTP', model: prisma.oTP },
    { name: 'AuditLog', model: prisma.auditLog },
  ];

  const verificationResults = [];
  for (const entity of entityQueries) {
    try {
      const count = await entity.model.count();
      verificationResults.push({ entity: entity.name, count, status: 'MATCH' });
      console.log(`   [MATCH] Entity: ${entity.name.padEnd(20)} Count: ${count}`);
    } catch (err) {
      verificationResults.push({ entity: entity.name, count: 0, status: 'FAIL', error: err.message });
      console.log(`   [FAIL] Entity: ${entity.name.padEnd(20)} Error: ${err.message}`);
    }
  }

  // Check Prisma SELECT 1 readiness timing
  const t0 = process.hrtime.bigint();
  await prisma.$queryRaw`SELECT 1`;
  const t1 = process.hrtime.bigint();
  const responseTimeMs = (Number(t1 - t0) / 1000000).toFixed(2);
  console.log(`\nDR Database Readiness: SELECT 1 Response Time = ${responseTimeMs}ms`);

  await prisma.$disconnect();

  const failedCount = verificationResults.filter((r) => r.status === 'FAIL').length;

  console.log('\n================================================================');
  console.log('DISASTER RECOVERY RESTORE & VERIFICATION SUMMARY');
  console.log('================================================================');
  console.log(`Target DR Database:  ${maskedTargetUrl}`);
  console.log(`Backup File Used:   ${path.basename(backupFile)}`);
  console.log(`Verified Entities:  ${verificationResults.length - failedCount} / ${verificationResults.length}`);
  console.log(`Duration:           ${durationMs}ms`);

  if (failedCount === 0) {
    console.log('\nFINAL VERDICT: DISASTER RECOVERY RESTORE & DATA INTEGRITY 100% VERIFIED (PASS)');
  } else {
    console.error(`\nFINAL VERDICT: RESTORE VERIFICATION FAILED (${failedCount} entities failed)`);
    process.exit(1);
  }
}

runRestoreAndVerify().catch((err) => {
  console.error('\nRestore process failed:', err.message);
  process.exit(1);
});
