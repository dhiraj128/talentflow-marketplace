const { chromium, firefox, webkit } = require('playwright');

(async () => {
  console.log('================================================================');
  console.log('TALENTFLOW HOMEPAGE HERO — RESPONSIVE MATRIX & OVERFLOW AUDIT');
  console.log('================================================================');

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
        await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
        
        // 1. Verify headline presence
        const headlineText = await page.locator('h1').innerText().catch(() => '');
        const titleOk = headlineText.includes('TalentFlow Marketplace');

        // 2. Verify subheadline presence
        const bodyText = await page.innerText('body').catch(() => '');
        const subOk = bodyText.includes('Your Career Ecosystem — All in One Place');

        // 3. Verify horizontal overflow (must be 0)
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
        });

        // 4. Verify primary navbar links remain intact
        const navOk = bodyText.includes('Find Jobs') && bodyText.includes('Find Talent');

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

  console.log('================================================================');
  console.log(`HOMEPAGE HERO AUDIT SUMMARY: ${passCount} PASS, ${failCount} FAIL`);
  console.log('================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
})();
