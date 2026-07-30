const https = require('https');
const http = require('http');

function makeRequest(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const lib = u.protocol === 'https:' ? https : http;
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 15000,
    };
    if (body) {
      if (!reqOptions.headers['Content-Type']) {
        reqOptions.headers['Content-Type'] = 'application/json';
      }
      const data = typeof body === 'string' ? body : JSON.stringify(body);
      reqOptions.headers['Content-Length'] = Buffer.byteLength(data);
    }
    const req = lib.request(u, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch(e) {}
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data, json });
      });
    });
    req.on('error', err => resolve({ statusCode: 0, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ statusCode: 0, error: 'Timeout' }); });
    if (body) {
      const data = typeof body === 'string' ? body : JSON.stringify(body);
      req.write(data);
    }
    req.end();
  });
}

async function runAudit() {
  console.log('=== STARTING LIVE PRODUCTION ACCEPTANCE AUDIT ===\n');

  // 1. Verify Deployed Version
  console.log('--- SECTION 1: VERIFY DEPLOYED VERSION ---');
  const vercelRes = await makeRequest('https://talentflow-marketplace.vercel.app/sign-up');
  console.log('Vercel sign-up status:', vercelRes.statusCode);

  const sisplRes = await makeRequest('https://sispl.shop');
  console.log('sispl.shop status:', sisplRes.statusCode);

  const healthRes = await makeRequest('https://talentflow-backend-qn7b.onrender.com/api/v1/health');
  console.log('Render Backend Health status:', healthRes.statusCode);
  console.log('Render Backend Health payload:', healthRes.body);

  // 2. Security Test - Public Admin Signups
  console.log('\n--- SECTION 6: SECURITY TEST (PUBLIC ADMIN & PRIVILEGE ESCALATION) ---');
  const adminAttempt = await makeRequest('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/register', { method: 'POST' }, {
    email: `hacker.admin.${Date.now()}@test.com`,
    password: 'Password@123',
    role: 'ADMIN'
  });
  console.log('Public role=ADMIN registration status:', adminAttempt.statusCode, adminAttempt.body);

  const superAdminAttempt = await makeRequest('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/register', { method: 'POST' }, {
    email: `hacker.superadmin.${Date.now()}@test.com`,
    password: 'Password@123',
    role: 'SUPER_ADMIN'
  });
  console.log('Public role=SUPER_ADMIN registration status:', superAdminAttempt.statusCode, superAdminAttempt.body);

  const privilegeEscalation = await makeRequest('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/register', { method: 'POST' }, {
    email: `hacker.escalate.${Date.now()}@test.com`,
    password: 'Password@123',
    role: 'CANDIDATE',
    isAdmin: true,
    isEmailVerified: true,
    phoneVerified: true,
    status: 'ACTIVE'
  });
  console.log('Public privilege escalation attempt status:', privilegeEscalation.statusCode, privilegeEscalation.body);

  // 3. Register 4 Public Roles
  console.log('\n--- SECTION 3 & 4: REGISTER & RE-LOGIN 4 PUBLIC ROLES ---');
  const roles = [
    { role: 'CANDIDATE', fullName: 'Test Candidate User', dashRoute: '/job-seeker/dashboard' },
    { role: 'EMPLOYER', fullName: 'Test Employer User', dashRoute: '/employer/dashboard' },
    { role: 'FREELANCER', fullName: 'Test Freelancer User', dashRoute: '/freelancer/dashboard' },
    { role: 'TRAINER', fullName: 'Test Trainer User', dashRoute: '/trainer/dashboard' },
  ];

  for (const r of roles) {
    const timestamp = Date.now();
    const email = `audit.${r.role.toLowerCase()}.${timestamp}@demo.com`;
    const password = 'Password@123';

    console.log(`\nTesting Role: ${r.role} (${email})`);
    const regRes = await makeRequest('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/register', { method: 'POST' }, {
      email,
      password,
      fullName: r.fullName,
      role: r.role
    });
    console.log(`  Registration Status: ${regRes.statusCode}`);
    if (regRes.json && regRes.json.user) {
      console.log(`  User Created: ID=${regRes.json.user.id}, Status=${regRes.json.user.status}, Role=${regRes.json.user.role}`);
      console.log(`  isEmailVerified: ${regRes.json.user.isEmailVerified}, phoneVerified: ${regRes.json.user.phoneVerified}`);
    } else {
      console.log(`  Response body: ${regRes.body}`);
    }

    // Login Test
    const loginRes = await makeRequest('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/login', { method: 'POST' }, {
      email,
      password
    });
    console.log(`  Login Status: ${loginRes.statusCode}`);
    if (loginRes.json && loginRes.json.access_token) {
      console.log(`  Login SUCCESS - access_token received (length=${loginRes.json.access_token.length})`);
    } else {
      console.log(`  Login Response body: ${loginRes.body}`);
    }
  }

  // 4. Password Reset API Test
  console.log('\n--- SECTION 8: PASSWORD RESET TEST ---');
  const forgotRes = await makeRequest('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/forgot-password', { method: 'POST' }, {
    email: 'demo@admin.com'
  });
  console.log('Forgot Password request status:', forgotRes.statusCode, forgotRes.body);

  console.log('\n=== AUDIT API CHECK COMPLETED ===');
}

runAudit().catch(console.error);
