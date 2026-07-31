const fs = require('fs');
const path = require('path');

console.log("=========================================================");
console.log("TALENTFLOW MARKETPLACE — AUTOMATED PRODUCTION MOCK GUARD");
console.log("=========================================================");

const PROHIBITED_BUSINESS_STRINGS = [
  "InnovateTech",
  "TechCorp Inc.",
  "StartupHub",
  "Frontend Tech Lead",
  "Senior React Developer",
  "Full Stack Engineer",
  "Advanced React Patterns & Architecture",
  "Figma UI/UX Design Fundamentals",
  "TF-894-REACT",
  "TF-421-FIGMA",
  "RECOMMENDED_JOBS",
  "SAVED_JOBS",
  "mockCandidate",
  "mockEmployer",
  "fakeCompany",
  "demoAccount",
  "dummyData",
  "fakeOffer",
  "fakeInterview",
  "sampleResume",
];

const TARGET_DIRECTORIES = [
  path.join(__dirname, '../app'),
  path.join(__dirname, '../components'),
  path.join(__dirname, '../lib'),
  path.join(__dirname, '../features'),
  path.join(__dirname, '../talentflow-backend/src'),
];

let totalViolations = 0;

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.next' ||
        entry.name === 'dist' ||
        entry.name === '.git'
      ) {
        continue;
      }
      scanDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js'))) {
      if (entry.name.includes('.spec.') || entry.name.includes('.test.') || fullPath.includes('scratch') || fullPath.includes('scripts')) {
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf8');

      for (const prohibitedStr of PROHIBITED_BUSINESS_STRINGS) {
        if (content.includes(prohibitedStr)) {
          console.error(`[PROHIBITED MOCK DETECTED] ${fullPath} contains prohibited string "${prohibitedStr}"`);
          totalViolations++;
        }
      }
    }
  }
}

for (const targetDir of TARGET_DIRECTORIES) {
  scanDirectory(targetDir);
}

console.log("=========================================================");
if (totalViolations > 0) {
  console.error(`FAILED: ${totalViolations} production mock data violation(s) found!`);
  process.exit(1);
} else {
  console.log("PASS: 0 production mock data violations found! Clean production build.");
  process.exit(0);
}
