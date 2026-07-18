# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global.setup.ts >> authenticate employer B
- Location: tests\global.setup.ts:48:6

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/employer/dashboard" until "load"
  navigated to "http://localhost:3000/sign-in"
  navigated to "http://localhost:3000/sign-in"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "TalentFlow" [ref=e6] [cursor=pointer]:
          - /url: /
          - img [ref=e8]
          - generic [ref=e11]: TalentFlow
        - navigation [ref=e12]:
          - link "Home" [ref=e13] [cursor=pointer]:
            - /url: /
          - link "Find Jobs" [ref=e14] [cursor=pointer]:
            - /url: /find-jobs
          - link "Freelance" [ref=e15] [cursor=pointer]:
            - /url: /find-freelancers
          - link "Training" [ref=e16] [cursor=pointer]:
            - /url: /find-courses
          - link "For Employers" [ref=e17] [cursor=pointer]:
            - /url: /find-talent
        - generic [ref=e18]:
          - link "Sign In" [ref=e19] [cursor=pointer]:
            - /url: /sign-in
            - button "Sign In" [ref=e20]
          - link "Sign Up" [ref=e21] [cursor=pointer]:
            - /url: /sign-up
            - button "Sign Up" [ref=e22]
    - main [ref=e23]:
      - generic [ref=e24]:
        - generic [ref=e26]:
          - generic:
            - img
          - generic [ref=e27]:
            - heading "Find Better Talent. Build Better Careers." [level=1] [ref=e29]:
              - text: Find Better
              - text: Talent.
              - text: Build Better
              - text: Careers.
            - paragraph [ref=e31]:
              - text: The complete hiring ecosystem for professionals,
              - text: employers, freelancers and trainers.
            - generic [ref=e32]:
              - generic [ref=e33]:
                - img [ref=e35]
                - generic [ref=e40]:
                  - generic [ref=e41]: 20,000
                  - generic [ref=e42]: +
                - generic [ref=e43]: Verified Professionals
              - generic [ref=e44]:
                - img [ref=e46]
                - generic [ref=e50]:
                  - generic [ref=e51]: 5,000
                  - generic [ref=e52]: +
                - generic [ref=e53]: Companies
              - generic [ref=e54]:
                - img [ref=e56]
                - generic [ref=e59]:
                  - generic [ref=e60]: 3,000
                  - generic [ref=e61]: +
                - generic [ref=e62]: Freelancers
              - generic [ref=e63]:
                - img [ref=e65]
                - generic [ref=e67]:
                  - generic [ref=e68]: "800"
                  - generic [ref=e69]: +
                - generic [ref=e70]: Training Programs
            - generic [ref=e71]:
              - generic [ref=e72]:
                - generic [ref=e74]:
                  - img [ref=e75]
                  - generic [ref=e78]: TalentFlow Dashboard
                - img [ref=e84]
              - generic [ref=e87]:
                - generic [ref=e88]: New Hires
                - generic [ref=e89]: +48%
                - generic [ref=e90]: This Month
              - generic [ref=e91]:
                - img [ref=e93]
                - generic [ref=e96]:
                  - generic [ref=e97]: Talent Match
                  - generic [ref=e98]: 92%
            - generic [ref=e99]:
              - generic [ref=e101]:
                - img [ref=e102]
                - img [ref=e104]
                - img [ref=e106]
                - img [ref=e108]
                - img [ref=e110]
              - paragraph [ref=e112]: "\"TalentFlow reduced hiring time by 70%. The verified talent pool is unmatched.\""
              - generic [ref=e113]:
                - generic [ref=e114]: HR
                - generic [ref=e115]:
                  - generic [ref=e116]: HR Director
                  - generic [ref=e117]: Enterprise Customer
        - generic [ref=e120]:
          - generic [ref=e121]:
            - generic [ref=e122]:
              - heading "Welcome back" [level=2] [ref=e123]
              - paragraph [ref=e124]: Select your role and sign in to continue
            - generic [ref=e125]:
              - generic [ref=e126]:
                - button "Job Seeker" [ref=e127]:
                  - img [ref=e128]
                  - generic [ref=e131]: Job Seeker
                - button "Employer" [ref=e132]:
                  - img [ref=e133]
                  - generic [ref=e136]: Employer
                - button "Freelancer" [ref=e137]:
                  - img [ref=e138]
                  - generic [ref=e141]: Freelancer
              - generic [ref=e142]:
                - button "Trainer" [ref=e143]:
                  - img [ref=e144]
                  - generic [ref=e147]: Trainer
                - button "Administrator" [ref=e148]:
                  - img [ref=e149]
                  - generic [ref=e151]: Administrator
            - generic [ref=e152]:
              - generic [ref=e153]:
                - generic [ref=e154]: Email
                - textbox "Email" [ref=e155]
              - generic [ref=e156]:
                - generic [ref=e157]:
                  - generic [ref=e158]: Password
                  - link "Forgot password?" [ref=e159] [cursor=pointer]:
                    - /url: "#"
                - textbox "Password" [ref=e160]
              - button "Sign In" [ref=e161]
            - generic [ref=e162]:
              - generic [ref=e167]: Or continue with
              - generic [ref=e168]:
                - link "Google" [ref=e169] [cursor=pointer]:
                  - /url: https://talentflow-backend-qn7b.onrender.com/api/v1/auth/google
                  - img [ref=e170]
                  - text: Google
                - link "GitHub" [ref=e173] [cursor=pointer]:
                  - /url: https://talentflow-backend-qn7b.onrender.com/api/v1/auth/github
                  - img [ref=e174]
                  - text: GitHub
              - generic [ref=e177]:
                - text: Don't have an account?
                - link "Sign up" [ref=e178] [cursor=pointer]:
                  - /url: /sign-up
            - generic [ref=e179]:
              - generic [ref=e180]:
                - img [ref=e181]
                - generic [ref=e183]: Identity Verification
              - paragraph [ref=e184]: Upload ANY ONE government-issued identity document.
              - generic [ref=e185]:
                - generic [ref=e186]: Aadhaar
                - generic [ref=e187]: PAN
                - generic [ref=e188]: Passport
                - generic [ref=e189]: Driving Licence
                - generic [ref=e190]: Voter ID
              - paragraph [ref=e191]: One verified government-issued identity document is sufficient.
          - generic [ref=e192]:
            - generic [ref=e193]:
              - img [ref=e194]
              - text: 256-bit SSL
            - generic [ref=e197]:
              - img [ref=e198]
              - text: JWT Authentication
            - generic [ref=e201]:
              - img [ref=e202]
              - text: Secure Payments
            - generic [ref=e205]:
              - img [ref=e206]
              - text: SOC 2 Ready
            - generic [ref=e209]:
              - img [ref=e210]
              - text: GDPR Ready
    - contentinfo [ref=e213]:
      - generic [ref=e214]:
        - generic [ref=e215]:
          - generic [ref=e216]:
            - text: TalentFlow
            - paragraph [ref=e217]: Your Career Ecosystem — All in One Place. Connect with verified employers, freelance projects, and certified training programs.
            - paragraph [ref=e218]: Powered by TalentFlow Platform
          - generic [ref=e219]:
            - heading "Platform" [level=3] [ref=e220]
            - list [ref=e221]:
              - listitem [ref=e222]:
                - link "Find Jobs" [ref=e223] [cursor=pointer]:
                  - /url: /find-jobs
              - listitem [ref=e224]:
                - link "Freelancers" [ref=e225] [cursor=pointer]:
                  - /url: /find-freelancers
              - listitem [ref=e226]:
                - link "Training" [ref=e227] [cursor=pointer]:
                  - /url: /find-courses
              - listitem [ref=e228]:
                - link "Employers" [ref=e229] [cursor=pointer]:
                  - /url: /find-talent
          - generic [ref=e230]:
            - heading "Company" [level=3] [ref=e231]
            - list [ref=e232]:
              - listitem [ref=e233]:
                - link "About Us" [ref=e234] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e235]:
                - link "Blog" [ref=e236] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e237]:
                - link "Career Resources" [ref=e238] [cursor=pointer]:
                  - /url: /careers
              - listitem [ref=e239]:
                - link "Contact" [ref=e240] [cursor=pointer]:
                  - /url: /contact
          - generic [ref=e241]:
            - heading "Legal" [level=3] [ref=e242]
            - list [ref=e243]:
              - listitem [ref=e244]:
                - link "Privacy Policy" [ref=e245] [cursor=pointer]:
                  - /url: /privacy
              - listitem [ref=e246]:
                - link "Terms & Conditions" [ref=e247] [cursor=pointer]:
                  - /url: /terms
              - listitem [ref=e248]:
                - link "Cookie Policy" [ref=e249] [cursor=pointer]:
                  - /url: /cookie
        - generic [ref=e250]:
          - paragraph [ref=e251]: TalentFlow Marketplace © 2026. All rights reserved.
          - generic [ref=e252]:
            - link "Twitter" [ref=e253] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e254]: Twitter
              - img [ref=e255]
            - link "LinkedIn" [ref=e257] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e258]: LinkedIn
              - img [ref=e259]
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e266] [cursor=pointer]:
    - img [ref=e267]
  - alert [ref=e270]
