import { test, expect } from '@playwright/test';

const PROD_URL = 'https://talentflow-marketplace.vercel.app';

test.describe('All Roles Notifications Live Verification', () => {

  const accounts = [
    { role: 'job-seeker', email: 'candidate@demo.com', pass: 'Talent@123', path: '/job-seeker/notifications' },
    { role: 'employer', email: 'employer@demo.com', pass: 'Talent@123', path: '/employer/notifications' },
    { role: 'freelancer', email: 'freelancer@demo.com', pass: 'Talent@123', path: '/freelancer/notifications' },
    { role: 'trainer', email: 'trainer@demo.com', pass: 'Talent@123', path: '/trainer/notifications' },
    { role: 'admin', email: 'admin@demo.com', pass: 'Talent@123', path: '/admin/notifications' },
  ];

  for (const acc of accounts) {
    test(`Verify Notifications for ${acc.role.toUpperCase()}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', err => pageErrors.push(err.stack || err.message));

      // Sign In
      await page.goto(`${PROD_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
      await page.fill('#email', acc.email);
      await page.fill('#password', acc.pass);
      await page.click('button[type="submit"]');

      await page.waitForTimeout(2500);

      // Navigate to role notifications page
      await page.goto(`${PROD_URL}${acc.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      const bodyText = await page.evaluate(() => document.body?.innerText || '');
      expect(bodyText.includes('Something went wrong!'), `${acc.role} notifications rendered global error boundary`).toBe(false);
      expect(pageErrors.length, `Unhandled page errors for ${acc.role}: ${pageErrors.join('; ')}`).toBe(0);
    });
  }

});
