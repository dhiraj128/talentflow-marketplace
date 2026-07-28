const { chromium } = require('playwright');

(async () => {
  console.log('--- TESTING NOTIFICATION BELL CLICK ON LOCALHOST WITH MOCK USER ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[PAGEERROR]', err.message));

  await page.addInitScript(() => {
    window.localStorage.setItem('access_token', 'mock-token');
    window.localStorage.setItem('user', JSON.stringify({
      id: 'user-candidate-id',
      email: 'candidate@demo.com',
      name: 'Demo Candidate',
      role: 'CANDIDATE'
    }));
  });

  console.log('Navigating to local job-seeker dashboard...');
  await page.goto('http://localhost:3000/job-seeker/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  console.log('Current URL:', page.url());
  const bell = page.locator('#notification-bell');
  console.log('Bell Count:', await bell.count());

  if (await bell.count() > 0) {
    console.log('Clicking notification bell...');
    await bell.click();
    await page.waitForTimeout(500);

    const dropdownsAfter = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('[data-slot="dropdown-menu-content"]'));
      return els.map(el => ({
        innerText: el.innerText,
        offsetHeight: el.offsetHeight,
        offsetWidth: el.offsetWidth,
        computedDisplay: window.getComputedStyle(el).display,
        computedVisibility: window.getComputedStyle(el).visibility,
        computedOpacity: window.getComputedStyle(el).opacity,
        rect: el.getBoundingClientRect()
      }));
    });

    console.log('Dropdown elements in DOM after click on LOCALHOST:', JSON.stringify(dropdownsAfter, null, 2));
  }

  await browser.close();
})();
