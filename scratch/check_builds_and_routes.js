const https = require('https');

function fetchUrl(urlStr) {
  return new Promise((resolve) => {
    const u = new URL(urlStr);
    const req = https.get(urlStr, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve({
          url: urlStr,
          status: res.statusCode,
          headers: res.headers,
          bodySnippet: data.slice(0, 300)
        });
      });
    });
    req.on('error', e => resolve({ url: urlStr, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url: urlStr, error: 'Timeout' }); });
  });
}

async function run() {
  console.log('=== 1. TESTING FRONTEND ENDPOINTS ===');
  console.log(await fetchUrl('https://sispl.shop/'));
  console.log(await fetchUrl('https://sispl.shop/find-jobs'));
  console.log(await fetchUrl('https://sispl.shop/freelancers'));
  console.log(await fetchUrl('https://sispl.shop/courses'));
  console.log(await fetchUrl('https://sispl.shop/robots.txt'));
  console.log(await fetchUrl('https://sispl.shop/sitemap.xml'));

  console.log('\n=== 2. TESTING BACKEND API ENDPOINTS ===');
  console.log(await fetchUrl('https://api.sispl.shop/api/v1/health'));
  console.log(await fetchUrl('https://api.sispl.shop/api/v1/jobs'));
  console.log(await fetchUrl('https://api.sispl.shop/api/v1/courses'));
}

run();
