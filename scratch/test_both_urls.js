const axios = require('axios');

async function testBothUrls() {
  const urls = [
    'https://api.sispl.shop/api/v1',
    'https://talentflow-backend-qn7b.onrender.com/api/v1',
  ];

  for (const base of urls) {
    console.log(`\n--- Testing ${base} ---`);
    try {
      const h = await axios.get(`${base}/health`);
      console.log('GET /health:', h.status, JSON.stringify(h.data), 'X-Request-ID:', h.headers['x-request-id']);
    } catch (e) {
      console.log('GET /health error:', e.response?.data || e.message);
    }

    try {
      const r = await axios.get(`${base}/health/ready`);
      console.log('GET /health/ready:', r.status, JSON.stringify(r.data), 'X-Request-ID:', r.headers['x-request-id']);
    } catch (e) {
      console.log('GET /health/ready error:', e.response?.status, JSON.stringify(e.response?.data || e.message));
    }
  }
}

testBothUrls();
