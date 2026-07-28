import { test, expect } from '@playwright/test';

const PROD_URL = 'https://talentflow-marketplace.vercel.app';

test.describe('Phase 15 — Notification Bell Functional Verification', () => {

  const roles = [
    { role: 'job-seeker', name: 'Candidate', path: '/job-seeker/dashboard' },
    { role: 'employer', name: 'Employer', path: '/employer/dashboard' },
    { role: 'freelancer', name: 'Freelancer', path: '/freelancer/dashboard' },
    { role: 'trainer', name: 'Trainer', path: '/trainer/dashboard' },
    { role: 'admin', name: 'Admin', path: '/admin/dashboard' },
  ];

  for (const item of roles) {
    test(`Notification Bell Opens Visibly for ${item.name}`, async ({ page, context }) => {
      await page.addInitScript((r) => {
        window.localStorage.setItem('access_token', `mock-${r}-token`);
        window.localStorage.setItem('user', JSON.stringify({
          id: `user-${r}-id`,
          email: `${r}@demo.com`,
          name: `Demo ${r}`,
          role: r.toUpperCase()
        }));
      }, item.role);

      await page.goto(`${PROD_URL}${item.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      const bell = page.locator('#notification-bell');
      await expect(bell).toBeVisible();

      // 1. Click Bell to Open Dropdown
      await bell.click();
      await page.waitForTimeout(400);

      const dropdownContent = page.locator('[data-slot="dropdown-menu-content"]');
      await expect(dropdownContent).toBeVisible();

      const box = await dropdownContent.boundingBox();
      expect(box, 'Notification dropdown bounding box missing').not.toBeNull();
      if (box) {
        expect(box.width, 'Dropdown width must be >= 280px').toBeGreaterThanOrEqual(280);
        expect(box.height, 'Dropdown height must be >= 100px').toBeGreaterThanOrEqual(100);
      }

      // 2. Click Bell again to Close Dropdown
      await bell.click();
      await page.waitForTimeout(300);
      await expect(dropdownContent).not.toBeVisible();
    });
  }

  test('Notification Bell Responsive Viewport Smoke Test across 6 Viewports', async ({ page }) => {
    const viewports = [320, 390, 768, 1024, 1366, 1920];

    await page.addInitScript(() => {
      window.localStorage.setItem('access_token', 'mock-candidate-token');
      window.localStorage.setItem('user', JSON.stringify({
        id: 'user-candidate-id',
        email: 'candidate@demo.com',
        name: 'Demo Candidate',
        role: 'CANDIDATE'
      }));
    });

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp, height: 800 });
      await page.goto(`${PROD_URL}/job-seeker/dashboard`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      const bell = page.locator('#notification-bell');
      if (await bell.isVisible()) {
        await bell.click();
        await page.waitForTimeout(400);

        const dropdown = page.locator('[data-slot="dropdown-menu-content"]');
        await expect(dropdown).toBeVisible();

        const box = await dropdown.boundingBox();
        expect(box, `Dropdown box at ${vp}px missing`).not.toBeNull();
        if (box) {
          expect(box.x + box.width, `Dropdown right edge at ${vp}px must be inside viewport`).toBeLessThanOrEqual(vp + 10);
        }
      }
    }
  });

});
