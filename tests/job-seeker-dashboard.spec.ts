import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../.auth/candidate.json') });

test.describe.skip('Job Seeker Dashboard', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate directly to dashboard, auth state is pre-loaded
    await page.goto('/job-seeker/dashboard');
  });

  test('should load all dashboard components successfully', async ({ page }) => {
    // Welcome Header
    await expect(page.locator('text=Welcome back')).toBeVisible();
    await expect(page.locator('text=Upload Resume').first()).toBeVisible();

    // Career Journey Timeline
    await expect(page.locator('text=Your Career Journey')).toBeVisible();
    await expect(page.locator('text=Sign Up')).toBeVisible();
    
    // Dashboard Statistics
    await expect(page.locator('text=Applied Jobs')).toBeVisible();
    await expect(page.locator('text=AI Match Score')).toBeVisible();

    // Profile Completion Meter
    await expect(page.locator('text=Profile Completion').first()).toBeVisible();
    
    // Resume Strength Widget
    await expect(page.locator('text=Resume Strength')).toBeVisible();
    await expect(page.locator('text=ATS Score')).toBeVisible();

    // AI Match Engine
    await expect(page.locator('text=Top AI Matches')).toBeVisible();
    
    // Application Tracker
    await expect(page.locator('text=Application Tracker')).toBeVisible();

    // Recommended Jobs
    await expect(page.locator('text=Recommended Jobs')).toBeVisible();

    // Learning Recommendations
    await expect(page.locator('text=Learning Recommendations')).toBeVisible();

    // Saved Jobs
    await expect(page.locator('text=Saved Jobs')).toBeVisible();

    // Interview Timeline
    await expect(page.locator('text=Interview Timeline')).toBeVisible();

    // Activity & Notifications
    await expect(page.locator('text=Notifications')).toBeVisible();
    await expect(page.locator('text=Activity')).toBeVisible();
  });

  test('should verify zero console errors during load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload({ waitUntil: 'networkidle' });
    expect(errors.length).toBe(0);
  });

  test.describe('Responsive Layouts', () => {
    
    test('should render properly on Mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      
      // Check that elements stack and there is no horizontal scroll on the body
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });

    test('should render properly on Tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });

    test('should render properly on Desktop (1440px)', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.reload();
      
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });
  });
});
