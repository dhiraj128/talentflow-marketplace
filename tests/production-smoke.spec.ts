import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Production Smoke Test - Candidate Upload', () => {
  test.setTimeout(120000);

  const candidateEmail = process.env.PROD_CANDIDATE_EMAIL;
  const candidatePwd = process.env.PROD_CANDIDATE_PWD;

  if (!candidateEmail || !candidatePwd) {
    throw new Error('Missing production credentials');
  }

  test.beforeAll(async () => {
    // Create a dummy pdf file for testing
    const fixturesDir = path.resolve(__dirname, 'fixtures');
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
    const pdfPath = path.resolve(fixturesDir, 'test-resume.pdf');
    if (!fs.existsSync(pdfPath)) {
      fs.writeFileSync(pdfPath, 'dummy pdf content for smoke test');
    }
  });

  test('1. Candidate Login & Resume Upload', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('Navigating to login...');
    await page.goto('/login');
    await page.fill('input[type="email"]', candidateEmail);
    await page.fill('input[type="password"]', candidatePwd);
    await page.click('button[type="submit"]');
    
    console.log('Waiting for candidate dashboard...');
    await page.waitForURL(/\/job-seeker|\/dashboard/);
    console.log('Login successful.');

    await page.goto('/job-seeker/resume-center');
    console.log('Opened Resume Center.');
    
    const dummyPdfPath = path.resolve(__dirname, 'fixtures', 'test-resume.pdf');
    
    console.log('Uploading file...');
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('label').filter({ hasText: /Click to upload/i }).click(),
    ]);
    await fileChooser.setFiles(dummyPdfPath);
    
    await page.click('button:has-text("Upload")');
    console.log('Clicked upload button.');
    
    await expect(page.locator('text="Upload Complete"').or(page.locator('text="Uploaded"')).or(page.locator('.lucide-check-circle'))).toBeVisible({ timeout: 25000 });
    console.log('Upload UI confirmed success.');
  });
});
