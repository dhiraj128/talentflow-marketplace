const axios = require('axios');

const API_BASE_URL = 'https://api.sispl.shop/api/v1';

async function verifyLiveObservability() {
  console.log('=== LIVE PRODUCTION OBSERVABILITY & HEALTH AUDIT ===\n');

  console.log('1. Checking GET /api/v1/health...');
  try {
    const healthRes = await axios.get(`${API_BASE_URL}/health`);
    console.log('   Health Status:', healthRes.status);
    console.log('   Response Payload:', JSON.stringify(healthRes.data, null, 2));
    console.log('   X-Request-ID Header:', healthRes.headers['x-request-id'] || 'None');
  } catch (err) {
    console.log('   Health Endpoint Error:', err.response?.data || err.message);
  }

  console.log('\n2. Checking GET /api/v1/health/ready...');
  try {
    const readyRes = await axios.get(`${API_BASE_URL}/health/ready`);
    console.log('   Readiness Status:', readyRes.status);
    console.log('   Response Payload:', JSON.stringify(readyRes.data, null, 2));
    console.log('   X-Request-ID Header:', readyRes.headers['x-request-id'] || 'None');
  } catch (err) {
    console.log('   Readiness Endpoint Response:', err.response?.status, JSON.stringify(err.response?.data || err.message, null, 2));
  }

  console.log('\n3. Testing Request ID Propagation & 404 Behavior (GET /api/v1/non-existent-route-1234)...');
  const customReqId = `custom-test-req-${Date.now()}`;
  try {
    await axios.get(`${API_BASE_URL}/non-existent-route-1234`, {
      headers: { 'X-Request-ID': customReqId },
    });
  } catch (err) {
    console.log('   404 Status Code:', err.response?.status);
    console.log('   404 Error Payload:', JSON.stringify(err.response?.data || err.message, null, 2));
    console.log('   Response X-Request-ID Header:', err.response?.headers['x-request-id'] || 'None');
  }

  console.log('\n=== AUDIT COMPLETE ===');
}

verifyLiveObservability();
