import { test, expect } from '@playwright/test';

const BASE_URL = 'https://talentflow-marketplace.vercel.app';
const NOTIFICATIONS_URL = `${BASE_URL}/job-seeker/notifications`;

test.describe('Notifications Page Intermittent Crash & Stability Audit', () => {

  test.beforeEach(async ({ context }) => {
    // Inject auth token cookie to bypass middleware redirect
    await context.addCookies([
      {
        name: 'access_token',
        value: 'mock-notifications-jwt-token',
        domain: 'talentflow-marketplace.vercel.app',
        path: '/',
      }
    ]);
  });

  test('20x Repeat Load Stability Test on Production Notifications Page', async ({ page }) => {
    const pageErrors: string[] = [];

    page.on('pageerror', err => {
      pageErrors.push(err.stack || err.message);
    });

    for (let i = 1; i <= 20; i++) {
      console.log(`Iteration ${i}/20: Loading ${NOTIFICATIONS_URL}...`);
      const resp = await page.goto(NOTIFICATIONS_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(800);

      const bodyText = await page.evaluate(() => document.body?.innerText || '');
      const isErrorBoundary = bodyText.includes('Something went wrong!');

      if (isErrorBoundary || pageErrors.length > 0) {
        console.log(`❌ FAIL on Iteration ${i}: Global error boundary rendered!`);
        console.log(`   Page Errors:`, JSON.stringify(pageErrors, null, 2));
      } else {
        console.log(`  Iteration ${i} PASS -> HTTP ${resp?.status()}`);
      }

      expect(isErrorBoundary, `Iteration ${i} rendered global error boundary "Something went wrong!"`).toBe(false);
      expect(pageErrors.length, `Iteration ${i} threw unhandled page error: ${pageErrors.join('; ')}`).toBe(0);
    }
  });

  test('Hard Refresh and Direct Navigation Test', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', err => pageErrors.push(err.stack || err.message));

    await page.goto(NOTIFICATIONS_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Perform hard refresh
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const bodyText = await page.evaluate(() => document.body?.innerText || '');
    expect(bodyText.includes('Something went wrong!')).toBe(false);
    expect(pageErrors.length).toBe(0);
  });

});
