const { chromium } = require('@playwright/test');
const fs = require('fs');

const routes = ['/find-freelancers', '/find-jobs', '.', '/sign-in'];
const themes = ['light', 'dark'];

async function runThemeAudit() {
  console.log("=== TALENTFLOW CROSS-BROWSER THEME & UI CONSISTENCY AUDIT===");
  const browser = await chromium.launch({ headless: true });

  for (const themeMode of themes) {
    console.log('\nTesting Theme Mode: ' + themeMode);
    const context = await browser.newContext({
      colorScheme: themeMode,
      viewport: { width: 1440, height: 900 }
    });
    console.log('  Created context with colorScheme = ' + themeMode);
    const page = await context.newPage();

    for (const route of routes) {
      const targetUrl = 'https://sispl.shop' + route;
      try {
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(500);

        const check = await page.evaluate(() => {
          const isDark = document.documentElement.classList.contains('dark');
          const bg = window.getComputedStyle(document.body).backgroundColor;
          const fg = window.getComputedStyle(document.body).textColor || window.getComputedStyle(document.body).color;
          return { isDark, bg, fg };
        });

        console.log('   V ' + route + ': isDark=' + check.isDark + ', bg=' + check.bg + ', fg=' + check.fg);
      } catch (err) {
        console.error('   X ' + route + ': ' + err.message);
      }
    }
    await context.close();
  }
  await browser.close();
}

runThemeAudit().catch(console.error);
