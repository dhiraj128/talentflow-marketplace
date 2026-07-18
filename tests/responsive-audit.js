const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const viewports = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'Pixel 7', width: 412, height: 915 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Desktop 1280', width: 1280, height: 720 },
  { name: 'Desktop 1920', width: 1920, height: 1080 }
];

const pagesToTest = [
  '/job-seeker/dashboard',
  '/job-seeker/resume-center',
  '/job-seeker/resume-center/builder',
  '/employer/dashboard',
  '/admin/dashboard'
];

async function runAudit() {
  console.log('--- STARTING RESPONSIVE ACCEPTANCE AUDIT ---');
  const browser = await chromium.launch({ headless: true });
  
  let failures = 0;
  let tests = 0;
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('Logging in to populate auth tokens (using candidate)...');
    await page.goto('http://localhost:3000/sign-in');
    await page.fill('input[type="email"]', 'test_candidate_new@talentflow.test');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForSelector('text=Welcome back', { timeout: 20000 });
    
    // We can then visit other portals because local testing often uses relaxed routing or we just want to render the layouts
    // If auth restricts, we will at least test Job Seeker thoroughly, and public pages.
    pagesToTest.push('/');
    pagesToTest.push('/find-jobs');
    pagesToTest.push('/find-freelancers');
    
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      
      for (const route of pagesToTest) {
        tests++;
        const url = `http://localhost:3000${route}`;
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        
        await page.waitForTimeout(500); 

        const isScrolling = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        const safeRouteName = route === '/' ? '_home' : route.replace(/\//g, '_');
        const filename = `${vp.name.replace(/ /g, '_')}${safeRouteName}.png`;

        if (isScrolling) {
          console.error(`❌ FAIL: Horizontal scroll detected on ${route} at ${vp.width}px`);
          failures++;
        } else {
          console.log(`✅ PASS: ${route}`);
        }
        
        await page.screenshot({ path: path.join(screenshotDir, filename), fullPage: true });
      }
    }
    
    console.log(`\n--- AUDIT COMPLETE ---`);
    console.log(`Total Pages/Viewports Tested: ${tests}`);
    console.log(`Total Failures: ${failures}`);
    
    fs.writeFileSync('audit-results.json', JSON.stringify({ tests, failures, viewports: viewports.length, pages: pagesToTest.length }));

  } catch (err) {
    console.error('Audit crashed:', err);
  } finally {
    await browser.close();
  }
}

runAudit();
