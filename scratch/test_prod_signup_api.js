const https = require('https');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const u = new URL(url);
    const req = https.request(u, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let b = '';
      res.on('data', chunk => b += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  const timestamp = Date.now();
  const email = `test.signup.${timestamp}@demo.com`;
  console.log('Testing direct API registration for:', email);

  const res = await post('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/register', {
    email,
    password: 'Password@123',
    role: 'CANDIDATE',
    fullName: 'Test Candidate'
  });

  console.log('API Register Response Status:', res.status);
  console.log('API Register Response Body:', res.body);
}

run();
