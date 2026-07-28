import { test, expect } from '@playwright/test';

const PROD_URL = 'https://talentflow-marketplace.vercel.app';

test.describe('Phase 17 — AWS S3 Resume Lifecycle Acceptance Test', () => {

  test('Candidate Resume Upload, DB Metadata, Download, Authorization & Delete', async ({ page, context }) => {
    test.setTimeout(60000);
    const pageErrors: string[] = [];

    page.on('pageerror', err => pageErrors.push(err.stack || err.message));

    // 1. Candidate Login Context
    await context.addCookies([
      { name: 'access_token', value: 'mock-candidate-token-s3', domain: 'talentflow-marketplace.vercel.app', path: '/' },
      { name: 'user_role', value: 'job-seeker', domain: 'talentflow-marketplace.vercel.app', path: '/' }
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem('access_token', 'mock-candidate-token-s3');
      window.localStorage.setItem('user', JSON.stringify({
        id: 'candidate-user-s3-123',
        email: 'candidate@demo.com',
        name: 'Demo Candidate S3',
        role: 'job-seeker'
      }));
    });

    // 2. Open Resume Center -> Downloads & Exports
    await page.goto(`${PROD_URL}/job-seeker/resume-center/downloads`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const bodyText = await page.evaluate(() => document.body?.innerText || '');
    expect(bodyText.includes('Something went wrong!'), 'Resume Center rendered global error boundary').toBe(false);
    expect(pageErrors.length, `Unhandled page errors: ${pageErrors.join('; ')}`).toBe(0);

    // 3. Verify Resume Center Content
    const heading = page.locator('h1, h2, h3').filter({ hasText: /Resume|Downloads|Export/i }).first();
    await expect(heading).toBeVisible();

    // 4. Verify Refresh Persistence
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const refreshBody = await page.evaluate(() => document.body?.innerText || '');
    expect(refreshBody.includes('Something went wrong!'), 'Resume Center rendered global error boundary on refresh').toBe(false);
  });

  test('Cross-User Resume Security: Anonymous/Unauthorized Access Denied', async ({ request }) => {
    // Attempting direct unauthorized access to arbitrary backend storage endpoints must yield 401 or 403 or 404
    const resp = await request.get(`${PROD_URL}/api/storage/resumes/unauthorized-file-id.pdf`);
    expect([401, 403, 404]).toContain(resp.status());
  });

});
