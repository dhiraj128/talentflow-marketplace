import { test, expect } from '@playwright/test';

test.describe('Advanced Search & Discovery', () => {
  
  test('Unified Search Box navigation and sync', async ({ page }) => {
    // Start at Jobs
    await page.goto('/find-jobs');
    
    // Check elements
    const searchInput = page.getByPlaceholder('Job title, skill, or company');
    await expect(searchInput).toBeVisible();
    
    // Type a keyword
    await searchInput.fill('React');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    
    // URL should have q=React
    await expect(page).toHaveURL(/.*q=React/);
    
    // Switch category to Freelancers
    await page.getByRole('button', { name: 'Jobs', exact: false }).click();
    await page.getByRole('menuitem', { name: 'Freelancers' }).click();
    
    // Should navigate to find-freelancers and preserve the query
    await expect(page).toHaveURL(/.*\/find-freelancers\?q=React/);
    await expect(page.getByPlaceholder('Freelancer skill or name')).toHaveValue('React');
  });

  test('Desktop Filter Sidebar interactions', async ({ page }) => {
    await page.goto('/find-jobs');
    
    // Click "Remote" filter in the sidebar
    const remoteCheckbox = page.locator('label').filter({ hasText: 'Remote' });
    await expect(remoteCheckbox).toBeVisible();
    await remoteCheckbox.click();
    
    // URL should update
    await expect(page).toHaveURL(/.*mode=Remote/);
    
    // Active chip should appear
    const activeChip = page.getByRole('button', { name: 'Remote' });
    await expect(activeChip).toBeVisible();
    
    // Clear filters
    await page.getByRole('button', { name: 'Clear all', exact: true }).first().click();
    
    // URL should reset
    await expect(page).not.toHaveURL(/.*mode=Remote/);
    await expect(activeChip).not.toBeVisible();
  });

  test('Mobile Filter Drawer', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/find-courses');
    
    // Open drawer
    const filterBtn = page.getByRole('button', { name: 'Filters', exact: false });
    await expect(filterBtn).toBeVisible();
    await filterBtn.click();
    
    // Verify Drawer is visible
    const sheetTitle = page.getByRole('heading', { name: 'Filters' });
    await expect(sheetTitle).toBeVisible();
    
    // Click a filter
    await page.locator('label').filter({ hasText: 'Beginner' }).click();
    
    // Click Apply
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    
    // Drawer closes and URL updates
    await expect(sheetTitle).not.toBeVisible();
    await expect(page).toHaveURL(/.*level=Beginner/);
  });

  test('Recent and Trending Searches', async ({ page }) => {
    await page.goto('/find-jobs');
    
    // Focus search input
    await page.getByPlaceholder('Job title, skill, or company').click();
    
    // See trending
    const trendingChip = page.getByRole('button', { name: 'React Developer' });
    await expect(trendingChip).toBeVisible();
    
    // Click trending chip
    await trendingChip.click();
    
    // Verify it searched
    await expect(page).toHaveURL(/.*q=React\+Developer/);
    
    // Focus again
    await page.getByPlaceholder('Job title, skill, or company').click();
    
    // Ensure "React Developer" is in suggestions because we typed it
    // Wait, recent searches only show when input is empty
    const clearBtn = page.locator('button').filter({ has: page.locator('svg.lucide-x') }).first();
    if (await clearBtn.isVisible()) {
        await clearBtn.click();
    }
    
    // Now Recent Searches should show
    const recentHeading = page.getByRole('heading', { name: 'Recent Searches' });
    await expect(recentHeading).toBeVisible();
    
    // "React Developer" should be in the list
    const recentItem = page.getByRole('button', { name: 'React Developer' }).nth(1); // skip the trending one if it still matches
    await expect(recentItem).toBeVisible();
  });

});
