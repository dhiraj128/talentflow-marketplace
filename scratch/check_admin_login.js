const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[CONSOLE]', msg.text()));

  await page.route('**/*auth/me**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'admin-123',
        email: 'admin@demo.com',
        role: 'ADMIN',
        firstName: 'System',
        lastName: 'Admin'
      })
    });
  });

  await page.addInitScript(() => {
    window.localStorage.setItem('access_token', 'mock-admin-token');
    window.localStorage.setItem('user', JSON.stringify({
      id: 'admin-123',
      email: 'admin@demo.com',
      role: 'ADMIN',
      firstName: 'System',
      lastName: 'Admin'
    }));
  });

  await page.goto('https://talentflow-marketplace.vercel.app/admin/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  console.log('Admin Dashboard URL:', page.url());

  await browser.close();
})();
