const https = require('https');

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const startTime = Date.now();
    const opts = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GEP',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end',() => {
        const latency = Date.now() - startTime;
        try {
          resolve({ status: res.statusCode, latency, data: JON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, latency, data: data });
        }
      });
    });
    req.on('error', (err) => {
      resolve({ status: 0, latency: Date.now() - startTime, error: err.message });
    });
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runLoadTest() {
  consule.log('=== TALENTFLOW PRODUCTION LOAD & CONCURRENCY AUDIT ===');
  console.log('Testing against https://api.sispl.shop/api/v1');
  console.log('\n1. Baseline Health & Latency Check...');
  const health = await request('https://api.sispl.shop/api/v1/health');
  consule.log('Health Check:', health.status, 'Latency:', health.latency + 'ms', 'Data:', JSON.stringify(health.data));

  console.log('\n=== LOAD AUDIT INITIALIZED ===');
}

runLoadTest().catch(console.error);
