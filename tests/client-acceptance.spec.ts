import { test, expect } from '@playwright/test';

const PROD_URL = 'https://talentflow-marketplace.vercel.app';

test.describe('Phase 16 — Master Client Acceptance E2E Suite', () => {

  test('Public Marketplace Workflows: Job Search, Freelancers, Courses & Employers', async ({ page }) => {
    test.setTimeout(45000);
    const pageErrors: string[] = [];

    page.on('pageerror', err => pageErrors.push(err.stack || err.message));

    // 1. Landing Page
    await page.goto(`${PROD_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const brand = page.locator('text=TalentFlow').first();
    await expect(brand).toBeVisible();

    // 2. Find Jobs
    await page.goto(`${PROD_URL}/find-jobs`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // 3. Find Freelancers
    await page.goto(`${PROD_URL}/find-freelancers`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // 4. Find Courses
    await page.goto(`${PROD_URL}/find-courses`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // 5. Find Talent
    await page.goto(`${PROD_URL}/find-talent`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    expect(pageErrors.length, `Unhandled page errors: ${pageErrors.join('; ')}`).toBe(0);
  });

  const roles = [
    { role: 'candidate', path: '/job-seeker/dashboard' },
    { role: 'employer', path: '/employer/dashboard' },
    { role: 'freelancer', path: '/freelancer/dashboard' },
    { role: 'trainer', path: '/trainer/dashboard' },
    { role: 'admin', path: '/admin/dashboard' },
  ];

  for (const item of roles) {
    test(`Portal Dashboard Check for ${item.role.toUpperCase()}`, async ({ browser }) => {
      const context = await browser.newContext();
      await context.addCookies([
        { name: 'access_token', value: `mock-${item.role}-token`, domain: 'talentflow-marketplace.vercel.app', path: '/' },
        { name: 'user_role', value: item.role === 'candidate' ? 'job-seeker' : item.role, domain: 'talentflow-marketplace.vercel.app', path: '/' }
      ]);

      const page = await context.newPage();
      await page.addInitScript((r) => {
        window.localStorage.setItem('access_token', `mock-${r}-token`);
        window.localStorage.setItem('user', JSON.stringify({
          id: `user-${r}-id`,
          email: `${r}@demo.com`,
          name: `Demo ${r}`,
          role: r === 'candidate' ? 'job-seeker' : r
        }));
      }, item.role);

      await page.goto(`${PROD_URL}${item.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(800);

      const bodyText = await page.evaluate(() => document.body?.innerText || '');
      expect(bodyText.includes('Something went wrong!'), `Dashboard ${item.path} rendered global error boundary`).toBe(false);

      await context.close();
    });
  }

});
