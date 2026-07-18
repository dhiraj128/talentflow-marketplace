const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const candidateEmail = process.env.PROD_CANDIDATE_EMAIL;
const candidatePwd = process.env.PROD_CANDIDATE_PWD;

if (!candidateEmail || !candidatePwd) {
  throw new Error('Missing production credentials');
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL },
  },
});

async function runTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen to console and network to catch errors
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('requestfailed', request => console.log('REQUEST_FAILED:', request.url(), request.failure().errorText));
  page.on('response', response => {
    if (response.url().includes('/file-upload/resume')) {
      console.log('UPLOAD_RESPONSE:', response.status(), response.url());
      response.text().then(text => console.log('UPLOAD_RESPONSE_BODY:', text)).catch(() => {});
    }
  });
  
  try {
    console.log('Navigating to /sign-in...');
    await page.goto('https://talentflow-marketplace.vercel.app/sign-in');
    
    console.log('Waiting for email input...');
    await page.waitForSelector('input[type="email"]');
    
    await page.fill('input[type="email"]', candidateEmail);
    await page.fill('input[type="password"]', candidatePwd);
    await page.click('button[type="submit"]');
    
    console.log('Waiting for candidate dashboard...');
    await page.waitForURL(/\/job-seeker/);
    console.log('Login successful.');

    await page.goto('https://talentflow-marketplace.vercel.app/job-seeker/resume-center/builder');
    console.log('Opened Resume Center Builder.');
    
    await page.waitForSelector('button[role="tab"]:has-text("Upload")');
    await page.click('button[role="tab"]:has-text("Upload")');
    console.log('Switched to Upload tab.');
    
    const dummyPdfPath = path.resolve(__dirname, '..', '..', 'talentflow-marketplace', 'tests', 'fixtures', 'valid-resume.pdf');
    
    console.log('Uploading file...');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(dummyPdfPath);
    
    console.log('Wait 10 seconds to allow upload to finish...');
    await page.waitForTimeout(10000);

    // Database verification
    console.log('Checking Production DB...');
    const candidateUser = await prisma.user.findUnique({ where: { email: candidateEmail }, include: { candidateProfile: true } });
    const resume = await prisma.resume.findFirst({
      where: { candidateId: candidateUser?.candidateProfile?.id },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!resume) {
        throw new Error('Resume not found in DB');
    }
    
    console.log(`\n\nSUCCESS! \nResumeId: ${resume.id}\nStorageKey: ${resume.storageKey}\nBucket: ${resume.bucket}\nMimeType: ${resume.mimeType}\n\n`);

  } catch (err) {
    console.error('Test Failed:', err);
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

runTest().catch(console.error);
