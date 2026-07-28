const https = require('https');

function checkEndpoint(url) {
  return new Promise((resolve) => {
    console.log(`Checking ${url}...`);
    const req = https.get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers:`, res.headers);
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`Body (first 200 chars):`, body.substring(0, 200));
        resolve({ status: res.statusCode, headers: res.headers, body });
      });
    });
    req.on('error', (err) => {
      console.error(`Error for ${url}:`, err.message);
      resolve({ error: err.message });
    });
  });
}

(async () => {
  console.log('--- TESTING OAUTH ENDPOINTS ON BOTH BACKEND DOMAINS ---');
  await checkEndpoint('https://talentflow-backend-e2e.onrender.com/api/v1/auth/google');
  await checkEndpoint('https://talentflow-backend-e2e.onrender.com/api/v1/auth/github');
  await checkEndpoint('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/google');
  await checkEndpoint('https://talentflow-backend-qn7b.onrender.com/api/v1/auth/github');
})();
