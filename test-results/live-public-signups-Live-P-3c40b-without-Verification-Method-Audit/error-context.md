# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-public-signups.spec.ts >> Live Public Signup & Verification Removal Suite >> Public Signup for Role FREELANCER (Freelancer) Direct without Verification Method
- Location: tests\live-public-signups.spec.ts:16:9

# Error details

```
Error: Role FREELANCER must navigate to role dashboard or sign-in cleanly without OTP prompt

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - link "T TalentFlow" [ref=e6] [cursor=pointer]:
            - /url: /
            - generic [ref=e7]: T
            - generic [ref=e8]: TalentFlow
          - navigation [ref=e9]:
            - link "Find Jobs" [ref=e10] [cursor=pointer]:
              - /url: /find-jobs
            - link "Freelancers" [ref=e11] [cursor=pointer]:
              - /url: /find-freelancers
            - link "Courses" [ref=e12] [cursor=pointer]:
              - /url: /find-courses
            - link "Find Talent" [ref=e13] [cursor=pointer]:
              - /url: /find-talent
        - generic [ref=e14]:
          - link "Sign In" [ref=e15] [cursor=pointer]:
            - /url: /sign-in
            - button "Sign In" [ref=e16]
          - link "Get Started" [ref=e17] [cursor=pointer]:
            - /url: /sign-up
            - button "Get Started" [ref=e18]
    - main [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e22]:
          - generic:
            - img
          - generic [ref=e23]:
            - heading "Find Better Talent. Build Better Careers." [level=1] [ref=e25]:
              - text: Find Better
              - text: Talent.
              - text: Build Better
              - text: Careers.
            - paragraph [ref=e27]: The complete hiring ecosystem for professionals, employers, freelancers and trainers.
            - generic [ref=e28]:
              - generic [ref=e29]:
                - img [ref=e31]
                - generic [ref=e36]:
                  - generic [ref=e37]: 20,000
                  - generic [ref=e38]: +
                - generic [ref=e39]: Verified Professionals
              - generic [ref=e40]:
                - img [ref=e42]
                - generic [ref=e46]:
                  - generic [ref=e47]: 5,000
                  - generic [ref=e48]: +
                - generic [ref=e49]: Companies
              - generic [ref=e50]:
                - img [ref=e52]
                - generic [ref=e55]:
                  - generic [ref=e56]: 3,000
                  - generic [ref=e57]: +
                - generic [ref=e58]: Freelancers
              - generic [ref=e59]:
                - img [ref=e61]
                - generic [ref=e63]:
                  - generic [ref=e64]: "800"
                  - generic [ref=e65]: +
                - generic [ref=e66]: Training Programs
            - generic [ref=e67]:
              - generic [ref=e68]:
                - generic [ref=e69]:
                  - img [ref=e70]
                  - generic [ref=e73]: TalentFlow Analytics Overview
                - generic [ref=e74]:
                  - img [ref=e75]
                  - generic [ref=e78]: +48%
                  - generic [ref=e79]: Hires
              - img [ref=e81]
              - generic [ref=e84]:
                - generic [ref=e85]:
                  - img [ref=e87]
                  - generic [ref=e90]:
                    - generic [ref=e91]: Talent Match
                    - generic [ref=e92]: 92% Match Score
                - generic [ref=e93]:
                  - generic [ref=e94]: Active Candidates
                  - generic [ref=e95]: 1,420 Live
            - generic [ref=e96]:
              - generic [ref=e98]:
                - img [ref=e99]
                - img [ref=e101]
                - img [ref=e103]
                - img [ref=e105]
                - img [ref=e107]
              - paragraph [ref=e109]: "\"TalentFlow reduced hiring time by 70%. The verified talent pool is unmatched.\""
              - generic [ref=e110]:
                - generic [ref=e111]: HR
                - generic [ref=e112]:
                  - generic [ref=e113]: HR Director
                  - generic [ref=e114]: Enterprise Customer
        - generic [ref=e117]:
          - button "Back to Roles" [ref=e118]:
            - img [ref=e119]
            - text: Back to Roles
          - generic [ref=e122]:
            - generic [ref=e123]:
              - heading "Complete Profile" [level=2] [ref=e124]
              - paragraph [ref=e125]: Create your Freelancer account
            - generic [ref=e126]:
              - img [ref=e127]
              - text: Please verify your email/phone before registering.
            - generic [ref=e129]:
              - generic [ref=e130]:
                - generic [ref=e131]: Full Name
                - textbox "John Doe" [ref=e132]: Live Freelancer User
              - generic [ref=e133]:
                - generic [ref=e134]: Email Address
                - textbox "name@example.com" [ref=e135]: live.freelancer.1785350484284@demo.com
              - generic [ref=e136]:
                - generic [ref=e137]: Create Password
                - generic [ref=e138]:
                  - generic [ref=e139]:
                    - textbox "Create a strong password (min 8 chars)" [ref=e140]: Password@123
                    - button "Show password" [ref=e141]:
                      - img
                      - generic [ref=e142]: Show password
                  - generic [ref=e143]:
                    - paragraph [ref=e144]: "Password must contain:"
                    - list [ref=e145]:
                      - listitem [ref=e146]:
                        - img [ref=e147]
                        - generic [ref=e149]: At least 8 characters
                      - listitem [ref=e150]:
                        - img [ref=e151]
                        - generic [ref=e153]: One uppercase letter
                      - listitem [ref=e154]:
                        - img [ref=e155]
                        - generic [ref=e157]: One lowercase letter
                      - listitem [ref=e158]:
                        - img [ref=e159]
                        - generic [ref=e161]: One number
                      - listitem [ref=e162]:
                        - img [ref=e163]
                        - generic [ref=e165]: One special character
              - generic [ref=e166]:
                - generic [ref=e167]: Confirm Password
                - generic [ref=e169]:
                  - textbox "Confirm your password" [ref=e170]: Password@123
                  - button "Show password" [ref=e171]:
                    - img
                    - generic [ref=e172]: Show password
            - button "Create Account" [ref=e173]
    - contentinfo [ref=e174]:
      - generic [ref=e175]:
        - generic [ref=e176]:
          - generic [ref=e177]:
            - text: TalentFlow
            - paragraph [ref=e178]: Your Career Ecosystem — All in One Place. Connect with verified employers, freelance projects, and certified training programs.
            - paragraph [ref=e179]: Powered by TalentFlow Platform
          - generic [ref=e180]:
            - heading "Platform" [level=3] [ref=e181]
            - list [ref=e182]:
              - listitem [ref=e183]:
                - link "Find Jobs" [ref=e184] [cursor=pointer]:
                  - /url: /find-jobs
              - listitem [ref=e185]:
                - link "Freelancers" [ref=e186] [cursor=pointer]:
                  - /url: /find-freelancers
              - listitem [ref=e187]:
                - link "Training" [ref=e188] [cursor=pointer]:
                  - /url: /find-courses
              - listitem [ref=e189]:
                - link "Employers" [ref=e190] [cursor=pointer]:
                  - /url: /find-talent
          - generic [ref=e191]:
            - heading "Company" [level=3] [ref=e192]
            - list [ref=e193]:
              - listitem [ref=e194]:
                - link "About Us" [ref=e195] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e196]:
                - link "Blog" [ref=e197] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e198]:
                - link "Career Resources" [ref=e199] [cursor=pointer]:
                  - /url: /careers
              - listitem [ref=e200]:
                - link "Contact" [ref=e201] [cursor=pointer]:
                  - /url: /contact
          - generic [ref=e202]:
            - heading "Legal" [level=3] [ref=e203]
            - list [ref=e204]:
              - listitem [ref=e205]:
                - link "Privacy Policy" [ref=e206] [cursor=pointer]:
                  - /url: /privacy
              - listitem [ref=e207]:
                - link "Terms & Conditions" [ref=e208] [cursor=pointer]:
                  - /url: /terms
              - listitem [ref=e209]:
                - link "Cookie Policy" [ref=e210] [cursor=pointer]:
                  - /url: /cookie
        - generic [ref=e211]:
          - paragraph [ref=e212]: TalentFlow Marketplace © 2026. All rights reserved.
          - generic [ref=e213]:
            - link "Twitter" [ref=e214] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e215]: Twitter
              - img [ref=e216]
            - link "LinkedIn" [ref=e218] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e219]: LinkedIn
              - img [ref=e220]
  - region "Notifications alt+T"
  - alert [ref=e222]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const PROD_URL = 'https://talentflow-marketplace.vercel.app';
  4  | const SISPL_URL = 'https://sispl.shop';
  5  | 
  6  | test.describe('Live Public Signup & Verification Removal Suite', () => {
  7  | 
  8  |   const roles = [
  9  |     { id: 'CANDIDATE', label: 'Job Seeker' },
  10 |     { id: 'EMPLOYER', label: 'Employer' },
  11 |     { id: 'FREELANCER', label: 'Freelancer' },
  12 |     { id: 'TRAINER', label: 'Trainer' }
  13 |   ];
  14 | 
  15 |   for (const r of roles) {
  16 |     test(`Public Signup for Role ${r.id} (${r.label}) Direct without Verification Method`, async ({ page }) => {
  17 |       const timestamp = Date.now();
  18 |       const email = `live.${r.id.toLowerCase()}.${timestamp}@demo.com`;
  19 |       const password = 'Password@123';
  20 |       const fullName = `Live ${r.label} User`;
  21 | 
  22 |       await page.goto(`${PROD_URL}/sign-up`, { waitUntil: 'domcontentloaded' });
  23 |       await page.waitForTimeout(1000);
  24 | 
  25 |       // Verify no "Verification Method" text present
  26 |       const content = await page.content();
  27 |       expect(content.includes('Verification Method') && content.includes('How would you like to sign up?')).toBe(false);
  28 | 
  29 |       // 1. Select Role
  30 |       const roleBtn = page.locator(`button:has-text("${r.label}")`).first();
  31 |       await roleBtn.click();
  32 | 
  33 |       // 2. Click Continue button
  34 |       const continueBtn = page.locator('button:has-text("Continue")').first();
  35 |       await continueBtn.click();
  36 | 
  37 |       await page.waitForTimeout(500);
  38 | 
  39 |       // 3. Fill Direct Profile Registration Form
  40 |       await page.locator('input[placeholder="John Doe"]').fill(fullName);
  41 |       await page.locator('input[placeholder="name@example.com"]').fill(email);
  42 |       await page.locator('input[placeholder="Create a strong password (min 8 chars)"]').fill(password);
  43 |       await page.locator('input[placeholder="Confirm your password"]').fill(password);
  44 | 
  45 |       // 4. Submit
  46 |       const createBtn = page.locator('button:has-text("Create Account")').first();
  47 |       await createBtn.click();
  48 | 
  49 |       // 5. Wait for account creation & automatic login redirect
  50 |       await page.waitForTimeout(4000);
  51 |       const finalUrl = page.url();
  52 |       console.log(`Role ${r.id} post-signup URL:`, finalUrl);
  53 | 
  54 |       expect(
  55 |         finalUrl.includes('/dashboard') || finalUrl.includes('/job-seeker') || finalUrl.includes('/employer') || finalUrl.includes('/freelancer') || finalUrl.includes('/trainer') || finalUrl.includes('/sign-in'),
  56 |         `Role ${r.id} must navigate to role dashboard or sign-in cleanly without OTP prompt`
> 57 |       ).toBe(true);
     |         ^ Error: Role FREELANCER must navigate to role dashboard or sign-in cleanly without OTP prompt
  58 |     });
  59 |   }
  60 | 
  61 |   test('Security: Public Signup rejects role=ADMIN', async ({ request }) => {
  62 |     const res = await request.post('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/register', {
  63 |       data: {
  64 |         email: `hacker.${Date.now()}@test.com`,
  65 |         password: 'Password@123',
  66 |         role: 'ADMIN'
  67 |       }
  68 |     });
  69 | 
  70 |     expect(res.status()).toBe(400);
  71 |   });
  72 | 
  73 | });
  74 | 
```