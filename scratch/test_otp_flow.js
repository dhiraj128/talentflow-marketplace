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
  const email = `test.otp.${timestamp}@demo.com`;
  console.log('1. Sending Email OTP for:', email);

  const otpRes = await post('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/send-email-otp', {
    identifier: email,
    purpose: 'REGISTER'
  });
  console.log('OTP Send Status:', otpRes.status, otpRes.body);

  const otpObj = JSON.parse(otpRes.body);
  const code = otpObj.otp || '123456';

  console.log('2. Verifying OTP with code:', code);
  const verifyRes = await post('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/verify-email-otp', {
    identifier: email,
    code,
    purpose: 'REGISTER'
  });
  console.log('Verify Status:', verifyRes.status, verifyRes.body);

  console.log('3. Registering account for:', email);
  const regRes = await post('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/register', {
    email,
    verificationMethod: 'EMAIL',
    password: 'Password@123',
    role: 'CANDIDATE',
    fullName: 'OTP Test Candidate'
  });
  console.log('Register Status:', regRes.status, regRes.body);
}

run();
