const { chromium } = require('playwright');

(async () => {
  console.log('--- REPRODUCING & DEBUGGING NOTIFICATION BELL CLICK ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[PAGEERROR]', err.message));

  console.log('Navigating to sign-in on live production...');
  await page.goto('https://talentflow-marketplace.vercel.app/sign-in', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  await page.fill('#email', 'candidate@demo.com');
  await page.fill('#password', 'Talent@123');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(3000);
  console.log('Signed in. Current URL:', page.url());

  // Inspect Notification Bell element
  const bell = page.locator('#notification-bell');
  console.log('Bell Count:', await bell.count());

  if (await bell.count() > 0) {
    const isVisible = await bell.isVisible();
    console.log('Bell Visible:', isVisible);

    const bellOuterHtmlBefore = await bell.evaluate(el => el.outerHTML);
    console.log('Bell HTML before click:', bellOuterHtmlBefore);

    // Count dropdown content elements in DOM before click
    const dropdownsBefore = await page.evaluate(() => document.querySelectorAll('[data-slot="dropdown-menu-content"]').length);
    console.log('Dropdown elements in DOM before click:', dropdownsBefore);

    // Click the bell
    console.log('Clicking notification bell...');
    await bell.click();
    await page.waitForTimeout(500);

    const dropdownsAfter = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('[data-slot="dropdown-menu-content"]'));
      return els.map(el => ({
        tagName: el.tagName,
        innerText: el.innerText,
        offsetHeight: el.offsetHeight,
        offsetWidth: el.offsetWidth,
        computedDisplay: window.getComputedStyle(el).display,
        computedVisibility: window.getComputedStyle(el).visibility,
        computedOpacity: window.getComputedStyle(el).opacity,
        computedZIndex: window.getComputedStyle(el).zIndex,
        rect: el.getBoundingClientRect()
      }));
    });

    console.log('Dropdown elements in DOM after click:', JSON.stringify(dropdownsAfter, null, 2));
  }

  await browser.close();
})();
