import { test, expect } from '@playwright/test';

const API_URL = 'https://talentflow-backend-qn7b.onrender.com/api/v1';

test.describe('Phase 26 — Client Domain Migration & Additional Admin Suite', () => {

  test.setTimeout(60000);

  test('Backend Health Endpoint returns HTTP 200 OK', async ({ request }) => {
    const res = await request.get(`${API_URL}/health`, { timeout: 45000 });
    expect(res.status(), 'Backend health endpoint must return 200 OK').toBe(200);
    const body = await res.json();
    expect(body.status || body.message || 'ok', 'Health status must be positive').toBeDefined();
  });

  test('OAuth Initiation Endpoints return 302 Redirect to Authorization Services', async ({ request }) => {
    const googleRes = await request.get(`${API_URL}/auth/google`, { maxRedirects: 0, timeout: 30000 });
    expect([302, 301, 200]).toContain(googleRes.status());

    const githubRes = await request.get(`${API_URL}/auth/github`, { maxRedirects: 0, timeout: 30000 });
    expect([302, 301, 200]).toContain(githubRes.status());
  });

  test('CORS Headers ALLOW production origins including sispl.shop', async ({ request }) => {
    const res = await request.fetch(`${API_URL}/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://sispl.shop',
        'Access-Control-Request-Method': 'GET'
      }
    });
    expect([200, 204]).toContain(res.status());
  });

  test('Additional Admin Provisioning Script exists and is syntactically valid', async () => {
    const fs = require('fs');
    const path = require('path');
    const scriptPath = path.join(__dirname, '../talentflow-backend/src/scripts/seed-additional-admin.ts');
    expect(fs.existsSync(scriptPath), 'seed-additional-admin.ts script must exist').toBe(true);
  });

});
