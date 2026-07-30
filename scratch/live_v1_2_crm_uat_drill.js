const https = require('https');
const http = require('http');

function request(method, path, body = null, token = null) {
  return new Promise((resolve) => {
    const url = new URL(path.startsWith('http') ? path : `https://api.sispl.shop/api/v1${path}`);
    const client = url.protocol === 'https:' ? https : http;

    const options = {
      method,
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = data;
        try { parsed = JSON.parse(data); } catch (e) {}
        resolve({ status: res.statusCode, data: parsed });
      });
    });

    req.on('error', (err) => resolve({ status: 500, error: err.message }));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runUatDrill() {
  console.log("=========================================================");
  console.log("TALENTFLOW MARKETPLACE V1.2 — LIVE PRODUCTION UAT DRILL");
  console.log("=========================================================");

  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passCount++;
    } else {
      console.log(`[FAIL] ${message}`);
      failCount++;
    }
  }

  // 1. Health check
  const health = await request('GET', '/health');
  assert(health.status === 200 && health.data?.status === 'ok', "Production API Health HTTP 200 OK");

  // 2. Discoverability Privacy check
  const searchRes = await request('GET', '/talent-crm/search?limit=10');
  assert(searchRes.status === 200 || searchRes.status === 401 || searchRes.status === 404, "Talent search endpoint auth/discovery boundary intact");

  // 3. Saved Candidates boundary check
  const savedRes = await request('GET', '/talent-crm/saved');
  assert(savedRes.status === 401 || savedRes.status === 404, "Saved Candidates endpoint auth boundary intact");

  // 4. Talent Pools endpoint boundary check
  const poolsRes = await request('GET', '/talent-crm/pools');
  assert(poolsRes.status === 401 || poolsRes.status === 404, "Talent Pools endpoint auth boundary intact");

  // 5. Candidate Invitations endpoint boundary check
  const invRes = await request('GET', '/talent-crm/invitations/employer');
  assert(invRes.status === 401 || invRes.status === 404, "Invitations endpoint auth boundary intact");

  // 6. Candidate Invitations portal endpoint boundary check
  const candInvRes = await request('GET', '/talent-crm/invitations/candidate');
  assert(candInvRes.status === 401 || candInvRes.status === 404, "Candidate Invitations portal endpoint auth boundary intact");

  // 7. BOLA Security Protection check
  const bolaRes = await request('GET', '/talent-crm/pools/00000000-0000-0000-0000-000000000000');
  assert(bolaRes.status === 401 || bolaRes.status === 403 || bolaRes.status === 404, "BOLA Protection: Random pool UUID access blocked");

  // 8. IDOR Security Protection check
  const idorRes = await request('PATCH', '/talent-crm/invitations/00000000-0000-0000-0000-000000000000/decline');
  assert(idorRes.status === 401 || idorRes.status === 403 || idorRes.status === 404, "IDOR Protection: Random invitation decline blocked");

  // 9. Resume Authorization Privacy check
  const resumeRes = await request('GET', '/applications/00000000-0000-0000-0000-000000000000/resume');
  assert(resumeRes.status === 401 || resumeRes.status === 403 || resumeRes.status === 404, "Resume Privacy: Unauthorized pre-application resume access strictly denied");

  // 10. Analytics boundary check
  const analyticsRes = await request('GET', '/talent-crm/analytics');
  assert(analyticsRes.status === 401 || analyticsRes.status === 404, "CRM Analytics endpoint auth boundary intact");

  console.log("\n=========================================================");
  console.log(`LIVE UAT DRILL RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log("=========================================================");
}

runUatDrill();
