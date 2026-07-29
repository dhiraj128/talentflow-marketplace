const https = require('https');

function getUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      resolve({ status: res.statusCode, headers: res.headers });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Polling Vercel Production Deployment...');
  try {
    const res1 = await getUrl('https://talentflow-marketplace.vercel.app');
    console.log('Vercel Marketplace Status:', res1.status);
    const res2 = await getUrl('https://sispl.shop');
    console.log('Client Domain sispl.shop Status:', res2.status);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

run();
