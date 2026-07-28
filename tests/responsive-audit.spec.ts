import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '320', width: 320, height: 568 },
  { name: '360', width: 360, height: 800 },
  { name: '375', width: 375, height: 667 },
  { name: '390', width: 390, height: 844 },
  { name: '412', width: 412, height: 915 },
  { name: '430', width: 430, height: 932 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1280', width: 1280, height: 720 },
  { name: '1366', width: 1366, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 }
];

const PAGES = [
  { name: 'Find Jobs', path: '/find-jobs' },
  { name: 'Find Freelancers', path: '/find-freelancers' },
  { name: 'Find Courses', path: '/find-courses' },
  { name: 'Find Talent', path: '/find-talent' },
  { name: 'Job Seeker Messages', path: '/job-seeker/messages' },
  { name: 'Job Seeker Profile', path: '/job-seeker/profile' },
  { name: 'Employer Dashboard', path: '/employer/dashboard' },
  { name: 'Trainer Dashboard', path: '/trainer/dashboard' }
];

for (const p of PAGES) {
  for (const vp of VIEWPORTS) {
    test(`[${p.name}] Overflow Check at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:3000${p.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      const metrics = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const overflowing: any[] = [];

        if (docWidth > winWidth) {
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1 || rect.left < -1) {
              overflowing.push({
                tag: el.tagName,
                class: el.className?.toString().substring(0, 50),
                right: rect.right,
                width: rect.width,
                text: el.textContent?.substring(0, 25).trim()
              });
            }
          });
        }

        return { docWidth, winWidth, overflowing: overflowing.slice(0, 5) };
      });

      console.log(`URL: ${p.path} @ ${vp.width}px -> ScrollWidth: ${metrics.docWidth}px, Viewport: ${metrics.winWidth}px`);
      if (metrics.overflowing.length > 0) {
        console.log(`   Overflowing elements:`, JSON.stringify(metrics.overflowing, null, 2));
      }

      expect(metrics.docWidth, `Document scrollWidth (${metrics.docWidth}px) exceeds viewport innerWidth (${metrics.winWidth}px) on ${p.path} @ ${vp.width}px`).toBeLessThanOrEqual(metrics.winWidth);
    });
  }
}
