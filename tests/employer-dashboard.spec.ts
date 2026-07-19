import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../.auth/employer-a.json') });

test.describe.skip('Employer Portal 2.0 (Phase 5)', () => {

  test('should display Employer Dashboard with premium widgets', async ({ page }) => {
    // Navigate to Employer Dashboard
    await page.goto('/employer/dashboard');
    
    // Verify Welcome Header
    await expect(page.locator('text=Welcome back')).toBeVisible();

    // Verify Verification Widget
    await expect(page.locator('text=Verification Status')).toBeVisible();
    await expect(page.locator('text=Under Review')).toBeVisible(); // Mocked state

    // Verify Stats
    await expect(page.locator('text=Active Jobs')).toBeVisible();
    await expect(page.locator('text=AI Accuracy')).toBeVisible();

    // Verify Hiring Funnel
    await expect(page.locator('text=Hiring Funnel')).toBeVisible();
    await expect(page.locator('text=Jobs Posted')).toBeVisible();

    // Verify AI Candidate Recommendations
    await expect(page.locator('text=AI Candidate Recommendations')).toBeVisible();
    
    // Check that we have a mock candidate
    await expect(page.locator('text=Alex Johnson').first()).toBeVisible();

    // Verify Hiring Analytics
    await expect(page.locator('text=Applications Trend')).toBeVisible();
    
    // Verify Recent Applications Table/Cards
    await expect(page.locator('text=Recent Applications').first()).toBeVisible();

    // Verify Interview Schedule
    await expect(page.locator('text=Interview Schedule')).toBeVisible();
    
    // Verify Shortlisted Candidates
    await expect(page.locator('text=Shortlisted Candidates')).toBeVisible();
    
    // Verify Notifications & Activity
    await expect(page.locator('text=Notifications')).toBeVisible();
    await expect(page.locator('text=Activity Feed')).toBeVisible();
  });

  test('should navigate Post Job Wizard', async ({ page }) => {
    await page.goto('/employer/post-job');
    
    // Verify initial step
    await expect(page.locator('text=Basic Details').first()).toBeVisible();
    await page.fill('#title', 'Senior Playwright Engineer');
    await page.fill('#location', 'Remote');
    
    // Next Step: Hiring Type
    await page.click('button:has-text("Next")');
    await expect(page.locator('text=Hiring Type').first()).toBeVisible();
    await page.click('text=Full-time');
    
    // Next Step: Compensation
    await page.click('button:has-text("Next")');
    await expect(page.locator('text=Compensation & Experience').first()).toBeVisible();
    await page.fill('#salaryRange', '$120k - $150k');
    
    // Next Step: Skills
    await page.click('button:has-text("Next")');
    await expect(page.locator('text=Skills & AI Matching').first()).toBeVisible();
    
    // Next Step: Description
    await page.click('button:has-text("Next")');
    await expect(page.locator('text=Job Description').first()).toBeVisible();
    await page.fill('#description', 'Great company, great benefits.');
    
    // Next Step: Preview
    await page.click('button:has-text("Next")');
    await expect(page.locator('text=Senior Playwright Engineer')).toBeVisible();
    await expect(page.locator('text=Submit for Approval')).toBeVisible();
  });

});
