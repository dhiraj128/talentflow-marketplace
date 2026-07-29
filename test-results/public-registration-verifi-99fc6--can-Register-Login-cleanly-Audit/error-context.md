# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-registration-verification.spec.ts >> Phase 27 — Public Registration without Mandatory Email/Phone Verification >> Public User Roles (Candidate, Employer, Freelancer, Trainer) can Register & Login cleanly
- Location: tests\public-registration-verification.spec.ts:7:7

# Error details

```
Error: Registration for role CANDIDATE must return 201 Created

expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 400
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const API_URL = 'https://talentflow-backend-qn7b.onrender.com/api/v1';
  4  | 
  5  | test.describe('Phase 27 — Public Registration without Mandatory Email/Phone Verification', () => {
  6  | 
  7  |   test('Public User Roles (Candidate, Employer, Freelancer, Trainer) can Register & Login cleanly', async ({ request }) => {
  8  |     const roles = ['CANDIDATE', 'EMPLOYER', 'FREELANCER', 'TRAINER'];
  9  | 
  10 |     for (const r of roles) {
  11 |       const timestamp = Date.now();
  12 |       const email = `public.${r.toLowerCase()}.${timestamp}@demo.com`;
  13 |       const password = 'Password@123';
  14 | 
  15 |       // 1. Register Public User
  16 |       const regRes = await request.post(`${API_URL}/auth/register`, {
  17 |         data: {
  18 |           email,
  19 |           password,
  20 |           role: r,
  21 |           fullName: `Test ${r}`
  22 |         }
  23 |       });
  24 | 
> 25 |       expect(regRes.status(), `Registration for role ${r} must return 201 Created`).toBe(201);
     |                                                                                     ^ Error: Registration for role CANDIDATE must return 201 Created
  26 |       const user = await regRes.json();
  27 |       expect(user.role, `Created role must be ${r}`).toBe(r);
  28 |       expect(user.isEmailVerified, 'isEmailVerified must be false for new public user').toBe(false);
  29 | 
  30 |       // 2. Login Public User Immediately
  31 |       const loginRes = await request.post(`${API_URL}/auth/login`, {
  32 |         data: {
  33 |           email,
  34 |           password
  35 |         }
  36 |       });
  37 | 
  38 |       expect(loginRes.status(), `Login for new public ${r} must return 200 OK`).toBe(200);
  39 |       const authData = await loginRes.json();
  40 |       expect(authData.access_token, 'Access token must be returned on login').toBeDefined();
  41 |     }
  42 |   });
  43 | 
  44 |   test('Security: Malicious Registration Payloads (role=ADMIN, role=SUPER_ADMIN) ARE DENIED', async ({ request }) => {
  45 |     const timestamp = Date.now();
  46 | 
  47 |     // Attempt 1: role = ADMIN
  48 |     const adminAttempt = await request.post(`${API_URL}/auth/register`, {
  49 |       data: {
  50 |         email: `hacker.admin.${timestamp}@demo.com`,
  51 |         password: 'Password@123',
  52 |         role: 'ADMIN',
  53 |         fullName: 'Hacker Admin'
  54 |       }
  55 |     });
  56 | 
  57 |     expect(adminAttempt.status(), 'Public registration as ADMIN must be DENIED').toBe(400);
  58 | 
  59 |     // Attempt 2: role = SUPER_ADMIN
  60 |     const superAdminAttempt = await request.post(`${API_URL}/auth/register`, {
  61 |       data: {
  62 |         email: `hacker.super.${timestamp}@demo.com`,
  63 |         password: 'Password@123',
  64 |         role: 'SUPER_ADMIN',
  65 |         fullName: 'Hacker SuperAdmin'
  66 |       }
  67 |     });
  68 | 
  69 |     expect(superAdminAttempt.status(), 'Public registration as SUPER_ADMIN must be DENIED').toBe(400);
  70 |   });
  71 | 
  72 | });
  73 | 
```