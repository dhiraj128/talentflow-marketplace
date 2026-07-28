import { test, expect } from '@playwright/test';

const ROUTES = [
  '/',
  '/sign-in',
  '/sign-up',
  '/find-jobs',
  '/find-jobs/job-1',
  '/find-freelancers',
  '/find-freelancers/1',
  '/find-talent',
  '/find-talent/cand-1',
  '/find-courses',
  '/find-courses/react-adv',
  '/company/acme-corp',
  '/blog',
  '/pricing',
  '/about',
  '/contact',
  '/faq',
  '/job-seeker/dashboard',
  '/job-seeker/profile',
  '/job-seeker/messages',
  '/job-seeker/notifications',
  '/job-seeker/applications',
  '/job-seeker/interviews',
  '/job-seeker/resume-center',
  '/employer/dashboard',
  '/employer/post-job',
  '/employer/applications',
  '/employer/interviews',
  '/employer/messages',
  '/employer/shortlisted',
  '/freelancer/dashboard',
  '/freelancer/proposals',
  '/freelancer/messages',
  '/freelancer/services',
  '/trainer/dashboard',
  '/trainer/courses',
  '/trainer/messages',
  '/admin/dashboard',
  '/admin/users'
];

const BASE_URL = 'https://talentflow-marketplace-dhiraj128.vercel.app';

for (const route of ROUTES) {
  test(`Production Crash Check for ${route}`, async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    const failedRequests: any[] = [];

    page.on('pageerror', err => {
      pageErrors.push(err.stack || err.message);
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('response', resp => {
      if (resp.status() >= 400) {
        failedRequests.push({ url: resp.url(), status: resp.status() });
      }
    });

    const url = `${BASE_URL}${route}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);

    const bodyText = await page.evaluate(() => document.body?.innerText || '');
    const isErrorPage = bodyText.includes("Something went wrong!");

    if (isErrorPage || pageErrors.length > 0) {
      console.log(`❌ [LIVE CRASH DETECTED] ${route}`);
      console.log(`   URL: ${url}`);
      console.log(`   Page Errors:`, JSON.stringify(pageErrors, null, 2));
      console.log(`   Console Errors:`, JSON.stringify(consoleErrors, null, 2));
      console.log(`   Failed Requests:`, JSON.stringify(failedRequests, null, 2));
    } else {
      console.log(`✅ [PASS] ${route}`);
    }

    expect(isErrorPage, `Route ${route} rendered global error boundary "Something went wrong!"`).toBe(false);
    expect(pageErrors.length, `Route ${route} threw unhandled page error: ${pageErrors.join('; ')}`).toBe(0);
  });
}
