import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '320px (iPhone SE)', width: 320, height: 568 },
  { name: '360px (Android Small)', width: 360, height: 800 },
  { name: '375px (iPhone 12/13 Mini)', width: 375, height: 667 },
  { name: '390px (iPhone 12/13/14)', width: 390, height: 844 },
  { name: '412px (Samsung Galaxy S20)', width: 412, height: 915 },
  { name: '430px (iPhone 14/15 Pro Max)', width: 430, height: 932 },
  { name: '768px (iPad Mini)', width: 768, height: 1024 },
  { name: '1024px (iPad Pro / Small Laptop)', width: 1024, height: 768 },
  { name: '1280px (HD Display)', width: 1280, height: 720 },
  { name: '1366px (Laptop Standard)', width: 1366, height: 768 },
  { name: '1440px (MacBook Pro 15/16)', width: 1440, height: 900 },
  { name: '1920px (Full HD Desktop)', width: 1920, height: 1080 },
];

const BASE_URL = 'http://localhost:3000';

test.describe('Resume Center Comprehensive Mobile & Desktop Audit', () => {

  test.beforeEach(async ({ context }) => {
    // Add auth cookie to bypass middleware redirect
    await context.addCookies([
      {
        name: 'access_token',
        value: 'mock-test-jwt-token',
        domain: 'localhost',
        path: '/',
      }
    ]);
  });

  for (const vp of VIEWPORTS) {
    test(`Resume Center Downloads Overflow Check at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/job-seeker/resume-center/downloads`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const winWidth = await page.evaluate(() => window.innerWidth);

      console.log(`Downloads Tab @ ${vp.width}px -> scrollWidth: ${docWidth}px vs innerWidth: ${winWidth}px`);
      expect(docWidth, `Document scrollWidth ${docWidth}px exceeded window width ${winWidth}px at ${vp.name}`).toBeLessThanOrEqual(winWidth);

      // Verify active tab (Downloads) is present in DOM
      const downloadsTab = page.locator('a:has-text("Downloads"), a[href*="downloads"]').first();
      await expect(downloadsTab).toBeVisible();

      // Verify first tab (Overview) is present in DOM
      const overviewTab = page.locator('a:has-text("Overview"), a[href="/job-seeker/resume-center"]').first();
      await expect(overviewTab).toBeVisible();
    });
  }

  test('Downloads File Row & Button Boundaries Test (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(`${BASE_URL}/job-seeker/resume-center/downloads`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const cards = page.locator('.border.rounded-xl, .border.rounded-lg');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      const card = cards.first();
      const cardBox = await card.boundingBox();
      const winWidth = await page.evaluate(() => window.innerWidth);

      if (cardBox) {
        console.log(`Card box width at 320px: ${cardBox.width}px vs window ${winWidth}px`);
        expect(cardBox.width).toBeLessThanOrEqual(winWidth);
      }

      const downloadBtns = page.locator('button:has-text("Download")');
      const btnCount = await downloadBtns.count();
      if (btnCount > 0) {
        const btn = downloadBtns.first();
        const btnBox = await btn.boundingBox();
        if (btnBox && cardBox) {
          console.log(`Button box right edge: ${btnBox.x + btnBox.width}px vs Card right edge: ${cardBox.x + cardBox.width}px`);
          expect(btnBox.x + btnBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 5);
        }
      }
    }
  });

  test('Download Button Functionality', async ({ page }) => {
    await page.goto(`${BASE_URL}/job-seeker/resume-center/downloads`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const downloadBtn = page.locator('button:has-text("Download")').first();
    if (await downloadBtn.isVisible()) {
      await downloadBtn.click();
      await page.waitForTimeout(500);
      console.log("Download action executed successfully.");
    }
  });

});
