const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const viewports = [
    { width: 320, height: 800 },
    { width: 360, height: 800 },
    { width: 375, height: 800 },
    { width: 390, height: 800 },
    { width: 412, height: 800 },
    { width: 430, height: 800 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 }
  ];

  const url = 'https://talentflow-marketplace-dhiraj128.vercel.app/';

  console.log('Testing Mobile Responsiveness on Live URL...');

  const artifactsDir = 'C:\\Users\\dhira_5fqr2uc\\.gemini\\antigravity\\brain\\687a8d54-a1ef-4362-a818-d39cc74b7586\\scratch';
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  for (const vp of viewports) {
    await page.setViewportSize(vp);
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      const screenshotPath = path.join(artifactsDir, `screenshot-${vp.width}.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`Captured screenshot for ${vp.width}px`);
      
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      if (hasHorizontalScroll) {
        console.error(`Horizontal scroll detected at ${vp.width}px`);
      } else {
        console.log(`No horizontal scroll at ${vp.width}px`);
      }
    } catch (e) {
      console.error(`Failed at ${vp.width}px:`, e.message);
    }
  }

  await browser.close();
}

run();
