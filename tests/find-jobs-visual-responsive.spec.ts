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

      // 2. Keyword input geometry check
      const keywordInput = page.locator('input[placeholder*="Job title"]').first();
      await expect(keywordInput).toBeVisible();
      const inputBox = await keywordInput.boundingBox();
      expect(inputBox, 'Keyword input bounding box missing').not.toBeNull();
      if (inputBox) {
        expect(inputBox.height, `Input height at ${width}px must be >= 40px`).toBeGreaterThanOrEqual(40);
        expect(inputBox.width, `Input width at ${width}px must be >= 180px`).toBeGreaterThanOrEqual(180);
      }

      // 3. Search button geometry check
      const searchBtn = page.locator('button:has-text("Search")').first();
      await expect(searchBtn).toBeVisible();
      const btnBox = await searchBtn.boundingBox();
      expect(btnBox, 'Search button bounding box missing').not.toBeNull();
      if (btnBox) {
        expect(btnBox.height, `Search button height at ${width}px must be >= 40px`).toBeGreaterThanOrEqual(40);
      }

      // 4. Overlap check helper
      if (width >= 768 && inputBox && btnBox) {
        // On desktop, search button and input should not collide in top position
        const yOverlap = Math.abs(inputBox.y - btnBox.y);
        expect(yOverlap, `Vertical misalignment on desktop at ${width}px`).toBeLessThan(30);
      }
    });
  }

});
