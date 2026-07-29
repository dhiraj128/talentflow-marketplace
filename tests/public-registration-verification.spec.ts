import { test, expect } from '@playwright/test';

const API_URL = 'https://talentflow-backend-qn7b.onrender.com/api/v1';

test.describe('Phase 27 — Public Registration without Mandatory Email/Phone Verification', () => {

  test('Public User Roles (Candidate, Employer, Freelancer, Trainer) can Register & Login cleanly', async ({ request }) => {
    const roles = ['CANDIDATE', 'EMPLOYER', 'FREELANCER', 'TRAINER'];

    for (const r of roles) {
      const timestamp = Date.now();
      const email = `public.${r.toLowerCase()}.${timestamp}@demo.com`;
      const password = 'Password@123';

      // 1. Register Public User
      const regRes = await request.post(`${API_URL}/auth/register`, {
        data: {
          email,
          password,
          role: r,
          fullName: `Test ${r}`
        }
      });

      expect(regRes.status(), `Registration for role ${r} must return 201 Created`).toBe(201);
      const user = await regRes.json();
      expect(user.role, `Created role must be ${r}`).toBe(r);
      expect(user.isEmailVerified, 'isEmailVerified must be false for new public user').toBe(false);

      // 2. Login Public User Immediately
      const loginRes = await request.post(`${API_URL}/auth/login`, {
        data: {
          email,
          password
        }
      });

      expect(loginRes.status(), `Login for new public ${r} must return 200 OK`).toBe(200);
      const authData = await loginRes.json();
      expect(authData.access_token, 'Access token must be returned on login').toBeDefined();
    }
  });

  test('Security: Malicious Registration Payloads (role=ADMIN, role=SUPER_ADMIN) ARE DENIED', async ({ request }) => {
    const timestamp = Date.now();

    // Attempt 1: role = ADMIN
    const adminAttempt = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `hacker.admin.${timestamp}@demo.com`,
        password: 'Password@123',
        role: 'ADMIN',
        fullName: 'Hacker Admin'
      }
    });

    expect(adminAttempt.status(), 'Public registration as ADMIN must be DENIED').toBe(400);

    // Attempt 2: role = SUPER_ADMIN
    const superAdminAttempt = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `hacker.super.${timestamp}@demo.com`,
        password: 'Password@123',
        role: 'SUPER_ADMIN',
        fullName: 'Hacker SuperAdmin'
      }
    });

    expect(superAdminAttempt.status(), 'Public registration as SUPER_ADMIN must be DENIED').toBe(400);
  });

});
