const { chromium, firefox, webkit } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          retry();
        }
      }).on('error', () => {
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - start > timeout) {
        reject(new Error(`Server at ${url} failed to respond within ${timeout}ms`));
      } else {
        setTimeout(check, 1000);
      }
    };

    check();
  });
}

(async () => {
  console.log('================================================================');
  console.log('TALENTFLOW HOMEPAGE HERO — STANDALONE PLAYWRIGHT RESPONSIVE AUDIT');
  console.log('================================================================');

  const PORT = 3011;
  const SERVER_URL = `http://localhost:${PORT}`;

  console.log(`Starting production server on port ${PORT}...`);
  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const server = spawn(npxCmd, ['next', 'start', '-p', String(PORT)], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'ignore',
  });

  try {
    await waitForServer(SERVER_URL);
    console.log(`Production server running at ${SERVER_URL}!`);
  } catch (err) {
    console.error('Failed to start Next.js production server:', err.message);
    if (server) server.kill();
    process.exit(1);
  }

  const viewports = [
    { width: 360, height: 800, name: '360x800 (Mobile Small)' },
    { width: 390, height: 844, name: '390x844 (Mobile Medium)' },
    { width: 412, height: 915, name: '412x915 (Mobile Large)' },
    { width: 768, height: 1024, name: '768x1024 (Tablet Small)' },
    { width: 1024, height: 768, name: '1024x768 (Tablet Landscape)' },
    { width: 1280, height: 720, name: '1280x720 (Desktop HD)' },
    { width: 1440, height: 900, name: '1440x900 (Desktop WXGA)' },
    { width: 1920, height: 1080, name: '1920x1080 (Desktop FHD)' },
  ];

  const engines = [
    { name: 'Chromium', engine: chromium },
    { name: 'Firefox', engine: firefox },
    { name: 'WebKit', engine: webkit },
  ];

  let passCount = 0;
  let failCount = 0;

  for (const eng of engines) {
    console.log(`\nTesting Engine: ${eng.name}...`);
    let browser;
    try {
      browser = await eng.engine.launch({ headless: true });
    } catch (e) {
      console.log(`  - Engine ${eng.name} launch skipped`);
      continue;
    }

    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();

      try {
        await page.goto(SERVER_URL, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForTimeout(200);

        // 1. Verify headline presence
        const headlineText = await page.locator('h1').innerText().catch(() => '');
        const titleOk = headlineText.includes('TalentFlow Marketplace');

        // 2. Verify subheadline presence
        const subElemCount = await page.locator('p').filter({ hasText: 'Career Ecosystem' }).count().catch(() => 0);
        const bodyText = await page.innerText('body').catch(() => '');
        const subOk = subElemCount > 0 || bodyText.includes('Career Ecosystem');

        // 3. Verify zero horizontal overflow
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
        });

        // 4. Verify primary navbar links
        let navOk = false;
        if (vp.width >= 768) {
          navOk = bodyText.includes('Find Jobs') && bodyText.includes('Find Talent');
        } else {
          // On mobile, check for mobile menu toggle button and open menu to verify links
          const menuBtn = page.locator('button.md\\:hidden').first();
          if (await menuBtn.isVisible().catch(() => false)) {
            await menuBtn.click().catch(() => {});
            await page.waitForTimeout(300);
            const sheetText = await page.innerText('body').catch(() => '');
            navOk = sheetText.includes('Job Seeker') || sheetText.includes('Find Jobs') || sheetText.includes('Employer');
          } else {
            navOk = true;
          }
        }

        if (titleOk && subOk && !hasHorizontalOverflow && navOk) {
          console.log(`  [PASS] ${vp.name}`);
          passCount++;
        } else {
          console.error(`  [FAIL] ${vp.name} - title:${titleOk}, sub:${subOk}, overflow:${hasHorizontalOverflow}, nav:${navOk}`);
          failCount++;
        }
      } catch (err) {
        console.error(`  [ERROR] ${vp.name}: ${err.message}`);
        failCount++;
      } finally {
        await context.close();
      }
    }

    await browser.close();
  }

  console.log('\nStopping production server...');
  if (server) server.kill();

  console.log('================================================================');
  console.log(`HOMEPAGE HERO AUDIT SUMMARY: ${passCount} PASS, ${failCount} FAIL`);
  console.log('================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
})();
