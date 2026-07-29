const https = require('https');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(url, {
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
  const email = `test.user.${Date.now()}@demo.com`;
  console.log('Testing with email:', email);

  const otpRes = await post('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/send-email-otp', {
    identifier: email,
    purpose: 'REGISTER'
  });
  console.log('Send OTP Response:', otpRes);

  const regRes = await post('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/register', {
    email,
    password: 'Password@123',
    role: 'CANDIDATE',
    fullName: 'Test Candidate'
  });
  console.log('Register Response:', regRes);
}

run();
