const { chromium } = require('playwright');
const FRONTEND_URL = 'https://talentflow-marketplace.vercel.app';
const EMPLOYER_A_EMAIL = 'talentflow.employer.a.prodtest@yourdomain.com';
const PWD = 'Dhiraj@123';

async function run() {
  let browser = await chromium.launch({ headless: true });
  let context = await browser.newContext();
  let page = await context.newPage();

  console.log('Navigating to sign in...');
  await page.goto(`${FRONTEND_URL}/sign-in`);
  await page.fill('input[type="email"]', EMPLOYER_A_EMAIL);
  await page.fill('input[type="password"]', PWD);
  await page.click('button[type="submit"]');
  console.log('Clicked submit. Waiting 10s...');
  
  await page.waitForTimeout(10000);
  console.log('Current URL after 10s:', page.url());
  
  await page.screenshot({ path: 'frontend-login-test.png' });
  await browser.close();
}
run();
