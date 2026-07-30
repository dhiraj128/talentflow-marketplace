import { test, expect } from '@playwright/test';

const PROD_URL = 'https://sispl.shop';

test.describe('Live Public Signup & Verification Removal Suite', () => {

  const roles = [
    { id: 'CANDIDATE', label: 'Job Seeker' },
    { id: 'EMPLOYER', label: 'Employer' },
    { id: 'FREELANCER', label: 'Freelancer' },
    { id: 'TRAINER', label: 'Trainer' }
  ];

  for (const r of roles) {
    test(`Public Signup for Role ${r.id} (${r.label}) Direct without Verification Method`, async ({ page }) => {
      const timestamp = Date.now();
      const email = `live.${r.id.toLowerCase()}.${timestamp}@demo.com`;
      const password = 'Password@123';
      const fullName = `Live ${r.label} User`;

      await page.goto(`${PROD_URL}/sign-up`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      // Verify no "Verification Method" text present
      const content = await page.content();
      expect(content.includes('Verification Method') && content.includes('How would you like to sign up?')).toBe(false);

      // 1. Select Role
      const roleBtn = page.locator(`button:has-text("${r.label}")`).first();
      await roleBtn.click();

      // 2. Click Continue button
      const continueBtn = page.locator('button:has-text("Continue")').first();
      await continueBtn.click();

      await page.waitForTimeout(500);

      // 3. Fill Direct Profile Registration Form
      await page.locator('input[placeholder="John Doe"]').fill(fullName);
      await page.locator('input[placeholder="name@example.com"]').fill(email);
      await page.locator('input[placeholder="Create a strong password (min 8 chars)"]').fill(password);
      await page.locator('input[placeholder="Confirm your password"]').fill(password);

      // 4. Submit
      const createBtn = page.locator('button:has-text("Create Account")').first();
      await createBtn.click();

      // 5. Wait for account creation & automatic login redirect
      await page.waitForTimeout(4000);
      const finalUrl = page.url();
      console.log(`Role ${r.id} post-signup URL:`, finalUrl);

      expect(
        finalUrl.includes('/dashboard') || finalUrl.includes('/job-seeker') || finalUrl.includes('/employer') || finalUrl.includes('/freelancer') || finalUrl.includes('/trainer') || finalUrl.includes('/sign-in'),
        `Role ${r.id} must navigate to role dashboard or sign-in cleanly without OTP prompt`
      ).toBe(true);
    });
  }

  test('Security: Public Signup rejects role=ADMIN', async ({ request }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://talentflow-backend-qn7b.onrender.com/api/v1';
    const res = await request.post(`${apiUrl}/auth/register`, {
      data: {
        email: `hacker.${Date.now()}@test.com`,
        password: 'Password@123',
        role: 'ADMIN'
      }
    });

    expect(res.status()).toBe(400);
  });

});
