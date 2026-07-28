import { test, expect } from '@playwright/test';

const PROD_URL = 'https://talentflow-marketplace.vercel.app';
const VIEWPORTS = [320, 360, 375, 390, 412, 430, 768, 1024, 1280, 1366, 1440, 1920];

test.describe('Phase 14 — Automated Visual & Geometry Responsive Assertions on Find Jobs', () => {

  for (const width of VIEWPORTS) {
    test(`Find Jobs Page Layout & Input Geometry at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${PROD_URL}/find-jobs`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      // 1. Document overflow check
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - window.innerWidth;
      });
      expect(overflow, `Horizontal document overflow at ${width}px`).toBeLessThanOrEqual(5);

      // 2. Search container height check
      const searchForm = page.locator('form').first();
      await expect(searchForm).toBeVisible();
      const formBox = await searchForm.boundingBox();
      expect(formBox, 'Search form bounding box missing').not.toBeNull();
      if (formBox) {
        expect(formBox.height, `Search form container height at ${width}px must be >= 48px`).toBeGreaterThanOrEqual(48);
        expect(formBox.width, `Search form container width at ${width}px must be >= 280px`).toBeGreaterThanOrEqual(280);
      }

      // 3. Search submit button geometry check
      const searchBtn = page.locator('form button[type="submit"]').first();
      await expect(searchBtn).toBeVisible();
      const btnBox = await searchBtn.boundingBox();
      expect(btnBox, 'Search button bounding box missing').not.toBeNull();
      if (btnBox) {
        expect(btnBox.height, `Search button height at ${width}px must be >= 40px`).toBeGreaterThanOrEqual(40);
      }
    });
  }

});
