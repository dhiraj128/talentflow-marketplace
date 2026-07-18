const { chromium } = require('playwright');
const FRONTEND_URL = 'https://talentflow-marketplace.vercel.app';
const CANDIDATE_EMAIL = 'talentflow.candidate.test@yourdomain.com';
const PWD = 'Dhiraj@123';

async function run() {
  let browser = await chromium.launch({ headless: true });
  let context = await browser.newContext();
  let page = await context.newPage();

  console.log('Logging in...');
  await page.goto(`${FRONTEND_URL}/sign-in`);
  await page.fill('input[type="email"]', CANDIDATE_EMAIL);
  await page.fill('input[type="password"]', PWD);
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/dashboard');
  console.log('URL after login:', page.url());

  console.log('Navigating to builder...');
  await page.goto(`${FRONTEND_URL}/job-seeker/resume-center/builder`);
  await page.waitForLoadState('networkidle');
  console.log('URL at builder:', page.url());

  const buttonExists = await page.locator('button[role="tab"]:has-text("Upload")').count();
  console.log('Tabs matching locator:', buttonExists);
  
  if (buttonExists > 0) {
    await page.click('button[role="tab"]:has-text("Upload")');
    console.log('Successfully clicked tab!');
  } else {
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'builder-failed.png' });
    const textUpload = await page.locator('text="Upload"').count();
    console.log('Any text="Upload" count:', textUpload);
  }

  await browser.close();
}

run().catch(e => console.error(e));
