const { chromium } = require('playwright');

(async () => {
  console.log('--- REPRODUCING NOTIFICATION PRODUCTION CRASH ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const pageErrors = [];
  const consoleErrors = [];
  const unhandledRejections = [];
  const failedRequests = [];

  const page = await context.newPage();

  page.on('pageerror', err => {
    console.error('[PAGEERROR]', err.stack || err.message);
    pageErrors.push(err.stack || err.message);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[CONSOLE ERROR]', msg.text());
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', req => {
    console.error('[REQUEST FAILED]', req.url(), req.failure()?.errorText);
    failedRequests.push(`${req.url()} (${req.failure()?.errorText})`);
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log(`[HTTP ${resp.status()}] ${resp.url()}`);
    }
  });

  // Login as Candidate on live production
  console.log('Navigating to sign-in on live production...');
  await page.goto('https://talentflow-marketplace.vercel.app/sign-in', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  
  await page.fill('#email', 'candidate@demo.com');
  await page.fill('#password', 'Talent@123');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(3000);
  console.log('Current URL after sign-in attempt:', page.url());

  // Test 10 Navigation & Refresh cycles
  for (let i = 1; i <= 10; i++) {
    console.log(`\n--- Iteration ${i} ---`);
    await page.goto('https://talentflow-marketplace.vercel.app/job-seeker/notifications', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);

    const bodyText = await page.evaluate(() => document.body?.innerText || '');
    if (bodyText.includes('Something went wrong!')) {
      console.error(`🚨 DETECTED GLOBAL ERROR BOUNDARY ON ITERATION ${i}!`);
      await page.screenshot({ path: `scratch/notification_crash_iter_${i}.png` });
      break;
    }

    // Refresh test
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const refreshText = await page.evaluate(() => document.body?.innerText || '');
    if (refreshText.includes('Something went wrong!')) {
      console.error(`🚨 DETECTED GLOBAL ERROR BOUNDARY ON REFRESH ITERATION ${i}!`);
      await page.screenshot({ path: `scratch/notification_crash_refresh_${i}.png` });
      break;
    }

    // Click TopNavBar Bell
    const bellBtn = page.locator('#notification-bell');
    if (await bellBtn.count() > 0) {
      await bellBtn.click().catch(() => {});
      await page.waitForTimeout(500);
    }
  }

  console.log('\n--- REPRODUCTION RESULTS SUMMARY ---');
  console.log('Page Errors Count:', pageErrors.length);
  console.log('Console Errors Count:', consoleErrors.length);
  console.log('Failed Requests Count:', failedRequests.length);

  await browser.close();
})();
