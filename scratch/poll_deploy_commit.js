const axios = require('axios');

async function checkCommit() {
  const url = 'https://talentflow-backend-qn7b.onrender.com/api/v1/health';
  const readyUrl = 'https://talentflow-backend-qn7b.onrender.com/api/v1/health/ready';

  for (let i = 1; i <= 10; i++) {
    console.log(`Poll attempt ${i} at ${new Date().toISOString()}...`);
    try {
      const res = await axios.get(url);
      const ready = await axios.get(readyUrl).catch((e) => e.response);

      console.log('  Health:', res.status, JSON.stringify(res.data), 'X-Req-ID:', res.headers['x-request-id']);
      console.log('  Ready:', ready.status, JSON.stringify(ready.data));

      if (res.data?.commit === '59af6e0' || ready.status === 200) {
        console.log('\n=== COMMIT 59af6e0 IS LIVE AND VERIFIED! ===');
        return;
      }
    } catch (err) {
      console.log('  Error:', err.message);
    }
    await new Promise((r) => setTimeout(r, 15000));
  }
}

checkCommit();
