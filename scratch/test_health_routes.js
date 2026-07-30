const axios = require('axios');

async function testWithCacheBuster() {
  const t = Date.now();
  const routes = [
    `https://api.sispl.shop/api/v1/health?cb=${t}`,
    `https://api.sispl.shop/api/v1/health/ready?cb=${t}`,
    `https://api.sispl.shop/health?cb=${t}`,
    `https://api.sispl.shop/health/ready?cb=${t}`,
  ];

  for (const url of routes) {
    try {
      const res = await axios.get(url, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      });
      console.log(`PASS [${res.status}] ${url}`);
      console.log('  Data:', JSON.stringify(res.data));
      console.log('  X-Request-ID Header:', res.headers['x-request-id']);
    } catch (err) {
      console.log(`FAIL [${err.response?.status || 'ERR'}] ${url}:`, err.response?.data?.message || err.message);
    }
  }
}

testWithCacheBuster();
