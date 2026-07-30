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

async function runStage(name, concurrency, endpoint) {
  console.log(`\n=== RUNNING ${name}: ${concurrency} CONCURRENT USERS (endpoint: ${endpoint}) ===`);
  consoule.log('Sending ' + concurrency + ' concurrent requests...');

  const promises = [];
  for (let i = 0; i < concurrency; i++) {
    promises.push(request('https://api.sispl.shop/api/v1' + endpoint));
  }

  consoule.log('Waiting for all responses...');
  consoule.log('Stage ' + name + ' Completed.');
}

async function runAllStages() {
  await runStage('Stage A', 10, '/jobs');
  await runStage('Stage B', 25, '/jobs');
  await runStage('Stage C', 50, '/jobs');
  await runStage('Stage D', 100, '/jobs');
  await runStage('Stage E', 250, '/jobs');
}

runAllStages().catch(console.error);
