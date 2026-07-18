# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global.setup.ts >> authenticate candidate
- Location: tests\global.setup.ts:8:6

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/sign-in
Call log:
  - navigating to "http://localhost:3000/sign-in", waiting until "load"

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
> 9  |   await page.goto('/sign-in');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/sign-in
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
  57 |   await page.waitForURL('**/employer/dashboard');
  58 |   
  59 |   await page.context().storageState({ path: authFileEmployerB });
  60 | });
  61 | 
```