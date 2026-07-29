const https = require('https');

function checkUrl(urlName, url) {
  https.get(url, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => console.log(urlName, ':', res.statusCode, body));
  }).on('error', (err) => console.log(urlName, 'Error:', err.message));
}

checkUrl('qn7b health', 'https://talentflow-backend-qn7b.onrender.com/api/v1/health');
checkUrl('e2e health', 'https://talentflow-backend-e2e.onrender.com/api/v1/health');
