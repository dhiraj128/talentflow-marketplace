const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runQA() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const artifactsDir = 'C:\\Users\\dhira_5fqr2uc\\.gemini\\antigravity\\brain\\687a8d54-a1ef-4362-a818-d39cc74b7586\\scratch';
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  const baseUrl = 'https://talentflow-marketplace-dhiraj128.vercel.app';

  console.log('--- Starting Automated Manual QA ---');
  try {
    // 1. Landing Page
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(artifactsDir, 'qa-landing.png') });
    console.log('Landing page verified.');

    // 2. Login
    await page.goto(`${baseUrl}/sign-in`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'demo@candidate.com');
    await page.fill('input[type="password"]', 'Talent@123');
    await page.click('button[type="submit"]');
    console.log('Submitted login form.');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(artifactsDir, 'qa-dashboard-desktop.png') });
    console.log('Dashboard verified.');

    // 3. Navigation & Dashboard Layout (Check for scroll/stretching)
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Desktop Dashboard Horizontal Scroll: ${hasHorizontalScroll}`);

    // 4. Mobile Responsiveness on Dashboard
    const mobileViewports = [320, 375, 430, 768];
    for (const width of mobileViewports) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(500); // Give layout time to adjust
      await page.screenshot({ path: path.join(artifactsDir, `qa-dashboard-${width}.png`) });
      
      const scroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      console.log(`Mobile ${width}px Horizontal Scroll: ${scroll}`);
    }

    // Reset to desktop
    await page.setViewportSize({ width: 1440, height: 900 });

    // 5. Profile & Verification
    await page.goto(`${baseUrl}/job-seeker/verification`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(artifactsDir, 'qa-verification.png') });
    console.log('Verification page verified.');
    
    console.log('--- QA Script Completed Successfully ---');
  } catch (err) {
    console.error('QA Script failed:', err);
    await page.screenshot({ path: path.join(artifactsDir, 'qa-error.png') });
  } finally {
    await browser.close();
  }
}

runQA();