```

# Test source

```ts
  1  | import { test as setup, expect } from '@playwright/test';
  2  | import * as path from 'path';
  3  | 
  4  | const authFileCandidate = path.join(__dirname, '../.auth/candidate.json');
  5  | const authFileEmployerA = path.join(__dirname, '../.auth/employer-a.json');
  6  | const authFileEmployerB = path.join(__dirname, '../.auth/employer-b.json');
  7  | 
  8  | setup('authenticate candidate', async ({ page }) => {
  9  |   await page.goto('/sign-in');
  10 |   await page.getByLabel('Email').fill(process.env.E2E_CANDIDATE_EMAIL!);
  11 |   await page.getByLabel('Password').fill(process.env.E2E_CANDIDATE_PASSWORD!);
  12 |   
  13 |   // Role Selector defaults to Job Seeker
  14 |   await page.locator('button[type="submit"]:has-text("Sign In")').click();
  15 |   
  16 |   // Check for error toast or message
  17 |   const errorMsg = page.locator('.text-red-400').first();
  18 |   if (await errorMsg.isVisible({ timeout: 5000 }).catch(() => false)) {
  19 |     console.error('Login Error:', await errorMsg.textContent());
  20 |   }
  21 |   page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  22 |   
  23 |   // Wait until logged in
  24 |   try {
  25 |     await page.waitForURL('**/job-seeker/dashboard', { timeout: 15000 });
  26 |   } catch (e) {
  27 |     console.error('TIMEOUT. Current URL:', page.url());
  28 |     throw e;
  29 |   }
  30 |   
  31 |   await page.context().storageState({ path: authFileCandidate });
  32 | });
  33 | 
  34 | setup('authenticate employer A', async ({ page }) => {
  35 |   await page.goto('/sign-in');
  36 |   await page.getByLabel('Email').fill(process.env.E2E_EMPLOYER_A_EMAIL!);
  37 |   await page.getByLabel('Password').fill(process.env.E2E_EMPLOYER_A_PASSWORD!);
  38 |   
  39 |   await page.getByRole('button', { name: 'Employer' }).click();
  40 |   await page.locator('button[type="submit"]:has-text("Sign In")').click();
  41 |   
  42 |   // Wait until logged in
  43 |   await page.waitForURL('**/employer/dashboard');
  44 |   
  45 |   await page.context().storageState({ path: authFileEmployerA });
  46 | });
  47 | 
  48 | setup('authenticate employer B', async ({ page }) => {
  49 |   await page.goto('/sign-in');
  50 |   await page.getByLabel('Email').fill(process.env.E2E_EMPLOYER_B_EMAIL!);
  51 |   await page.getByLabel('Password').fill(process.env.E2E_EMPLOYER_B_PASSWORD!);
  52 |   
  53 |   await page.getByRole('button', { name: 'Employer' }).click();
  54 |   await page.locator('button[type="submit"]:has-text("Sign In")').click();
  55 |   
  56 |   // Wait until logged in
> 57 |   await page.waitForURL('**/employer/dashboard');
     |              ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  58 |   
  59 |   await page.context().storageState({ path: authFileEmployerB });
  60 | });
  61 | 
```