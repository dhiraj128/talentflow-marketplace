const https = require('https');

https.get('https://talentflow-marketplace.vercel.app', (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Vercel Header x-vercel-id:', res.headers['x-vercel-id']);
  });
});
