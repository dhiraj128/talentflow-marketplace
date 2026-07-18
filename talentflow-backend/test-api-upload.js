const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const candidateEmail = process.env.PROD_CANDIDATE_EMAIL;
const candidatePwd = process.env.PROD_CANDIDATE_PWD;
const API_URL = 'https://talentflow-backend-qn7b.onrender.com/api/v1';

async function run() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: candidateEmail,
      password: candidatePwd
    });
    const token = loginRes.data.access_token;
    console.log('Login successful. Token:', token.substring(0, 20) + '...');

    // 2. Upload Resume
    console.log('Uploading resume...');
    const dummyPdfPath = path.resolve(__dirname, '..', '..', 'talentflow-marketplace', 'tests', 'fixtures', 'valid-resume.pdf');
    if (!fs.existsSync(dummyPdfPath)) {
        fs.mkdirSync(path.dirname(dummyPdfPath), { recursive: true });
        fs.writeFileSync(dummyPdfPath, 'dummy pdf content for smoke test');
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(dummyPdfPath));

    const uploadRes = await axios.post(`${API_URL}/file-upload/resume`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Upload Response:', uploadRes.status, uploadRes.data);
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

run();
