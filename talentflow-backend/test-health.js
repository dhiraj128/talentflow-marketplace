const axios = require('axios');
const API_URL = 'https://talentflow-backend-qn7b.onrender.com/api/v1';

async function run() {
  try {
    const res = await axios.get(`${API_URL}`);
    console.log(res.status, res.data);
  } catch (err) {
    console.log(err.message, err.response?.data);
  }
  
  try {
    const res = await axios.get(`${API_URL}/health`);
    console.log('/health:', res.status, res.data);
  } catch (err) {
    console.log('/health error:', err.message, err.response?.data);
  }
}
run();
