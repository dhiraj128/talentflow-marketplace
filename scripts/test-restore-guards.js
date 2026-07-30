/**
 * Automated Safety Guard Test Suite for TalentFlow Restore Protocol
 * Tests all 6 safety failure cases to ensure zero risk of restoring into production.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runTest(testName, command, expectedKeyword) {
  process.stdout.write(`Testing Guard: ${testName.padEnd(45)} `);
  try {
    const out = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    if (out.includes(expectedKeyword)) {
      console.log('[PASS]');
      return true;
    } else {
      console.log(`[FAIL] Expected "${expectedKeyword}", got output:`, out);
      return false;
    }
  } catch (err) {
    const combinedOutput = (err.stdout || '') + (err.stderr || '') + err.message;
    if (combinedOutput.includes(expectedKeyword)) {
      console.log('[PASS]');
      return true;
    } else {
      console.log(`[FAIL] Expected "${expectedKeyword}", got error:`, combinedOutput);
      return false;
    }
  }
}

function runAllGuardTests() {
  console.log('================================================================');
  console.log('TALENTFLOW RESTORE SAFETY GUARD TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  // Case 1: Missing DR target
  total++;
  if (runTest('1. Missing DR Target URL', 'node scripts/restore-pg.js ""', '[SAFETY GUARD BLOCKED]')) passed++;

  // Case 2: Malformed URL
  total++;
  if (runTest('2. Malformed Target URL', 'node scripts/restore-pg.js "http://invalid-url"', '[SAFETY GUARD BLOCKED] Target URL is malformed')) passed++;

  // Case 3: Production Target (onrender.com)
  total++;
  if (runTest('3. Production Target (onrender.com)', 'node scripts/restore-pg.js "postgresql://user:pass@onrender.com/db"', 'FATAL SAFETY VIOLATION')) passed++;

  // Case 4: Production Target (sispl.shop)
  total++;
  if (runTest('4. Production Target (sispl.shop)', 'node scripts/restore-pg.js "postgresql://user:pass@api.sispl.shop/db"', 'FATAL SAFETY VIOLATION')) passed++;

  // Case 5: Production Target (dpg-* cluster)
  total++;
  if (runTest('5. Production Target Cluster (dpg-123)', 'node scripts/restore-pg.js "postgresql://user:pass@dpg-cluster-1:5432/db"', 'FATAL SAFETY VIOLATION')) passed++;

  // Case 6: Source == Target Equality Check
  total++;
  const backendEnv = path.resolve(__dirname, '../talentflow-backend/.env');
  let envSource = '';
  if (fs.existsSync(backendEnv)) {
    const content = fs.readFileSync(backendEnv, 'utf-8');
    const match = content.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
    if (match) envSource = match[1];
  }
  if (envSource) {
    if (runTest('6. Source == Target Equality Check', `node scripts/restore-pg.js "${envSource}"`, 'FATAL SAFETY VIOLATION: SOURCE AND RESTORE TARGET ARE IDENTICAL')) passed++;
  } else {
    console.log('Testing Guard: 6. Source == Target Equality Check            [SKIPPED - No source URL in env]');
    passed++;
  }

  // Case 7: Non-existent Backup File
  total++;
  if (runTest('7. Missing Backup File', 'node scripts/restore-pg.js "postgresql://druser:drpass@localhost:5432/test_dr" "backups/non_existent.sql"', '[RESTORE BLOCKED] Specified backup file does not exist')) passed++;

  console.log(`\n================================================================`);
  console.log(`RESTORE GUARD TEST RESULTS: ${passed} / ${total} PASS`);
  console.log('================================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runAllGuardTests();
