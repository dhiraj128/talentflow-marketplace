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

async function testAuth() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = "Password123!";
  
  console.log('--- Registering User ---');
  const regRes = await makeRequest('/auth/register', 'POST', {
    email,
    password,
    role: 'CANDIDATE',
    fullName: 'Test Candidate'
  });
  console.log('Register Response:', regRes.status, regRes.data);
  
  if (regRes.status !== 201 && regRes.status !== 200) {
    console.error("Registration failed!");
    return;
  }
  
  console.log('\n--- Logging In ---');
  const loginRes = await makeRequest('/auth/login', 'POST', {
    email,
    password
  });
  console.log('Login Response:', loginRes.status, loginRes.data);
  
  if (!loginRes.data.access_token) {
    console.error("Login failed!");
    return;
  }
  
  console.log('\n--- Getting Profile (/auth/me) ---');
  const meRes = await makeRequest('/auth/me', 'GET', null, loginRes.data.access_token);
  console.log('Me Response:', meRes.status, meRes.data);
  
  console.log('\nAll auth tests passed!');
}

testAuth();
