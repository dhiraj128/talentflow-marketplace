const https = require('https');

const API_BASE = 'https://api.sispl.shop/api/v1';

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function getToken(email, password, role, companyName) {
  // 1. Try register
  let reg = await request('POST', '/auth/register', {
    email,
    password,
    role,
    ...(companyName ? { companyName } : {}),
  });

  let token = reg.body.accessToken || reg.body.token || reg.body.data?.accessToken;
  if (!token) {
    // Try login
    let login = await request('POST', '/auth/login', { email, password });
    token = login.body.accessToken || login.body.token || login.body.data?.accessToken;
  }
  return token;
}

async function runUatDrill() {
  console.log('================================================================');
  console.log('TALENTFLOW V1.1 HIRING PIPELINE LIVE PRODUCTION UAT DRILL');
  console.log('Target API:', API_BASE);
  console.log('================================================================\n');

  const results = [];

  function record(testName, passed, details = '') {
    results.push({ testName, passed, details });
    const mark = passed ? '[PASS]' : '[FAIL]';
    console.log(`${mark} ${testName} ${details ? `- ${details}` : ''}`);
  }

  try {
    const timestamp = Date.now();
    const candAEmail = `uat_cand_v11_a_${timestamp}@sispl.shop`;
    const empAEmail = `uat_emp_v11_a_${timestamp}@sispl.shop`;
    const candBEmail = `uat_cand_v11_b_${timestamp}@sispl.shop`;
    const empBEmail = `uat_emp_v11_b_${timestamp}@sispl.shop`;
    const defaultPassword = 'UatTestPassword123!';

    console.log('--- Phase 10: UAT Account & Resource Creation ---');

    const tokenCandA = await getToken(candAEmail, defaultPassword, 'CANDIDATE');
    record('Candidate A Authentication', !!tokenCandA, `Token acquired`);

    const meCandA = await request('GET', '/auth/me', null, tokenCandA);
    const candAProfileId = meCandA.body.profile?.id || meCandA.body.candidateProfile?.id || meCandA.body.id;

    const tokenEmpA = await getToken(empAEmail, defaultPassword, 'EMPLOYER', 'UAT Corp A V1.1');
    record('Employer A Authentication', !!tokenEmpA, `Token acquired`);

    const tokenCandB = await getToken(candBEmail, defaultPassword, 'CANDIDATE');
    const tokenEmpB = await getToken(empBEmail, defaultPassword, 'EMPLOYER', 'UAT Corp B V1.1');

    // Create UAT Job under Employer A
    const createJobRes = await request('POST', '/jobs', {
      title: `V1.1 Senior Pipeline Engineer ${timestamp}`,
      description: 'UAT Job posting for V1.1 hiring pipeline verification',
      location: 'Remote',
      salary: '$140,000 - $180,000',
      type: 'FULL_TIME',
    }, tokenEmpA);
    const uatJobId = createJobRes.body.id || createJobRes.body.data?.id;
    record('Employer A UAT Job Creation', !!uatJobId, `Job ID: ${uatJobId}`);

    console.log('\n--- Phase 11: Happy-Path Live UAT (Apply -> Shortlist -> Interview -> Offer -> Hire) ---');

    // Candidate A Applies
    const applyRes = await request('POST', '/applications', {
      jobId: uatJobId,
      candidateId: candAProfileId,
    }, tokenCandA);
    const appIdA = applyRes.body.id || applyRes.body.data?.id;
    const initialStatus = applyRes.body.status || applyRes.body.data?.status;
    record('Step 1: Candidate A Apply', applyRes.status === 201 || applyRes.status === 200, `App ID: ${appIdA}, Initial Status: ${initialStatus}`);

    // Step 2: Employer A Shortlists Candidate A
    const shortlistRes = await request('PATCH', `/applications/${appIdA}/status`, {
      status: 'SHORTLISTED',
      reason: 'Candidate profile matches tech stack',
    }, tokenEmpA);
    record('Step 2: Employer A Shortlist', shortlistRes.body.status === 'SHORTLISTED' || shortlistRes.body.data?.status === 'SHORTLISTED', `Status: ${shortlistRes.body.status || shortlistRes.body.data?.status}`);

    // Step 3: Employer A Moves to Interviewing
    const interviewRes = await request('PATCH', `/applications/${appIdA}/status`, {
      status: 'INTERVIEWING',
      reason: 'Technical interview scheduled',
    }, tokenEmpA);
    record('Step 3: Employer A Interviewing Stage', interviewRes.body.status === 'INTERVIEWING' || interviewRes.body.data?.status === 'INTERVIEWING', `Status: ${interviewRes.body.status || interviewRes.body.data?.status}`);

    // Step 4: Employer A Extends Offer
    const offerRes = await request('PATCH', `/applications/${appIdA}/status`, {
      status: 'OFFERED',
      reason: 'Formal job offer extended',
    }, tokenEmpA);
    record('Step 4: Employer A Offer Extended', offerRes.body.status === 'OFFERED' || offerRes.body.data?.status === 'OFFERED', `Status: ${offerRes.body.status || offerRes.body.data?.status}`);

    // Step 5: Employer A Hires Candidate A
    const hireRes = await request('PATCH', `/applications/${appIdA}/status`, {
      status: 'HIRED',
      reason: 'Offer accepted, candidate hired',
    }, tokenEmpA);
    record('Step 5: Employer A Hire Completed', hireRes.body.status === 'HIRED' || hireRes.body.data?.status === 'HIRED', `Status: ${hireRes.body.status || hireRes.body.data?.status}`);

    // Terminal State Validation: Attempt transition from HIRED to APPLIED
    const invalidFromHired = await request('PATCH', `/applications/${appIdA}/status`, {
      status: 'APPLIED',
    }, tokenEmpA);
    record('Terminal State Security (HIRED -> APPLIED Rejection)', invalidFromHired.status === 400 || invalidFromHired.status === 409, `HTTP Status: ${invalidFromHired.status}`);

    console.log('\n--- Phase 12 & 13: Status History & Candidate Tracker Verification ---');

    // Fetch Status History
    const historyRes = await request('GET', `/applications/${appIdA}/history`, null, tokenCandA);
    const historyArray = Array.isArray(historyRes.body) ? historyRes.body : historyRes.body.data || [];
    record('Status History Persistence', historyArray.length >= 4, `Events logged: ${historyArray.length}`);

    // Candidate Application Detail
    const candidateAppView = await request('GET', `/applications/${appIdA}`, null, tokenCandA);
    record('Candidate Tracker Stage Alignment', candidateAppView.body.status === 'HIRED' || candidateAppView.body.data?.status === 'HIRED', `Current Stage: ${candidateAppView.body.status || candidateAppView.body.data?.status}`);

    console.log('\n--- Phase 14: Employer Pipeline & Analytics ---');

    const pipelineRes = await request('GET', '/applications/pipeline', null, tokenEmpA);
    record('Employer Pipeline Aggregation API', pipelineRes.status === 200 && !!pipelineRes.body.pipeline, `Counts: ${JSON.stringify(pipelineRes.body.counts || {})}`);

    const analyticsRes = await request('GET', '/applications/analytics', null, tokenEmpA);
    record('Employer Analytics Conversion API', analyticsRes.status === 200 && analyticsRes.body.conversionRates !== undefined, `Conversion rates calculated`);

    console.log('\n--- Phase 15 & 16: Candidate Withdrawal & Rejection UAT ---');

    // Create 2nd UAT Job & Application for Withdrawal
    const job2Res = await request('POST', '/jobs', {
      title: `V1.1 Withdrawal Test Job ${timestamp}`,
      description: 'Withdrawal UAT',
      location: 'Remote',
      type: 'FULL_TIME',
    }, tokenEmpA);
    const job2Id = job2Res.body.id || job2Res.body.data?.id;

    const app2Res = await request('POST', '/applications', { jobId: job2Id, candidateId: candAProfileId }, tokenCandA);
    const app2Id = app2Res.body.id || app2Res.body.data?.id;

    // Candidate A Withdraws App 2
    const withdrawRes = await request('PATCH', `/applications/${app2Id}/withdraw`, {
      reason: 'Accepted offer elsewhere',
    }, tokenCandA);
    record('Candidate Withdrawal Workflow', withdrawRes.body.status === 'WITHDRAWN' || withdrawRes.body.data?.status === 'WITHDRAWN', `Status: ${withdrawRes.body.status || withdrawRes.body.data?.status}`);

    // Attempt transition on WITHDRAWN application
    const transitionOnWithdrawn = await request('PATCH', `/applications/${app2Id}/status`, { status: 'SHORTLISTED' }, tokenEmpA);
    record('Terminal State Security (WITHDRAWN Rejection)', transitionOnWithdrawn.status === 400 || transitionOnWithdrawn.status === 409, `HTTP Status: ${transitionOnWithdrawn.status}`);

    // Candidate B applies & Employer A rejects
    const meCandB = await request('GET', '/auth/me', null, tokenCandB);
    const candBProfileId = meCandB.body.profile?.id || meCandB.body.candidateProfile?.id || meCandB.body.id;
    const app3Res = await request('POST', '/applications', { jobId: uatJobId, candidateId: candBProfileId }, tokenCandB);
    const app3Id = app3Res.body.id || app3Res.body.data?.id;

    const rejectRes = await request('PATCH', `/applications/${app3Id}/status`, { status: 'REJECTED', reason: 'Skills mismatch' }, tokenEmpA);
    record('Employer Rejection Workflow', rejectRes.body.status === 'REJECTED' || rejectRes.body.data?.status === 'REJECTED', `Status: ${rejectRes.body.status || rejectRes.body.data?.status}`);

    console.log('\n--- Phase 18 - 21: BOLA / IDOR, Employer Notes & Tag Isolation ---');

    // Employer B attempts to update Employer A application
    const bolaStatusUpdate = await request('PATCH', `/applications/${appIdA}/status`, { status: 'SHORTLISTED' }, tokenEmpB);
    record('Employer BOLA Security (Status Update Rejection)', bolaStatusUpdate.status === 403, `HTTP Status: ${bolaStatusUpdate.status}`);

    // Candidate B attempts to withdraw Candidate A application
    const idorWithdraw = await request('PATCH', `/applications/${appIdA}/withdraw`, { reason: 'Unauthorized' }, tokenCandB);
    record('Candidate IDOR Security (Withdrawal Rejection)', idorWithdraw.status === 403, `HTTP Status: ${idorWithdraw.status}`);

    // Employer A creates private note
    const noteRes = await request('POST', `/applications/${appIdA}/notes`, { content: 'Private interview evaluation note' }, tokenEmpA);
    record('Employer Private Candidate Note Creation', noteRes.status === 201 || noteRes.status === 200, `Note ID: ${noteRes.body.id}`);

    // Candidate A fetches application details — verify notes are hidden
    const candViewAppWithNote = await request('GET', `/applications/${appIdA}`, null, tokenCandA);
    const candidateNotes = candViewAppWithNote.body.notes || candViewAppWithNote.body.data?.notes || [];
    record('Employer Private Notes Security (Hidden from Candidate)', candidateNotes.length === 0, `Candidate sees ${candidateNotes.length} notes`);

    // Employer A creates tag & assigns tag
    const tagRes = await request('POST', '/applications/tags', { name: `VIP-${timestamp}`, color: 'purple' }, tokenEmpA);
    const tagId = tagRes.body.id;
    const assignTagRes = await request('POST', `/applications/${appIdA}/tags/${tagId}`, null, tokenEmpA);
    record('Employer Candidate Tag Assignment', assignTagRes.status === 201 || assignTagRes.status === 200, `Tag assigned`);

    console.log('\n--- Phase 23 & 24: Notification Center & Transactional Email ---');

    const notifRes = await request('GET', '/notifications', null, tokenCandA);
    const notifList = notifRes.body.data || notifRes.body || [];
    record('Notification Center Live Event Delivery', Array.isArray(notifList) && notifList.length > 0, `Notifications delivered to Candidate A: ${notifList.length}`);

    console.log('\n================================================================');
    console.log('LIVE PRODUCTION UAT SUMMARY');
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    console.log(`Total UAT Assertions: ${total}`);
    console.log(`Passed:               ${passed}`);
    console.log(`Failed:               ${total - passed}`);
    console.log('================================================================');

  } catch (err) {
    console.error('UAT Drill Error:', err);
  }
}

runUatDrill();
