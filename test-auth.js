const { chromium } = require('playwright');

(async () => {
  console.log('Starting auth refresh E2E verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/api/v1/auth/me')) {
      results.push({ type: 'auth/me', status: res.status() });
      console.log(`[NETWORK] GET /auth/me returned ${res.status()}`);
    } else if (url.includes('/api/v1/auth/refresh')) {
      results.push({ type: 'auth/refresh', status: res.status() });
      console.log(`[NETWORK] POST /auth/refresh returned ${res.status()}`);
    } else if (url.includes('/api/v1/notifications')) {
      results.push({ type: 'notifications', status: res.status() });
      console.log(`[NETWORK] GET /notifications returned ${res.status()}`);
    }
  });

  try {
    // 1. Login
    console.log('\n--- Step 1: Login ---');
    await page.goto('http://localhost:3000/sign-in');
    await page.fill('input[type="email"]', 'talentflow.candidate.test@yourdomain.com');
    await page.fill('input[type="password"]', 'Test1234!');
    await page.click('button[type="submit"]');

    await page.waitForURL('http://localhost:3000/');
    await page.waitForLoadState('networkidle');

    let meCount = results.filter(r => r.type === 'auth/me' && r.status === 200).length;
    if (meCount === 0) throw new Error('GET /auth/me did not return 200 after login');
    console.log('✅ Login succeeded and /auth/me returned 200');

    // 2. Refresh page
    console.log('\n--- Step 2: Refresh Page ---');
    results.length = 0; // clear results
    await page.reload();
    await page.waitForLoadState('networkidle');

    meCount = results.filter(r => r.type === 'auth/me' && r.status === 200).length;
    if (meCount === 0) throw new Error('GET /auth/me did not return 200 after page refresh');
    console.log('✅ Page refresh succeeded and /auth/me returned 200');

    // 3. Expire access token and trigger refresh
    console.log('\n--- Step 3: Expire Token & Trigger Refresh ---');
    results.length = 0; // clear results
    
    // Corrupt the access token in localStorage to force a 401
    await page.evaluate(() => {
      let token = localStorage.getItem('access_token');
      localStorage.setItem('access_token', token + 'invalid');
    });

    console.log('Reloading to trigger auth-context and axios interceptors...');
    await page.reload();
    
    // Wait for the requests to settle
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');

    const refreshCount = results.filter(r => r.type === 'auth/refresh').length;
    const finalMeCount = results.filter(r => r.type === 'auth/me' && r.status === 200).length;

    console.log(`Refresh calls: ${refreshCount}`);
    console.log(`Successful /auth/me calls after refresh: ${finalMeCount}`);

    if (refreshCount > 0 && finalMeCount > 0) {
      console.log('✅ Token refresh triggered correctly and /auth/me was retried successfully!');
    } else {
      throw new Error('Token refresh or retry failed.');
    }

  } catch (e) {
    console.error('❌ Test failed:', e.message);
  } finally {
    await browser.close();
  }
})();
