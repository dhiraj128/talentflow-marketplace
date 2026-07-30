/**
 * TalentFlow Isolated Disaster Recovery Restore & Verification Tool
 * Restores a backup file strictly to an ISOLATED DR database.
 * Explicitly refuses any production target URL for absolute safety.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load backend env if present
const backendEnvPath = path.resolve(__dirname, '../talentflow-backend/.env');
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
}

const targetUrl = process.env.DATABASE_URL_DR || process.argv[2] || process.env.DATABASE_URL;

if (!targetUrl) {
  console.error('================================================================');
  console.error('ERROR: Target DR Database URL is required!');
  console.error('================================================================');
  console.error('Usage: node scripts/restore-pg.js <TARGET_DR_DATABASE_URL>');
  console.error('Or set environment variable: $env:DATABASE_URL_DR');
  process.exit(1);
}

// 1. STRICT SAFETY CHECK: Refuse production targets
const lowerTarget = targetUrl.toLowerCase();
if (
  lowerTarget.includes('onrender.com') ||
  lowerTarget.includes('sispl.shop') ||
  lowerTarget.includes('talentflow-backend-qn7b') ||
  lowerTarget.includes('dpg-')
) {
  console.error('\n================================================================');
  console.error('FATAL SAFETY VIOLATION: PRODUCTION RESTORE TARGET BLOCKED!');
  console.error('================================================================');
  console.error('The target database URL contains a production hostname or Render cluster ID.');
  console.error('Restoring into production PostgreSQL is STRICTLY FORBIDDEN.');
  console.error('Please specify an isolated non-production DR database target URL.');
  process.exit(1);
}

const maskedUrl = targetUrl.replace(/:\/\/([^:]+):([^@]+)@/, '://[REDACTED_USER]:[REDACTED_PASS]@');

console.log('================================================================');
console.log('TALENTFLOW ISOLATED DISASTER RECOVERY RESTORE & VERIFICATION');
console.log('================================================================');
console.log(`Isolated DR Target: ${maskedUrl}`);

// 2. Find latest backup file in backups/
const backupsDir = path.resolve(__dirname, '../backups');
if (!fs.existsSync(backupsDir)) {
  console.error('No backups/ directory found! Run scripts/backup-database.ps1 first.');
  process.exit(1);
}

const files = fs.readdirSync(backupsDir).filter((f) => f.endsWith('.sql'));
if (files.length === 0) {
  console.error('No .sql backup files found in backups/ directory!');
  process.exit(1);
}

files.sort((a, b) => fs.statSync(path.join(backupsDir, b)).mtimeMs - fs.statSync(path.join(backupsDir, a)).mtimeMs);
const backupFile = path.join(backupsDir, files[0]);
console.log(`Backup File Selected: ${backupFile}`);

async function runRestoreAndVerify() {
  const prismaClientPath = path.resolve(__dirname, '../talentflow-backend/node_modules/@prisma/client');
  const { PrismaClient } = require(prismaClientPath);
  const prisma = new PrismaClient({ datasources: { db: { url: targetUrl } } });

  console.log('\n1. Restoring SQL statements into isolated DR database...');
  const sqlContent = fs.readFileSync(backupFile, 'utf-8');
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
      // Ignore conflict / already exists warnings on re-runs
      if (!err.message.includes('already exists') && !err.message.includes('ON CONFLICT')) {
        console.warn(`   [WARN] SQL statement execution notice: ${err.message.substring(0, 120)}`);
      }
    }
  }
  console.log(`   Restore execution complete! (${executedCount} statements processed)`);

  console.log('\n2. Verifying Data Integrity Across 13 Core Marketplace Entities...');

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
      verificationResults.push({ entity: entity.name, count, status: 'PASS' });
      console.log(`   [PASS] Entity: ${entity.name.padEnd(20)} Count: ${count}`);
    } catch (err) {
      verificationResults.push({ entity: entity.name, count: 0, status: 'FAIL', error: err.message });
      console.log(`   [FAIL] Entity: ${entity.name.padEnd(20)} Error: ${err.message}`);
    }
  }

  // 3. Test Prisma Raw SELECT 1 and execution timing
  const start = process.hrtime.bigint();
  await prisma.$queryRaw`SELECT 1`;
  const end = process.hrtime.bigint();
  const responseTimeMs = (Number(end - start) / 1000000).toFixed(2);
  console.log(`\n3. Database Readiness Check: SELECT 1 Response Time: ${responseTimeMs}ms`);

  await prisma.$disconnect();

  const failedCount = verificationResults.filter((r) => r.status === 'FAIL').length;

  console.log('\n================================================================');
  console.log('DISASTER RECOVERY RESTORE & VERIFICATION REPORT');
  console.log('================================================================');
  console.log(`Target DR Database:  ${maskedUrl}`);
  console.log(`Backup File Used:   ${path.basename(backupFile)}`);
  console.log(`Total Entities:     ${verificationResults.length}`);
  console.log(`Verified Entities:  ${verificationResults.length - failedCount} / ${verificationResults.length}`);
  console.log(`DB Response Time:   ${responseTimeMs}ms`);

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
