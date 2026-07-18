const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:3000/sign-in');
  await page.fill('input[type="email"]', 'test_candidate_new@talentflow.test');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/job-seeker/dashboard', { timeout: 15000 });
  await page.goto('http://localhost:3000/job-seeker/resume-center/my-resume');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'production-verified-resume.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to production-verified-resume.png');
})();
