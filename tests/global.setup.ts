import { test as setup, expect } from '@playwright/test';
import * as path from 'path';

const authFileCandidate = path.join(__dirname, '../.auth/candidate.json');
const authFileEmployerA = path.join(__dirname, '../.auth/employer-a.json');
const authFileEmployerB = path.join(__dirname, '../.auth/employer-b.json');

setup('authenticate candidate', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill(process.env.E2E_CANDIDATE_EMAIL!);
  await page.getByLabel('Password').fill(process.env.E2E_CANDIDATE_PASSWORD!);
  
  // Role Selector defaults to Job Seeker
  await page.locator('button[type="submit"]:has-text("Sign In")').click();
  
  // Check for error toast or message
  const errorMsg = page.locator('.text-red-400').first();
  if (await errorMsg.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.error('Login Error:', await errorMsg.textContent());
  }
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // Wait until logged in
  try {
    await page.waitForURL('**/job-seeker/dashboard', { timeout: 15000 });
  } catch (e) {
    console.error('TIMEOUT. Current URL:', page.url());
    throw e;
  }
  
  await page.context().storageState({ path: authFileCandidate });
});

setup('authenticate employer A', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill(process.env.E2E_EMPLOYER_A_EMAIL!);
  await page.getByLabel('Password').fill(process.env.E2E_EMPLOYER_A_PASSWORD!);
  
  await page.getByRole('button', { name: 'Employer' }).click();
  await page.locator('button[type="submit"]:has-text("Sign In")').click();
  
  // Wait until logged in
  await page.waitForURL('**/employer/dashboard');
  
  await page.context().storageState({ path: authFileEmployerA });
});

setup('authenticate employer B', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill(process.env.E2E_EMPLOYER_B_EMAIL!);
  await page.getByLabel('Password').fill(process.env.E2E_EMPLOYER_B_PASSWORD!);
  
  await page.getByRole('button', { name: 'Employer' }).click();
  await page.locator('button[type="submit"]:has-text("Sign In")').click();
  
  // Wait until logged in
  await page.waitForURL('**/employer/dashboard');
  
  await page.context().storageState({ path: authFileEmployerB });
});
