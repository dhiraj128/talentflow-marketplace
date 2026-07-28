import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

const ROLES_TO_TEST = [
  {
    role: 'candidate',
    userRole: 'job-seeker',
    routes: [
      '/job-seeker/dashboard',
      '/job-seeker/applications',
      '/job-seeker/interviews',
      '/job-seeker/saved-jobs',
      '/job-seeker/recommended',
      '/job-seeker/resume-center',
      '/job-seeker/resume-center/builder',
      '/job-seeker/resume-center/my-resume',
      '/job-seeker/resume-center/ats',
      '/job-seeker/resume-center/downloads',
      '/job-seeker/certificates',
      '/job-seeker/assessments',
      '/job-seeker/messages',
      '/job-seeker/notifications',
      '/job-seeker/profile',
      '/job-seeker/verification',
      '/job-seeker/settings'
    ]
  },
  {
    role: 'employer',
    userRole: 'employer',
    routes: [
      '/employer/dashboard',
      '/employer/post-job',
      '/employer/applications',
      '/employer/interviews',
      '/employer/messages',
      '/employer/shortlisted',
      '/employer/profile',
      '/employer/settings'
    ]
  },
  {
    role: 'freelancer',
    userRole: 'freelancer',
    routes: [
      '/freelancer/dashboard',
      '/freelancer/proposals',
      '/freelancer/messages',
      '/freelancer/services',
      '/freelancer/portfolio',
      '/freelancer/settings'
    ]
  },
  {
    role: 'trainer',
    userRole: 'trainer',
    routes: [
      '/trainer/dashboard',
      '/trainer/courses',
      '/trainer/live',
      '/trainer/messages',
      '/trainer/settings'
    ]
  },
  {
    role: 'admin',
    userRole: 'admin',
    routes: [
      '/admin/dashboard',
      '/admin/users',
      '/admin/employers',
      '/admin/candidates',
      '/admin/settings'
    ]
  }
];

test.describe('Production Runtime Crash & Portal Audit', () => {

  for (const roleObj of ROLES_TO_TEST) {
    test.describe(`Role: ${roleObj.role.toUpperCase()}`, () => {
      
      for (const route of roleObj.routes) {
        test(`Direct URL & Refresh Check on ${route}`, async ({ page, context }) => {
          test.setTimeout(30000);
          const pageErrors: string[] = [];
          const consoleErrors: string[] = [];

          page.on('pageerror', err => pageErrors.push(err.stack || err.message));
          page.on('console', msg => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
          });

          await context.addCookies([
            { name: 'access_token', value: 'mock-jwt-token-123', domain: 'localhost', path: '/' },
            { name: 'user_role', value: roleObj.userRole, domain: 'localhost', path: '/' }
          ]);

          await page.addInitScript((r) => {
            window.localStorage.setItem('access_token', 'mock-jwt-token-123');
            window.localStorage.setItem('user', JSON.stringify({
              id: `user-${r}-123`,
              email: `${r}@demo.com`,
              name: `Demo ${r}`,
              role: r === 'candidate' ? 'job-seeker' : r,
              profile: { id: `profile-${r}-123` }
            }));
          }, roleObj.role);

          // Direct Load
          const resp = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
          await page.waitForTimeout(400);

          const bodyText = await page.evaluate(() => document.body?.innerText || '');
          const isErrorPage = bodyText.includes('Something went wrong!');

          if (isErrorPage || pageErrors.length > 0) {
            console.log(`❌ [CRASH] ${route} -> Page Errors:`, JSON.stringify(pageErrors), `Console Errors:`, JSON.stringify(consoleErrors));
          }

          expect(isErrorPage, `Route ${route} rendered global error boundary`).toBe(false);
          expect(pageErrors.length, `Route ${route} threw unhandled page error: ${pageErrors.join('; ')}`).toBe(0);

          // Hard Refresh
          await page.reload({ waitUntil: 'networkidle' });
          await page.waitForTimeout(300);

          const refreshBody = await page.evaluate(() => document.body?.innerText || '');
          expect(refreshBody.includes('Something went wrong!'), `Route ${route} rendered global error boundary on refresh`).toBe(false);
        });
      }
    });
  }

});
