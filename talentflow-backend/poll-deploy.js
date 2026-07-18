const axios = require('axios');
const API_URL = 'https://talentflow-backend-qn7b.onrender.com/api/v1';

async function checkDeploy() {
  console.log('Checking if backend is deployed and endpoint is ready...');
  
  for (let i = 0; i < 30; i++) {
    try {
      // If we send a POST with no token, it should throw 401 Unauthorized if the route exists.
      // If it throws 404, the route still doesn't exist (old deployment).
      await axios.post(`${API_URL}/file-upload/resume`, {}, { timeout: 5000 });
      console.log('Got 200 somehow? Wait, it should fail.');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log(`\nSUCCESS! Endpoint /file-upload/resume returned 401 Unauthorized. The new deployment is live!`);
        process.exit(0);
      } else if (err.response && err.response.status === 404) {
        process.stdout.write('.');
      } else if (err.response && err.response.status === 400) {
        console.log(`\nSUCCESS! Endpoint returned 400 (Bad Request - No file). Deployment is live!`);
        process.exit(0);
      } else {
        process.stdout.write(`[${err.message}]`);
      }
    }
    
    // Wait 10 seconds before next poll
    await new Promise(r => setTimeout(r, 10000));
  }
  
  console.error('\nTIMEOUT: Deployment did not complete after 5 minutes.');
  process.exit(1);
}

checkDeploy();
