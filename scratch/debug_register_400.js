const https = require('https');

const data = JSON.stringify({
  email: `debug.user.${Date.now()}@demo.com`,
  password: 'Password@123',
  role: 'CANDIDATE',
  fullName: 'Debug Candidate'
});

const req = https.request('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Body:', body));
});

req.write(data);
req.end();
