const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api/v1';

async function run() {
  try {
    const user = await prisma.user.findFirst({ where: { role: 'CANDIDATE' } });
    if (!user) {
        console.log('No candidate found');
        return;
    }
    console.log('Found candidate:', user.email);

    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: user.email,
      password: 'password123'
    }).catch(async (e) => {
      return await axios.post(`${API_URL}/auth/login`, { email: user.email, password: 'password' });
    });

    const token = loginRes.data.access_token;
    console.log('Login successful. Token acquired.');

    console.log('Uploading resume...');
    const dummyPdfPath = path.resolve(__dirname, 'test-resume.pdf');
    fs.writeFileSync(dummyPdfPath, 'dummy pdf content for S3 verification');

    const formData = new FormData();
    formData.append('file', fs.createReadStream(dummyPdfPath));

    const uploadRes = await axios.post(`${API_URL}/file-upload/resume`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Upload Response:', uploadRes.status, uploadRes.data);
    const resumeId = uploadRes.data.resume.id;
    
    console.log('Fetching resume metadata from Postgres...');
    const resumeDb = await prisma.resume.findUnique({ where: { id: resumeId } });
    console.log('Resume DB Metadata:', resumeDb);

    console.log('Deleting resume...');
    const deleteRes = await axios.delete(`${API_URL}/file-upload/resume/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Delete Response:', deleteRes.status);
    
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

run();
