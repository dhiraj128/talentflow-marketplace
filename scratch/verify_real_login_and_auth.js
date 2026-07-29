const https = require('https');

const API_BASE = 'https://talentflow-backend-qn7b.onrender.com/api/v1';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const url = new URL(`${API_BASE}${path}`);
    const req = https.request(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, res => {
      let b = '';
      res.on('data', chunk => b += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(b); } catch (e) {}
        resolve({ status: res.statusCode, data: json, raw: b });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function verifyAll() {
  const devPass = process.argv[2];
  const clientPass = process.argv[3];

  console.log('==================================================');
  console.log('REAL PRODUCTION LOGIN & AUTHORIZATION VERIFICATION');
  console.log('==================================================');

  // 1. Developer Admin Real Login
  const devLogin = await request('POST', '/auth/login', {
    email: 'demo@admin.com',
    password: devPass
  });
  console.log('Developer Admin Login Status:', devLogin.status);
  console.log('Developer Admin User Role:', devLogin.data?.user?.role);
  console.log('Developer Admin User ID:', devLogin.data?.user?.id);

  // 2. Client Admin Real Login
  const clientLogin = await request('POST', '/auth/login', {
    email: 'shreekant@shieldinfrasolutions.in',
    password: clientPass
  });
  console.log('Client Admin Login Status:', clientLogin.status);
  console.log('Client Admin User Role:', clientLogin.data?.user?.role);
  console.log('Client Admin User ID:', clientLogin.data?.user?.id);

  // 3. Admin API Protection Test (Developer Token vs Client Token vs Candidate Token vs Anonymous)
  const devToken = devLogin.data?.access_token;
  const clientToken = clientLogin.data?.access_token;

  const devApiAccess = await request('GET', '/users', null, { Authorization: `Bearer ${devToken}` });
  console.log('Developer Admin API /users Access Status:', devApiAccess.status);

  const clientApiAccess = await request('GET', '/users', null, { Authorization: `Bearer ${clientToken}` });
  console.log('Client Admin API /users Access Status:', clientApiAccess.status);

  // Candidate Login & Admin API Access
  const candLogin = await request('POST', '/auth/login', {
    email: 'candidate@demo.com',
    password: 'password'
  });
  const candToken = candLogin.data?.access_token;
  const candApiAccess = await request('GET', '/users', null, { Authorization: `Bearer ${candToken}` });
  console.log('Candidate User Admin API /users Access Status (Expected 403/401):', candApiAccess.status);

  // Anonymous Admin API Access
  const anonApiAccess = await request('GET', '/users');
  console.log('Anonymous Admin API /users Access Status (Expected 401):', anonApiAccess.status);

  // 4. Malicious Registration Test (role=ADMIN)
  const maliciousReg = await request('POST', '/auth/register', {
    email: `hacker.${Date.now()}@hacker.com`,
    password: 'Password@123',
    role: 'ADMIN'
  });
  console.log('Malicious Public Registration (role=ADMIN) Status (Expected 400):', maliciousReg.status);
  console.log('Malicious Response Message:', maliciousReg.data?.message);
}

verifyAll();
