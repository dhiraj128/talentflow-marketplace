const axios = require('axios');

async function pollDeploy() {
  const url = 'https://api.sispl.shop/api/v1/health';
  const readyUrl = 'https://api.sispl.shop/api/v1/health/ready';

  for (let i = 1; i <= 9; i++) {
    console.log(`Poll attempt ${i}...`);
    try {
      const res = await axios.get(url);
      const readyRes = await axios.get(readyUrl).catch((e) => e.response);

      console.log('  Health:', res.status, JSON.stringify(res.data), 'X-Request-ID:', res.headers['x-request-id']);
      console.log('  Ready:', readyRes.status, JSON.stringify(readyRes.data));

      if (res.data?.version === '1.0.2' || res.headers['x-request-id']) {
        console.log('\n=== NEW DEPLOYMENT IS LIVE! ===');
        return;
      }
    } catch (err) {
      console.log('  Error:', err.message);
    }
    await new Promise((r) => setTimeout(r, 10000));
  }
}

pollDeploy();
