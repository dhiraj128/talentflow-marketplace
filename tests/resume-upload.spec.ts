import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

test.use({ storageState: path.join(__dirname, '../.auth/candidate.json') });

test.describe.skip('Mobile Resume Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/job-seeker/resume-center/builder');
  });

  test('Resume Center loads correctly with no horizontal overflow', async ({ page }) => {
    // Wait for the UI to settle
    await page.waitForLoadState('networkidle');
    const layout = await page.locator('body').boundingBox();
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(layout!.width);
  });

  test('Valid PDF upload succeeds and prevents duplicate submissions', async ({ page }) => {
    await page.getByRole('tab', { name: 'Upload' }).click({ force: true });
    
    // Get initial count
    const countCmd = `node "${path.resolve(__dirname, '../talentflow-backend/prisma/check_resume_count.js')}"`;
    const initialCount = parseInt(execSync(countCmd, { env: process.env }).toString().trim());

    // Playwright can interact directly with hidden file inputs if we use setInputFiles on the locator
    const fileInput = page.locator('input[type="file"]');
    
    // Perform rapid double interaction
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'valid-resume.pdf'));
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'valid-resume.pdf')).catch(() => {});
    

    // Check success
    await expect(page.getByText('Upload complete')).toBeVisible({ timeout: 15000 });
    
    // Check list updated (the file name appears in the component)
    await expect(page.getByText('valid-resume.pdf').first()).toBeVisible();

    // Verify DB count
    const finalCount = parseInt(execSync(countCmd, { env: process.env }).toString().trim());
    
    // Expected to be exactly 1 more
    expect(finalCount).toBe(initialCount + 1);
  });

  test('Invalid format is rejected', async ({ page }) => {
    await page.getByRole('tab', { name: 'Upload' }).click({ force: true });
    
    // The FileUpload component intercepts the file and checks type
    await page.locator('input[type="file"]').setInputFiles(path.join(__dirname, 'fixtures', 'invalid-format.txt'));
    
    // The toast message shows "Invalid file type"
    await expect(page.getByText(/Invalid file type/i)).toBeVisible();
  });

  test('Oversized file is rejected by backend', async ({ page }) => {
    await page.getByRole('tab', { name: 'Upload' }).click({ force: true });
    
    // 6MB PDF to bypass frontend 10MB limit but trigger backend 5MB limit
    await page.locator('input[type="file"]').setInputFiles(path.join(__dirname, 'fixtures', 'oversized-resume.pdf'));

    // Expect backend 400 rejection to bubble up to the toast
    await expect(page.getByText(/File is too large/i)).toBeVisible({ timeout: 15000 });
  });
});
