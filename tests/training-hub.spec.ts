import { test, expect } from '@playwright/test';

test.describe.skip('Training Hub LMS', () => {

  test('should render course marketplace', async ({ page }) => {
    await page.goto('/find-courses');
    
    // Check if the page title is correct
    await expect(page.locator('h1')).toContainText('Course Marketplace');
    
    // Check if categories are rendered
    await expect(page.locator('text=Programming')).toBeVisible();
    
    // Check if courses are displayed (mock data)
    await expect(page.locator('text=Advanced React Patterns & Architecture')).toBeVisible();
  });

  test('should render course detail page', async ({ page }) => {
    await page.goto('/find-courses/react-adv');
    
    // Check if hero renders with course title
    await expect(page.locator('h1')).toContainText('Advanced React Patterns & Architecture');
    
    // Check for enroll button
    await expect(page.locator('text=Enroll Now')).toBeVisible();
  });

  test('should render learning player', async ({ page }) => {
    await page.goto('/job-seeker/learning/react-adv');
    
    // Check if player renders the sidebar and title
    await expect(page.locator('h2').first()).toBeVisible();
    
    // Next/Prev buttons in the player
    await expect(page.locator('text=Next')).toBeVisible();
  });

  test('should render certificates page', async ({ page }) => {
    await page.goto('/job-seeker/certificates');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('My Certificates');
    
    // Check if mock certificate is displayed
    await expect(page.locator('text=Advanced React Patterns & Architecture').first()).toBeVisible();
  });

});
