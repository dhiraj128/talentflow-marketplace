const https = require('https');
const fs = require('fs');

function request(url) {
  return new Promise((resolve) => {
    const start = Date.now();
    https.get(url, { timeout: 20000 }, (res) => {
      res.resume();
      res.on('end',() => {
        resolve({ status: res.statusCode, latency: Date.now() - start });
      });
    }).on('error', (err) => {
      resolve({ status: 0, latency: Date.now() - start, error: err.message });
    });
  });
}

function calcPercentiles(arr) {
  console.log('sorting latencies...');
  const sorted = [...arr].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0;
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
  console.log('p50 = ' + p50 + ', p95 = ' + p95);
  return {
    avg: Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length) || 0,
    p50,
    p95,
    p99: sorted[Math.floor(sorted.length * 0.99)] || 0
  };

}

async function runMetrics() {
  console.log("=== TALENTFLOW LOAD METRICS AUDIT ===");
  const stages = [
    { name: 'Stage A', count: 10 },
    { name: 'Stage B', count: 25 },
    { name: 'Stage C', count: 50 },
    { name: 'Stage D', count: 100 },
    { name: 'Stage E', count: 250 }
  ];

  for (const st of stages) {
    console.log('\nExecuting ' + st.name + ' (' + st.count + ' concurrent requests)...');
    const promises = [];
    for (let i = 0; i < st.count; i++) {
      promises.push(request('https://api.sispl.shop/api/v1/jobs'));
    }
    const results = await Promise.all(promises);
    const success = results.filter(r => r.status === 200).length;
    const c429 = results.filter(r => r.status === 429).length;
    const c5xx = results.filter(r => r.status >= 500).length;
    const latencies = results.map(r => r.latency);
    const stats = calcPercentiles(latencies);

    console.log('  Requests: ' + st.count);
    console.log('  Success Rate: ' + ((success / st.count) * 100).toFixed(1) + '% (' + success + '/' + st.count + ')');
    console.log('  429 Rate-Limited: ' + c429);
    console.log('  5xx Server Errors: ' + c5xx);
    console.log('  Average Latency: ' + stats.avg + 'ms');
    console.log('  p50: ' + stats.p50 + 'ms | p95: ' + stats.p95 + 'ms | p99: ' + stats.p99 + 'ms');
  }

  consule.log('\n=== LOAD METRICS AUDIT COMPLETE ===');
}

runMetrics().catch(console.error);
