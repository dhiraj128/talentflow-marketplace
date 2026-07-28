import { test, expect } from '@playwright/test';

const PROD_URL = 'https://talentflow-marketplace.vercel.app';

test.describe('Live Production Notifications Verification', () => {

  test('Verify Live Notifications Page & Header Bell on Deployed Production', async ({ page, context }) => {
    test.setTimeout(45000);
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', err => pageErrors.push(err.stack || err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await context.addCookies([
      { name: 'access_token', value: 'mock-candidate-token-123', domain: 'talentflow-marketplace.vercel.app', path: '/' },
      { name: 'user_role', value: 'job-seeker', domain: 'talentflow-marketplace.vercel.app', path: '/' }
    ]);

    await page.goto(`${PROD_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      window.localStorage.setItem('access_token', 'mock-candidate-token-123');
      window.localStorage.setItem('user', JSON.stringify({
        id: 'candidate-user-id-123',
        email: 'candidate@demo.com',
        name: 'Demo Candidate',
        role: 'job-seeker'
      }));
    });

    // 1. Direct URL Load
    await page.goto(`${PROD_URL}/job-seeker/notifications`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const bodyText = await page.evaluate(() => document.body?.innerText || '');
    expect(bodyText.includes('Something went wrong!'), 'Live production rendered global error boundary on direct load').toBe(false);
    expect(pageErrors.length, `Live page threw errors: ${pageErrors.join('; ')}`).toBe(0);

    // Verify page title
    const heading = page.locator('h1:has-text("Notifications")');
    await expect(heading).toBeVisible();

    // 2. Hard Refresh
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const refreshText = await page.evaluate(() => document.body?.innerText || '');
    expect(refreshText.includes('Something went wrong!'), 'Live production rendered global error boundary on refresh').toBe(false);

    // 3. Header Notification Bell
    const bellBtn = page.locator('#notification-bell');
    await expect(bellBtn).toBeVisible();
    await bellBtn.click();
    await page.waitForTimeout(600);

    const popoverVisible = await page.evaluate(() => {
      const el = document.querySelector('[data-slot="dropdown-menu-content"]');
      return !!el;
    });
    expect(popoverVisible, 'Notification bell popover did not open').toBe(true);
  });

});
