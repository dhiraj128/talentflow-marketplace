import { test, expect } from '@playwright/test';

test.describe('Admin Portal Features', () => {
  // Use existing admin auth state if available, otherwise just check rendering
  
  test('Admin Dashboard should render key metrics', async ({ page }) => {
    // Assuming the setup automatically signs us in or we bypass it for UI tests
    await page.goto('/admin/dashboard');
    
    // Check if the dashboard title is visible
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    
    // Check if key widgets are visible
    await expect(page.locator('text=Platform Health')).toBeVisible();
    await expect(page.locator('text=Recent Activity')).toBeVisible();
  });

  test('Master Data - Categories should render correctly', async ({ page }) => {
    await page.goto('/admin/settings/categories');
    await expect(page.locator('text=Category Management')).toBeVisible();
    await expect(page.locator('text=Add Category')).toBeVisible();
    
    // Check data table
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=Software Development')).toBeVisible();
  });

  test('Master Data - Skills should render correctly', async ({ page }) => {
    await page.goto('/admin/settings/skills');
    await expect(page.locator('text=Skills Management')).toBeVisible();
    await expect(page.locator('text=Add Skill')).toBeVisible();
    await expect(page.locator('text=React')).toBeVisible();
  });

  test('Coupons Management should render correctly', async ({ page }) => {
    await page.goto('/admin/settings/coupons');
    await expect(page.locator('text=Coupon Management')).toBeVisible();
    await expect(page.locator('text=Add Coupon')).toBeVisible();
    await expect(page.locator('text=SUMMER20')).toBeVisible();
  });

  test('Offers Management should render correctly', async ({ page }) => {
    await page.goto('/admin/settings/offers');
    await expect(page.locator('text=Offer Management')).toBeVisible();
    await expect(page.locator('text=Add Offer')).toBeVisible();
  });

  test('Pricing Plans should render correctly', async ({ page }) => {
    await page.goto('/admin/settings/plans');
    await expect(page.locator('text=Pricing Plans')).toBeVisible();
    await expect(page.locator('text=Add Plan')).toBeVisible();
  });

  test('Subscription Management should render correctly', async ({ page }) => {
    await page.goto('/admin/settings/subscriptions');
    await expect(page.locator('text=Subscription Management')).toBeVisible();
    await expect(page.locator('text=Expiry Tracker')).toBeVisible();
  });
});
