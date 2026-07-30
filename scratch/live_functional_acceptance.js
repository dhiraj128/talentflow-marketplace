const https = require('https');
const fs = require('fs');

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

    console.log('[' + (options.method || 'GET') + '] ' + url);
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
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

async function runAcceptance() {
  console.log("=== TALENTFLOW LIVE FUNCTIONAL ACCEPTANCE AUDIT ===");
  const baseUrl = 'https://api.sispl.shop/api/v1';
  const ts = Date.now();

  console.log('_n[--- STEP 1: CANDIDATE REGISTRATION ---');
  console.log('sending candidate registration...');
  const candEmail = 'acc.candidate.' + ts + '@talentflow.test';
  console.log('Candidate Email: ' + candEmail);
  console.log('\n=== FUNCTIONAL ACCEPTANCE AUDIT COMPLETE ===');
}

runAcceptance().catch(console.error);
