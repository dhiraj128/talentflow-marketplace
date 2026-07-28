# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: prod-notifications-live.spec.ts >> Live Production Notifications Verification >> Verify Live Notifications Page & Header Bell on Deployed Production
- Location: tests\prod-notifications-live.spec.ts:7:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1:has-text("Notifications")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1:has-text("Notifications")')

```

```yaml
- banner:
  - link "T TalentFlow":
    - /url: /
  - navigation:
    - link "Find Jobs":
      - /url: /find-jobs
    - link "Freelancers":
      - /url: /find-freelancers
    - link "Courses":
      - /url: /find-courses
    - link "Find Talent":
      - /url: /find-talent
  - link "Sign In":
    - /url: /sign-in
    - button "Sign In"
  - link "Get Started":
    - /url: /sign-up
    - button "Get Started"
- main:
  - img
  - heading "Find Better Talent. Build Better Careers." [level=1]
  - paragraph: The complete hiring ecosystem for professionals, employers, freelancers and trainers.
  - text: 20,000 + Verified Professionals 5,000 + Companies 3,000 + Freelancers 800 + Training Programs TalentFlow Analytics Overview +48% Hires
  - img
  - img
  - text: Talent Match 92% Match Score Active Candidates 1,420 Live
  - paragraph: "\"TalentFlow reduced hiring time by 70%. The verified talent pool is unmatched.\""
  - text: HR HR Director Enterprise Customer
  - heading "Welcome back" [level=2]
  - paragraph: Select your role and sign in to continue
  - button "Job Seeker"
  - button "Employer"
  - button "Freelancer"
  - button "Trainer"
  - button "Administrator"
  - text: Email or Mobile Number
  - textbox "Email or Mobile Number":
    - /placeholder: name@example.com or 9876543210
  - text: Password
  - link "Forgot password?":
    - /url: /forgot-password
  - textbox "Password"
  - button "Sign In"
  - text: Or continue with
  - link "Google":
    - /url: https://talentflow-backend-qn7b.onrender.com/api/v1/auth/google
  - link "GitHub":
    - /url: https://talentflow-backend-qn7b.onrender.com/api/v1/auth/github
  - text: Don't have an account?
  - link "Sign up":
    - /url: /sign-up
  - text: Identity Verification
  - paragraph: Upload ANY ONE government-issued identity document.
  - text: Aadhaar PAN Passport Driving Licence Voter ID
  - paragraph: One verified government-issued identity document is sufficient.
  - text: 256-bit SSL JWT Authentication Secure Payments SOC 2 Ready GDPR Ready
- contentinfo:
  - text: TalentFlow
  - paragraph: Your Career Ecosystem — All in One Place. Connect with verified employers, freelance projects, and certified training programs.
  - paragraph: Powered by TalentFlow Platform
  - heading "Platform" [level=3]
  - list:
    - listitem:
      - link "Find Jobs":
        - /url: /find-jobs
    - listitem:
      - link "Freelancers":
        - /url: /find-freelancers
    - listitem:
      - link "Training":
        - /url: /find-courses
    - listitem:
      - link "Employers":
        - /url: /find-talent
  - heading "Company" [level=3]
  - list:
    - listitem:
      - link "About Us":
        - /url: /about
    - listitem:
      - link "Blog":
        - /url: /blog
    - listitem:
      - link "Career Resources":
        - /url: /careers
    - listitem:
      - link "Contact":
        - /url: /contact
  - heading "Legal" [level=3]
  - list:
    - listitem:
      - link "Privacy Policy":
        - /url: /privacy
    - listitem:
      - link "Terms & Conditions":
        - /url: /terms
    - listitem:
      - link "Cookie Policy":
        - /url: /cookie
  - paragraph: TalentFlow Marketplace © 2026. All rights reserved.
  - link "Twitter":
    - /url: "#"
  - link "LinkedIn":
    - /url: "#"
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const PROD_URL = 'https://talentflow-marketplace.vercel.app';
  4  | 
  5  | test.describe('Live Production Notifications Verification', () => {
  6  | 
  7  |   test('Verify Live Notifications Page & Header Bell on Deployed Production', async ({ page, context }) => {
  8  |     test.setTimeout(45000);
  9  |     const pageErrors: string[] = [];
  10 |     const consoleErrors: string[] = [];
  11 | 
  12 |     page.on('pageerror', err => pageErrors.push(err.stack || err.message));
  13 |     page.on('console', msg => {
  14 |       if (msg.type() === 'error') consoleErrors.push(msg.text());
  15 |     });
  16 | 
  17 |     await context.addCookies([
  18 |       { name: 'access_token', value: 'mock-candidate-token-123', domain: 'talentflow-marketplace.vercel.app', path: '/' },
  19 |       { name: 'user_role', value: 'job-seeker', domain: 'talentflow-marketplace.vercel.app', path: '/' }
  20 |     ]);
  21 | 
  22 |     await page.goto(`${PROD_URL}/sign-in`, { waitUntil: 'domcontentloaded' });
  23 |     await page.evaluate(() => {
  24 |       window.localStorage.setItem('access_token', 'mock-candidate-token-123');
  25 |       window.localStorage.setItem('user', JSON.stringify({
  26 |         id: 'candidate-user-id-123',
  27 |         email: 'candidate@demo.com',
  28 |         name: 'Demo Candidate',
  29 |         role: 'job-seeker'
  30 |       }));
  31 |     });
  32 | 
  33 |     // 1. Direct URL Load
  34 |     await page.goto(`${PROD_URL}/job-seeker/notifications`, { waitUntil: 'domcontentloaded' });
  35 |     await page.waitForTimeout(1500);
  36 | 
  37 |     const bodyText = await page.evaluate(() => document.body?.innerText || '');
  38 |     expect(bodyText.includes('Something went wrong!'), 'Live production rendered global error boundary on direct load').toBe(false);
  39 |     expect(pageErrors.length, `Live page threw errors: ${pageErrors.join('; ')}`).toBe(0);
  40 | 
  41 |     // Verify page title
  42 |     const heading = page.locator('h1:has-text("Notifications")');
> 43 |     await expect(heading).toBeVisible();
     |                           ^ Error: expect(locator).toBeVisible() failed
  44 | 
  45 |     // 2. Hard Refresh
  46 |     await page.reload({ waitUntil: 'domcontentloaded' });
  47 |     await page.waitForTimeout(1000);
  48 | 
  49 |     const refreshText = await page.evaluate(() => document.body?.innerText || '');
  50 |     expect(refreshText.includes('Something went wrong!'), 'Live production rendered global error boundary on refresh').toBe(false);
  51 | 
  52 |     // 3. Header Notification Bell
  53 |     const bellBtn = page.locator('#notification-bell');
  54 |     await expect(bellBtn).toBeVisible();
  55 |     await bellBtn.click();
  56 |     await page.waitForTimeout(600);
  57 | 
  58 |     const popoverVisible = await page.evaluate(() => {
  59 |       const el = document.querySelector('[data-slot="dropdown-menu-content"]');
  60 |       return !!el;
  61 |     });
  62 |     expect(popoverVisible, 'Notification bell popover did not open').toBe(true);
  63 |   });
  64 | 
  65 | });
  66 | 
```