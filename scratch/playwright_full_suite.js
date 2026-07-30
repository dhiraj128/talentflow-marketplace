/**
 * TalentFlow Marketplace Real Playwright E2E Runner
 * Uses Playwright browser automation (Chromium, WebKit, Firefox) against https://sispl.shop
 */

const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

const targetUrl = 'https://sispl.shop';

const viewports = [
  { name: '360x800', width: 360, height: 800, type: 'Mobile' },
  { name: '390x844', width: 390, height: 844, type: 'Mobile' },
  { name: '412x915', width: 412, height: 915, type: 'Mobile' },
  { name: '768x1024', width: 768, height: 1024, type: 'Tablet' },
  { name: '820x1180', width: 820, height: 1180, type: 'Tablet' },
  { name: '1280x720', width: 1280, height: 720, type: 'Desktop' },
  { name: '1440x900', width: 1440, height: 900, type: 'Desktop' },
  { name: '1920x1080', width: 1920, height: 1080, type: 'Desktop' },
];

const targetPages = [
  '/',
  '/find-jobs',
  '/find-freelancers',
  '/find-courses',
  '/find-talent',
  '/sign-in',
  '/sign-up',
  '/notifications',
  '/privacy',
  '/terms',
];

async function testBrowserEngine(engineName, launcher) {
  console.log(`\n================================================================`);
  console.log(`PLAYWRIGHT E2E EXECUTION: ${engineName.toUpperCase()}`);
  console.log(`================================================================`);

  let browser;
  try {
    browser = await launcher.launch({ headless: true });
  } catch (err) {
    console.log(`[NOT AVAILABLE / NOT INSTALLED] ${engineName}: ${err.message.split('\n')[0]}`);
    return { engine: engineName, status: 'NOT TESTED', total: 0, passed: 0, failed: 0, skipped: 0 };
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  let executed = 0;
  let passed = 0;
  let failed = 0;

  for (const route of targetPages) {
    const fullUrl = `${targetUrl}${route}`;
    process.stdout.write(`Testing Route [${engineName}]: ${route.padEnd(20)} `);
    try {
      const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = response ? response.status() : 0;
      if (status === 200 || status === 304) {
        console.log(`[PASS] (Status: ${status})`);
        passed++;
      } else {
        console.log(`[FAIL] (Status: ${status})`);
        failed++;
      }
      executed++;
    } catch (err) {
      console.log(`[FAIL] Error: ${err.message}`);
      failed++;
      executed++;
    }
  }

  await browser.close();
  return { engine: engineName, status: 'EXECUTED', total: executed, passed, failed, skipped: 0 };
}

async function testViewportMatrix() {
  console.log(`\n================================================================`);
  console.log(`PLAYWRIGHT VIEWPORT MATRIX AUDIT (CHROMIUM)`);
  console.log(`================================================================`);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.error('Chromium launch failed:', err.message);
    return [];
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  const viewportResults = [];

  for (const vp of viewports) {
    process.stdout.write(`Viewport: ${vp.name.padEnd(12)} (${vp.type.padEnd(8)}) `);
    await page.setViewportSize({ width: vp.width, height: vp.height });
    try {
      await page.goto(`${targetUrl}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (hasHorizontalScroll) {
        console.log(`[FAIL] Horizontal scroll overflow detected`);
        viewportResults.push({ name: vp.name, status: 'FAIL', reason: 'Horizontal overflow' });
      } else {
        console.log(`[PASS] Responsive layout clean, zero horizontal overflow`);
        viewportResults.push({ name: vp.name, status: 'PASS' });
      }
    } catch (err) {
      console.log(`[FAIL] Error: ${err.message}`);
      viewportResults.push({ name: vp.name, status: 'FAIL', reason: err.message });
    }
  }

  await browser.close();
  return viewportResults;
}

async function runFullSuite() {
  console.log('================================================================');
  console.log('TALENTFLOW REAL PLAYWRIGHT E2E SUITE (CORRECTED ROUTES)');
  console.log('Target URL: https://sispl.shop');
  console.log('================================================================');

  const chromiumRes = await testBrowserEngine('Chromium', chromium);
  const firefoxRes = await testBrowserEngine('Firefox', firefox);
  const webkitRes = await testBrowserEngine('WebKit', webkit);

  const vpResults = await testViewportMatrix();

  console.log('\n================================================================');
  console.log('PLAYWRIGHT E2E EXECUTION SUMMARY');
  console.log('================================================================');

  const totalExecuted = chromiumRes.total + firefoxRes.total + webkitRes.total;
  const totalPassed = chromiumRes.passed + firefoxRes.passed + webkitRes.passed;
  const totalFailed = chromiumRes.failed + firefoxRes.failed + webkitRes.failed;

  console.log(`Total Tests Executed: ${totalExecuted}`);
  console.log(`Total Passed:         ${totalPassed}`);
  console.log(`Total Failed:         ${totalFailed}`);
  console.log(`Total Skipped:        0`);

  console.log('\nBrowser Breakdown:');
  console.log(`  Chromium: ${chromiumRes.status} (Passed: ${chromiumRes.passed}/${chromiumRes.total})`);
  console.log(`  Firefox:  ${firefoxRes.status} (Passed: ${firefoxRes.passed}/${firefoxRes.total})`);
  console.log(`  WebKit:   ${webkitRes.status} (Passed: ${webkitRes.passed}/${webkitRes.total})`);

  console.log('\nViewport Breakdown:');
  for (const vp of vpResults) {
    console.log(`  ${vp.name.padEnd(12)}: ${vp.status}`);
  }
}

runFullSuite().catch((err) => {
  console.error('Playwright execution error:', err);
  process.exit(1);
});
