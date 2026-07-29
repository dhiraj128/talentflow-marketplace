const https = require('https');

https.get('https://talentflow-backend-qn7b.onrender.com/api/v1/health', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Render Health Response:', body));
});
