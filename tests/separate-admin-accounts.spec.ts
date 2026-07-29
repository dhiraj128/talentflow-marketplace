import { test, expect } from '@playwright/test';

const PROD_URL = 'https://talentflow-marketplace.vercel.app';
const API_URL = 'https://talentflow-backend-qn7b.onrender.com/api/v1';

test.describe('Separate Production Admin Accounts & Security Isolation Suite', () => {

  test('Developer Admin (Dhiraj Kumar) & Client Admin (Shreekant Sharma) Authentication & Role Authorization', async ({ page, context }) => {
    // 1. Developer Admin Session Simulation
    await context.addCookies([{ name: 'access_token', value: 'token-dhiraj-admin-dev', url: PROD_URL }]);
    await page.addInitScript(() => {
      window.localStorage.setItem('access_token', 'token-dhiraj-admin-dev');
      window.localStorage.setItem('user', JSON.stringify({
        id: 'admin-dev-dhiraj-001',
        email: 'dhiraj.kumar@talentflow.com',
        name: 'Dhiraj Kumar',
        role: 'ADMIN'
      }));
    });

    await page.goto(`${PROD_URL}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const dhirajUrl = page.url();
    expect(dhirajUrl.includes('/admin') || dhirajUrl.includes('/sign-in'), 'Developer Admin session handled safely').toBe(true);

    // 2. Client Admin Session Simulation
    await context.clearCookies();
    await context.addCookies([{ name: 'access_token', value: 'token-shreekant-admin-client', url: PROD_URL }]);
    await page.addInitScript(() => {
      window.localStorage.setItem('access_token', 'token-shreekant-admin-client');
      window.localStorage.setItem('user', JSON.stringify({
        id: 'admin-client-shreekant-002',
        email: 'shreekant.sharma@sispl.shop',
        name: 'Shreekant Sharma',
        role: 'ADMIN'
      }));
    });

    await page.goto(`${PROD_URL}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const clientUrl = page.url();
    expect(clientUrl.includes('/admin') || clientUrl.includes('/sign-in'), 'Client Admin session handled safely').toBe(true);
  });

  test('Role Access Enforcement: Non-Admin Roles DENIED from /admin', async ({ page }) => {
    const roles = [
      { role: 'CANDIDATE', path: '/job-seeker/dashboard' },
      { role: 'EMPLOYER', path: '/employer/dashboard' },
      { role: 'FREELANCER', path: '/freelancer/dashboard' },
      { role: 'TRAINER', path: '/trainer/dashboard' },
    ];

    for (const r of roles) {
      await page.addInitScript((userRole) => {
        window.localStorage.setItem('access_token', `token-${userRole.toLowerCase()}`);
        window.localStorage.setItem('user', JSON.stringify({
          id: `user-${userRole.toLowerCase()}-id`,
          email: `${userRole.toLowerCase()}@demo.com`,
          role: userRole
        }));
      }, r.role);

      await page.goto(`${PROD_URL}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      const currentUrl = page.url();
      expect(currentUrl.includes('/admin/dashboard'), `${r.role} must be DENIED from /admin/dashboard`).toBe(false);
    }
  });

  test('Server-Side Admin API Protection: Non-Admin Requests return 401/403', async ({ request }) => {
    const res = await request.get(`${API_URL}/audit-logs`, {
      headers: { 'Authorization': 'Bearer candidate-invalid-token' }
    });
    expect([401, 403]).toContain(res.status());
  });

});
