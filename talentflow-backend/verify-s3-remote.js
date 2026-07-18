const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://talentflow-backend-qn7b.onrender.com/api/v1';

async function run() {
  try {
    const testEmail = 'test.s3.' + Date.now() + '@example.com';
    const testPassword = 'Password123!';
    
    console.log('Registering test user...');
    const regRes = await axios.post(API_URL + '/auth/register', {
        email: testEmail,
        password: testPassword,
        role: 'CANDIDATE',
        fullName: 'S3 Test User'
    });
    
    const token = regRes.data.access_token;
    console.log('Registered and logged in. Token acquired.');

    console.log('Uploading resume...');
    const dummyPdfPath = path.resolve(__dirname, 'test-s3-resume.pdf');
    fs.writeFileSync(dummyPdfPath, 'dummy pdf content for S3 verification');

    const formData = new FormData();
    formData.append('file', fs.createReadStream(dummyPdfPath));

    const uploadRes = await axios.post(API_URL + '/file-upload/resume', formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: 'Bearer ' + token
      }
    });

    console.log('Upload Response:', uploadRes.status, uploadRes.data);
    const resumeId = uploadRes.data.resume.id;
    
    console.log('Deleting resume...');
    const deleteRes = await axios.delete(API_URL + '/file-upload/resume/' + resumeId, {
        headers: { Authorization: 'Bearer ' + token }
    });
    console.log('Delete Response:', deleteRes.status);
    console.log('AWS S3 Integration Verified Successfully.');

  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

run();
