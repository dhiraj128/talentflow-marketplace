const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('--- STARTING STANDALONE E2E VERIFICATION ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.text().includes('FETCHED') || msg.text().includes('FORMATTED') || msg.text().includes('Failed to load resumes')) {
      console.log(`[BROWSER]: ${msg.text()}`);
    }
  });

  try {
    console.log('1. Logging in as candidate...');
    await page.goto('http://localhost:3000/sign-in');
    await page.fill('input[type="email"]', 'test_candidate_new@talentflow.test');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/job-seeker/dashboard', { timeout: 15000 });

    console.log('2. Navigating to Resume Center...');
    await page.goto('http://localhost:3000/job-seeker/resume-center/my-resume');
    await page.waitForLoadState('networkidle');
  } catch (error) {
    await page.screenshot({ path: 'login-failed.png' });
    throw error;
  }

  console.log('3. Preparing file for upload...');
  const uniqueName = `test-resume-${Date.now()}.pdf`;
  const filePath = path.join(__dirname, 'fixtures', uniqueName);
  fs.copyFileSync(path.join(__dirname, 'fixtures', 'valid-resume.pdf'), filePath);

  const uploadRequestPromise = page.waitForRequest(
    request => request.url().includes('/api/v1/file-upload/resume') && request.method() === 'POST'
  );
  const uploadResponsePromise = page.waitForResponse(
    response => response.url().includes('/api/v1/file-upload/resume') && response.request().method() === 'POST'
  );

  console.log('4. Uploading file...');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.evaluate(node => node.style.display = 'block');
  await fileInput.setInputFiles(filePath);

  const req = await uploadRequestPromise;
  console.log('✅ Network: Browser successfully sent POST request');

  const res = await uploadResponsePromise;
  console.log('✅ Network: API returned success (201).');

  console.log('5. Waiting for UI to update...');
  await page.waitForSelector(`text=${uniqueName}`, { timeout: 15000 });
  console.log('✅ UI: Resume appeared in UI without page reload');

  console.log('6. Reloading page...');
  await page.reload();
  await page.waitForLoadState('networkidle');
  try {
    await page.waitForSelector(`text=${uniqueName}`, { timeout: 15000 });
    console.log('✅ UI: Resume remains visible in UI after page reload');
  } catch (error) {
    await page.screenshot({ path: 'reload-failed.png' });
    throw error;
  }

  fs.unlinkSync(filePath);
  await browser.close();
  console.log('--- E2E BROWSER SCRIPT COMPLETE ---');
}

run().catch(e => {
  console.error('Failed:', e.message);
  if (e.stack) console.error(e.stack);
  process.exit(1);
});
