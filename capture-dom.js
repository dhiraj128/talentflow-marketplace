const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  let browser = await chromium.launch({ headless: true });
  let context = await browser.newContext();
  let page = await context.newPage();

  // Login
  await page.goto('https://talentflow-marketplace.vercel.app/sign-in');
  await page.fill('input[type="email"]', 'talentflow.candidate.test@yourdomain.com');
  await page.fill('input[type="password"]', 'Dhiraj@123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000); // wait for redirect

  // Check my-resume
  await page.goto('https://talentflow-marketplace.vercel.app/job-seeker/resume-center/my-resume');
  await page.waitForLoadState('networkidle');
  const myResumeHtml = await page.content();
  fs.writeFileSync('my-resume-dom.html', myResumeHtml);
  
  // Check builder
  await page.goto('https://talentflow-marketplace.vercel.app/job-seeker/resume-center/builder');
  await page.waitForLoadState('networkidle');
  const builderHtml = await page.content();
  fs.writeFileSync('builder-dom.html', builderHtml);

  await browser.close();
  console.log('DOM captured.');
}

run();
