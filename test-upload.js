const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FRONTEND_URL = 'https://talentflow-marketplace.vercel.app';
const CANDIDATE_EMAIL = 'talentflow.candidate.test@yourdomain.com';
const PWD = 'Dhiraj@123';

async function run() {
  let browser = await chromium.launch({ headless: true });
  let context = await browser.newContext();
  let page = await context.newPage();

  console.log('Logging in...');
  await page.goto(`${FRONTEND_URL}/sign-in`);
  await page.fill('input[type="email"]', CANDIDATE_EMAIL);
  await page.fill('input[type="password"]', PWD);
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/dashboard');

  console.log('Navigating to builder...');
  await page.goto(`${FRONTEND_URL}/job-seeker/resume-center/builder`);
  await page.waitForLoadState('networkidle');

  await page.click('button[role="tab"]:has-text("Upload")');
  console.log('Clicked Upload tab.');

  page.on('request', req => {
    if (req.url().includes('file-upload')) {
        console.log(`\n>>> NETWORK REQUEST DETECTED <<<`);
        console.log(`URL: ${req.url()}`);
        console.log(`Method: ${req.method()}`);
        console.log(`Headers:`, req.headers());
    }
  });

  page.on('response', async res => {
    if (res.url().includes('file-upload')) {
        console.log(`\n>>> NETWORK RESPONSE DETECTED <<<`);
        console.log(`Status: ${res.status()}`);
        try {
            console.log(`Body:`, await res.text());
        } catch (e) {}
    }
  });

  const pdfPath = path.join(__dirname, 'test-resume.pdf');
  fs.writeFileSync(pdfPath, 'Test PDF content');

  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles(pdfPath);
  console.log('File selected. Waiting for upload to complete (10s)...');
  
  await page.waitForTimeout(10000);
  await browser.close();
  console.log('Done.');
}

run().catch(console.error);
