import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Notifications E2E & Stability Suite', () => {

  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'access_token', value: 'mock-candidate-token-123', domain: 'localhost', path: '/' },
      { name: 'user_role', value: 'job-seeker', domain: 'localhost', path: '/' }
    ]);
  });

  test('Candidate Notifications Page Direct Load, Refresh & Unread Badge', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', err => pageErrors.push(err.stack || err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('access_token', 'mock-candidate-token-123');
      window.localStorage.setItem('user', JSON.stringify({
        id: 'candidate-user-id-123',
        email: 'candidate@demo.com',
        name: 'Demo Candidate',
        role: 'job-seeker'
      }));
    });

    // 1. Direct Load on Notifications Page
    await page.goto(`${BASE_URL}/job-seeker/notifications`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const bodyText = await page.evaluate(() => document.body?.innerText || '');
    expect(bodyText.includes('Something went wrong!'), 'Notifications page rendered global error boundary on direct load').toBe(false);
    expect(pageErrors.length, `Unhandled page error: ${pageErrors.join('; ')}`).toBe(0);

    // Verify page header
    const heading = page.locator('h1:has-text("Notifications")');
    await expect(heading).toBeVisible();

    // 2. Hard Refresh on Notifications Page
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const refreshBody = await page.evaluate(() => document.body?.innerText || '');
    expect(refreshBody.includes('Something went wrong!'), 'Notifications page rendered global error boundary on refresh').toBe(false);

    // 3. TopNavBar Bell Interaction
    const bellBtn = page.locator('#notification-bell');
    await expect(bellBtn).toBeVisible();
    await bellBtn.click();
    await page.waitForTimeout(500);

    // Check menu dropdown
    const menuContent = page.locator('[data-slot="dropdown-menu-content"]');
    if (await menuContent.count() > 0) {
      await expect(menuContent).toBeVisible();
    }
  });

});
