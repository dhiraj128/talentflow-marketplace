const axios = require('axios');
const API_URL = 'https://talentflow-backend-qn7b.onrender.com/api/v1';
const EMPLOYER_A_EMAIL = 'talentflow.employer.a.prodtest@yourdomain.com';
const PWD = 'Dhiraj@123';

async function test() {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email: EMPLOYER_A_EMAIL,
      password: PWD
    });
    console.log('Login success:', res.status);
  } catch (e) {
    console.error('Login failed:', e.response?.status, e.response?.data);
  }
}
test();
