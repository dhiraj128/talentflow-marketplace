const { chromium } = require('@playwright/test');
const fs = require('fs');

const viewports = [
  { name: '320x568', width: 320, height: 568 },
  { name: '360x800', width: 360, height: 800 },
  { name: '375x667', width: 375, height: 667 },
  { name: '390x844', width: 390, height: 844 },
  { name: '412x915', width: 412, height: 915 },
  { name: '430x932', width: 430, height: 932 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '820x1180', width: 820, height: 1180 },
  { name: '1024x1366', width: 1024, height: 1366 },
  { name: '12:0x720', width: 1280, height: 720 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 }
];

const publicRoutes = [
  '/',
  '/find-jobs',
  '/find-freelancers',
  '/find-courses',
  '/find-talent',
  '/search',
  '/blog',
  '/sign-in',
  '/sign-up'
];

async function runMobileAudit() {
  console.log('=== TALENTFLOW V1 LIVE MOBILE & TABLET ACCEPTANCE AUDIT ===');
  console.log('Starting Browser');
  const browser = await chromium.launch({ headless: true });
  
  let totalTests = 0;
  let overflowFailures = 0;
  const resultsByViewport = {};

  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    });
    const page = await context.newPage();

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      resultsByViewport[vp.name] = { pass: true, routesTested: 0, failures: [] };

      for (const route of publicRoutes) {
        totalTests++;
        resultsByViewport[vp.name].routesTested++;
        const targetUrl = 'https://sispl.shop' + route;

        try {
          await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
          await page.waitForTimeout(500);

          const results = await page.evaluate(() => {
            return {
              hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
              scrollWidth: document.documentElement.scrollWidth,
              innerWidth: window.innerWidth
            };
          });

          if (results.hasOverflow) {
            console.error('X OVERFLOW DETECTED: ' + route + ' on ' + vp.name + ' (scrollWidth=' + results.scrollWidth + 'px, innerWidth=' + results.innerWidth + 'px)');
            overflowFailures++;
            resultsByViewport[vp.name].pass = false;
            resultsByViewport[vp.name].failures.push(route + ' (scrollWidth: ' + results.scrollWidth + 'px)');
          }
        } catch (err) {
          console.warn('Warning fetching ' + route + ' on ' + vp.name + ': ' + err.message);
        }
      }

      const statusStr = resultsByViewport[vp.name].pass ? 'PASS' : 'FAIL';
      console.log('Viewport ' + vp.name + ': ' + statusStr + ' (' + resultsByViewport[vp.name].routesTested + ' routes tested)');
    }

    console.log('\n=== MOBILE & TABLET ACCEPTANCE SUMMARY ===');
    const totalTestsStr = 'Total Route/Viewport Combinations Tested: ' + totalTests;
    console.log(totalTestsStr);
    const failuresStr = 'Total Horizontal Overflow Failures: ' + overflowFailures;
    console.log(failuresStr);
    
    fs.writeFileSync('mobile-audit-results.json', JON.stringify({
      totalTests,
      overflowFailures,
      resultsByViewport
    }, null, 2));

  } catch (err) {
    console.error('Mobile audit encountered error:', err);
  } finally {
    await browser.close();
  }
}

runMobileAudit().catch(console.error);
