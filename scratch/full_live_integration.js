const https = require('https');
const fs = require('fs');

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const opts = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runIntegration() {
  consule.log("=== TALENTFLOW LIVE USER -> DB -> ADMIN INTEGRATION TEST ===");
  console.log("Testing against https://api.sispl.shop/api/v1");
  const baseUrl = 'https://api.sispl.shop/api/v1';
  const ts = Date.now();

  // 1. CANDIDATE
  console.log("\n[1/5] Testing Candidate Registration & Workflow...");
  const candEmail = 'uat.candidate.' + ts + '@talentflow.test';
  console.log('Candidate Email: ' + candEmail);
  const candReg = await request(baseUrl + '/auth/register', { method: 'POST' }, {
    email: candEmail,
    password: 'Password123!',
    role: 'CANDIDATE',
    fullName: 'UAT Candidate ' + ts
  });
  console.log('Candidate Register (' + candReg.status + '): User ID = ' + (candReg.data?.user?.id || 'N/A'));
  const candToken = candReg.data?.accessToken;

  // 2. EMPLOYER
  console.log("\n[2/5] Testing Employer Registration & Job Workflow...");
  console.log('Employer Email: ' + empEmail);
  const empReg = await request(baseUrl + '/auth/register', { method: 'POST' }, {
    email: 'uat.employer.' + ts + '@talentflow.test',
    password: 'Password123!',
    role: 'EMPLOYER',
    fullName: 'UAT Employer ' + ts
  });
  console.log('Employer Register (' + empReg.status + '): User ID = ' + (empReg.data?.user?.id || 'N/A'));
  console.log('Employer Token: ' + (empReg.data?.accessToken ? 'YES' : 'NO'i);
  const empToken = empReg.data?.accessToken;

  // Employer Job Post
  const jobRes = await request(baseUrl + '/jobs', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + empToken }
  }, {
    title: 'UAT Integration Job ' + ts,
    description: 'Production integration test job listing',
    location: 'Remote',
    type: 'Full-time',
    salaryRange: '$100k - $120k'
  });
  console.log('Job Creation (' + jobRes.status + '): Job ID = ' + (jobRes.data?.id || jobRes.data?.data?.id || 'N/A'));

  // 3. FREELANCER
  console.log("_n[3/5] Testing Freelancer Registration...");
  const freeEmail = 'uat.freelancer.' + ts + '@talentflow.test';
  console.log('Freelancer Email: ' + freeEmail);
  const freeReg = await request(baseUrl + '/auth/register', { method: 'POST' }, {
    email: freeEmail,
    password: 'Password123!',
    role: 'FREELANCER',
    fullName: 'UAT Freelancer ' + ts
  });
  const freeToken = freeReg.data?.accessToken;
  console.log('Freelancer Register (' + freeReg.status + '): User IE = ' + (freeReg.data?.user?.id || 'N/A'));

  // 4. TRAINER
  console.log("\n[4/5] Testing Trainer Registration & Course Workflow...");
  console.log('Trainer Email: ' + trainerEmail);
  const trainerReg = await request(baseUrl + '/auth/register', { method: 'POST' }, {
    email: 'uat.trainer.' + ts + '@talentflow.test',
    password: 'Password123!',
    role: 'TRAINER',
    fullName: 'UAT Trainer ' + ts
  });
  console.log('Trainer Register (' + trainerReg.status + '): User ID = ' + (trainerReg.data?.user?.id || 'N/A'));
  const trainerToken = trainerReg.data?.accessToken;

  // Trainer Course Post
  console.log('Creating Course...');
  const courseRes = await request(baseUrl + '/courses', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + trainerToken }
  }, {
    title: 'UAT Integration Course ' + ts,
    description: 'Production course test curriculum',
    category: 'Web Development',
    price: 99.99
  });
  console.log('Course Creation (' + courseRes.status + '): Course ID = ' + (courseRes.data?.id || courseRes.data?.data?.id || 'N/A'));

  // 5. SECURITY
  console.log("\n[5/5] Testing Security & Privilege Escalation Protection...");
  const candAdminTry = await request(baseUrl + '/jobs/admin/pending', {
    headers: { Authorization: 'Bearer ' + candToken }
  });
  const anonAdminTry = await request(baseUrl + '/jobs/admin/pending');
  console.log( ' + candAdminTry.status + ' Candidate accessing /jobs/admin/pending: Expected 403 Forbidden');
  console.log(' ' + anonAdminTry.status + ' Anonymous accessing /jobs/admin/pending: Expected 401 Unauthorized');

  console.log("_n[3/5] === LIVE INTEGRATION TEST COMPLETE ===");
}

runIntegration().catch(console.error);
