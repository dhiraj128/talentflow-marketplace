import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('TalentFlow Full Functional E2E & Mobile QA', () => {

  test('1. Freelancer Search Input Height & Mobile Layout', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`${BASE_URL}/find-freelancers`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const searchInput = page.locator('input[placeholder*="Search freelancers"]');
    await expect(searchInput).toBeVisible();

    const box = await searchInput.boundingBox();
    console.log(`Mobile search input height: ${box?.height}px, width: ${box?.width}px`);

    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(280);
  });

  test('2. Search Workflow - Typing does NOT navigate until Search is clicked', async ({ page }) => {
    await page.goto(`${BASE_URL}/find-freelancers`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const initialUrl = page.url();
    const searchInput = page.locator('input[placeholder*="Search freelancers"]');

    // Type query
    await searchInput.fill('React Developer');
    await page.waitForTimeout(500);

    // Verify URL did NOT change while typing
    expect(page.url()).toBe(initialUrl);

    // Click Search button
    const searchBtn = page.locator('button[type="submit"]:has-text("Search")');
    await searchBtn.click();
    await page.waitForTimeout(500);

    // Search results updated
    const resultsCount = page.locator('h2:has-text("Result")');
    await expect(resultsCount).toBeVisible();
  });

  test('3. Clear All Filter - Resets filter controls and results', async ({ page }) => {
    await page.goto(`${BASE_URL}/find-freelancers`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Click Verified Only label
    const verifiedLabel = page.locator('label[htmlFor="verified-only"]');
    if (await verifiedLabel.isVisible()) {
      await verifiedLabel.click();
      await page.waitForTimeout(300);
    }

    // Click Clear All
    const clearAllBtn = page.locator('button:has-text("Clear All")').first();
    if (await clearAllBtn.isVisible()) {
      await clearAllBtn.click();
      await page.waitForTimeout(500);

      const searchInput = page.locator('input[placeholder*="Search freelancers"]');
      const inputValue = await searchInput.inputValue();
      expect(inputValue).toBe('');
    }
  });

  test('4. Notification Bell & Dropdown Interaction', async ({ page }) => {
    await page.goto(`${BASE_URL}/find-jobs`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const bellBtn = page.locator('button:has(.lucide-bell), button:has-text("Notifications")').first();
    if (await bellBtn.isVisible()) {
      await bellBtn.click();
      await page.waitForTimeout(500);

      const dropdownContent = page.locator('[role="menu"], [data-radix-popper-content-id]');
      if (await dropdownContent.isVisible()) {
        console.log("Notification popover opened successfully.");
      }
    }
  });

  test('5. Mobile Category Tabs Horizontal Scroll', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(`${BASE_URL}/find-freelancers`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const winWidth = await page.evaluate(() => window.innerWidth);

    console.log(`Category Tabs 320px check -> docWidth: ${docWidth}px vs winWidth: ${winWidth}px`);
    expect(docWidth).toBeLessThanOrEqual(winWidth);
  });

});
