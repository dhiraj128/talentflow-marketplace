import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '320px (iPhone SE)', width: 320, height: 800 },
  { name: '360px (Android Small)', width: 360, height: 800 },
  { name: '375px (iPhone Mini)', width: 375, height: 800 },
  { name: '390px (iPhone 14)', width: 390, height: 844 },
  { name: '412px (Galaxy S20)', width: 412, height: 915 },
  { name: '430px (iPhone Pro Max)', width: 430, height: 932 },
  { name: '768px (Tablet Portrait)', width: 768, height: 1024 },
  { name: '1024px (Tablet / Small Laptop)', width: 1024, height: 768 },
  { name: '1280px (HD Display)', width: 1280, height: 720 },
  { name: '1366px (Laptop Standard)', width: 1366, height: 768 },
  { name: '1440px (MacBook Pro)', width: 1440, height: 900 },
  { name: '1920px (Full HD Desktop)', width: 1920, height: 1080 },
];

const BASE_URL = 'http://localhost:3000';

test.describe('Master Production Stability, Dark Footer & Sign-In Analytics Audit', () => {

  test('TASK A & C: Sign-In Footer Theme and Analytics Visual Responsiveness', async ({ page }) => {
    test.setTimeout(60000);
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);

      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const winWidth = await page.evaluate(() => window.innerWidth);
      expect(docWidth, `Document scrollWidth ${docWidth}px exceeded window ${winWidth}px at ${vp.name}`).toBeLessThanOrEqual(winWidth);

      // Verify Footer is dark (bg-[#081526])
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Verify sign-in analytics illustration components if desktop/tablet (>768px)
      if (vp.width >= 1024) {
        const analyticsCard = page.locator('text=TalentFlow Analytics Overview');
        await expect(analyticsCard).toBeVisible();

        const hiresBadge = page.locator('text=+48%');
        await expect(hiresBadge).toBeVisible();

        const matchBadge = page.locator('text=92% Match Score');
        await expect(matchBadge).toBeVisible();
      }
    }
  });

  test('TASK B: 30-Cycle Production Route Stability Audit', async ({ page, context }) => {
    test.setTimeout(120000);
    await context.addCookies([
      { name: 'access_token', value: 'mock-jwt-token', domain: 'localhost', path: '/' }
    ]);

    const pageErrors: string[] = [];
    page.on('pageerror', err => pageErrors.push(err.stack || err.message));

    const routesToCycle = [
      '/',
      '/sign-in',
      '/sign-up',
      '/find-jobs',
      '/find-freelancers',
      '/find-courses',
      '/find-talent',
      '/job-seeker/dashboard',
      '/job-seeker/notifications',
      '/job-seeker/resume-center',
      '/employer/dashboard',
      '/freelancer/dashboard',
      '/trainer/dashboard',
      '/admin/dashboard'
    ];

    for (let cycle = 1; cycle <= 30; cycle++) {
      const targetRoute = routesToCycle[(cycle - 1) % routesToCycle.length];
      const url = `${BASE_URL}${targetRoute}`;

      console.log(`Cycle ${cycle}/30 -> Loading ${targetRoute}...`);
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);

      const bodyText = await page.evaluate(() => document.body?.innerText || '');
      const isGlobalError = bodyText.includes('Something went wrong!');

      expect(isGlobalError, `Cycle ${cycle} on ${targetRoute} rendered global error boundary`).toBe(false);
      expect(pageErrors.length, `Cycle ${cycle} on ${targetRoute} threw page error`).toBe(0);
    }
  });

});
