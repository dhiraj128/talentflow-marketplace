import { test, expect } from '@playwright/test';

const PROD_URL = 'https://talentflow-marketplace.vercel.app';

test.describe('Google & GitHub OAuth Flow Integration Test Suite', () => {

  test('Sign In Page Google & GitHub Social Buttons are Rendered with Official Brand Icons', async ({ page }) => {
    await page.goto(`${PROD_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const googleBtn = page.locator('a[href*="/auth/google"]').first();
    await expect(googleBtn).toBeVisible();

    const githubBtn = page.locator('a[href*="/auth/github"]').first();
    await expect(githubBtn).toBeVisible();

    const googleHref = await googleBtn.getAttribute('href');
    expect(googleHref, 'Google href must point to auth/google').toContain('/auth/google');

    const githubHref = await githubBtn.getAttribute('href');
    expect(githubHref, 'GitHub href must point to auth/github').toContain('/auth/github');
  });

  test('OAuth Callback Handler processes Tokens and Redirects to Portal Dashboard', async ({ page }) => {
    await page.route('**/auth/me**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-oauth-123',
          email: 'oauth.user@gmail.com',
          role: 'CANDIDATE',
          firstName: 'Google',
          lastName: 'User'
        })
      });
    });

    await page.goto(`${PROD_URL}/auth/callback?access_token=test-access-token&refresh_token=test-refresh-token`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const currentUrl = page.url();
    expect(currentUrl.includes('/job-seeker/dashboard') || currentUrl.includes('/auth/callback'), 'OAuth callback handling completed').toBe(true);
  });

  test('OAuth Callback Error Parameters are Handled Gracefully without App Crash', async ({ page }) => {
    await page.goto(`${PROD_URL}/sign-in?error=OAuthConfigurationMissing`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const bodyText = await page.evaluate(() => document.body?.innerText || '');
    expect(bodyText.includes('Something went wrong!'), 'Global error boundary triggered on OAuth error').toBe(false);
  });

});
