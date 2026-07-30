const https = require('https');

console.log("=================================================================");
console.log("TALENTFLOW V1.2.1 LIVE PRODUCTION INTEGRATION & UAT DRILL");
console.log("=================================================================");

function makeRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: data ? JSON.parse(data) : {} });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', (err) => reject(err));
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}

async function runDrill() {
  let passed = 0;
  let total = 0;

  // 1. Health check
  total++;
  try {
    const res = await makeRequest('https://api.sispl.shop/api/v1/health');
    if (res.status === 200) {
      console.log(`[PASS] Production API Health check: HTTP ${res.status}`);
      passed++;
    } else {
      console.error(`[FAIL] Production API Health check: HTTP ${res.status}`);
    }
  } catch (e) {
    console.error(`[FAIL] Production API Health check error: ${e.message}`);
  }

  // 2. Jobs list endpoint
  total++;
  try {
    const res = await makeRequest('https://api.sispl.shop/api/v1/jobs');
    if (res.status === 200) {
      console.log(`[PASS] Public Marketplace Jobs endpoint: HTTP ${res.status}`);
      passed++;
    } else {
      console.error(`[FAIL] Public Marketplace Jobs endpoint: HTTP ${res.status}`);
    }
  } catch (e) {
    console.error(`[FAIL] Public Marketplace Jobs endpoint error: ${e.message}`);
  }

  // 3. Saved Jobs anonymous RBAC guard
  total++;
  try {
    const res = await makeRequest('https://api.sispl.shop/api/v1/jobs/saved/my-saved-jobs');
    if (res.status === 401) {
      console.log(`[PASS] Saved Jobs Anonymous RBAC Guard: HTTP ${res.status} (Protected)`);
      passed++;
    } else {
      console.error(`[FAIL] Saved Jobs Anonymous RBAC Guard: HTTP ${res.status} (Expected 401)`);
    }
  } catch (e) {
    console.error(`[FAIL] Saved Jobs Anonymous RBAC Guard error: ${e.message}`);
  }

  // 4. Recommended Jobs anonymous RBAC guard
  total++;
  try {
    const res = await makeRequest('https://api.sispl.shop/api/v1/jobs/recommended');
    if (res.status === 401) {
      console.log(`[PASS] Recommended Jobs Anonymous RBAC Guard: HTTP ${res.status} (Protected)`);
      passed++;
    } else {
      console.error(`[FAIL] Recommended Jobs Anonymous RBAC Guard: HTTP ${res.status} (Expected 401)`);
    }
  } catch (e) {
    console.error(`[FAIL] Recommended Jobs Anonymous RBAC Guard error: ${e.message}`);
  }

  console.log("=================================================================");
  console.log(`LIVE PRODUCTION INTEGRATION DRILL SUMMARY: ${passed}/${total} PASS`);
  console.log("=================================================================");
  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runDrill();
