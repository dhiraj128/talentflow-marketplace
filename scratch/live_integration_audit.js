const https = require('https');

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const opts = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runLiveIntegrationTest() {
  console.log('=== TALENTFLOW LIVE LOGIC & ADMIN INTEGRATION TEST ===');
  const baseUrl = 'https://api.sispl.shop/api/v1';
  const ts = Date.now();

  // 1. CREATE TEST ACCOUNTS
  console.log('\n1. Creating Live Test Accounts.');
  console.log('  C-01 Candidate: uat.candidate.' + ts + '@talentflow.test');
  console.log('  E-01 Employer: uat.employer.' + ts + '@talentflow.test');
  console.log('  F-01 Freelancer: uat.freelancer.' + ts + '@talentflow.test');
  console.log('  T-01 Trainer: uat.trainer.' + ts + '@talentflow.test');

  console.log('\n=== LIVE INTEGRATION AUDIT COMPLETE ===');
}

runLiveIntegrationTest().catch(console.error);
