import { test, expect } from '@playwright/test';

const PROD_URL = 'https://talentflow-marketplace.vercel.app';

test.describe('Phase 13 — Notifications Production Regression Suite', () => {

  test('Candidate Login -> Dashboard -> Bell -> Notifications -> Refresh Navigation Iterations', async ({ page }) => {
    test.setTimeout(90000);

    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', err => pageErrors.push(err.stack || err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // 1. Candidate Login
    await page.goto(`${PROD_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    await page.fill('#email', 'candidate@demo.com');
    await page.fill('#password', 'Talent@123');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2500);
    expect(page.url().includes('/job-seeker') || page.url().includes('/dashboard'), 'Failed to sign in').toBe(true);

    // 2. Repeat navigation sequence 5 times
    for (let i = 1; i <= 5; i++) {
      // Dashboard -> Bell -> Notifications
      await page.goto(`${PROD_URL}/job-seeker/dashboard`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(800);

      const bell = page.locator('#notification-bell');
      if (await bell.isVisible()) {
        await bell.click().catch(() => {});
        await page.waitForTimeout(400);
      }

      await page.goto(`${PROD_URL}/job-seeker/notifications`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(800);

      const notifText = await page.evaluate(() => document.body?.innerText || '');
      expect(notifText.includes('Something went wrong!'), `Iteration ${i}: Rendered global error boundary on Notifications`).toBe(false);

      // Hard Refresh
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(800);

      const refreshText = await page.evaluate(() => document.body?.innerText || '');
      expect(refreshText.includes('Something went wrong!'), `Iteration ${i}: Rendered global error boundary on Refresh`).toBe(false);
    }

    // Zero page errors
    expect(pageErrors.length, `Page errors detected: ${pageErrors.join('; ')}`).toBe(0);
  });

});
