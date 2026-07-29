const http = require('http');

function postLocal(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
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
  const email = `test.local.${Date.now()}@demo.com`;
  console.log('Testing local registration with:', email);
  const regRes = await postLocal('http://localhost:3000/api/v1/auth/register', {
    email,
    password: 'Password@123',
    role: 'CANDIDATE',
    fullName: 'Test Candidate'
  });
  console.log('Local Register Response:', regRes);
}

run();
