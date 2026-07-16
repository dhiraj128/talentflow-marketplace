const http = require('http');

function makeRequest(path, method, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }
    
    if (data) {
      options.headers['Content-Length'] = data.length;
    }

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseBody });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  const roles = ['CANDIDATE', 'EMPLOYER', 'FREELANCER', 'TRAINER'];
  for (const role of roles) {
    console.log(`\n=== Testing Role: ${role} ===`);
    const email = `test_${role.toLowerCase()}_${Date.now()}@example.com`;
    const password = "Password123!";
    
    console.log('--- Registering User ---');
    const regRes = await makeRequest('/auth/register', 'POST', {
      email,
      password,
      role: role,
      fullName: `Test ${role}`
    });
    console.log('Register Response:', regRes.status, regRes.data);
    
    if (regRes.status !== 201 && regRes.status !== 200) {
      console.error(`Registration failed for ${role}!`);
      return;
    }
    
    console.log('--- Logging In ---');
    const loginRes = await makeRequest('/auth/login', 'POST', {
      email,
      password
    });
    
    if (!loginRes.data.access_token) {
      console.error(`Login failed for ${role}!`);
      return;
    }
    
    console.log('--- Getting Profile (/auth/me) ---');
    const meRes = await makeRequest('/auth/me', 'GET', null, loginRes.data.access_token);
    console.log('Me Response Profile:', meRes.data.profile);
    
    if (!meRes.data.profile) {
      console.error(`Profile not created for ${role}!`);
      return;
    }
  }
  console.log('\nAll auth tests passed!');
}

runTests();
