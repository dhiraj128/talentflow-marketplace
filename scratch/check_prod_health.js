const https = require('https');

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    }).on('error', err => resolve({ statusCode: 500, error: err.message }));
  });
}

async function run() {
  console.log("=========================================");
  console.log("PRODUCTION HEALTH & READINESS AUDIT");
  console.log("=========================================");

  const health = await checkUrl("https://api.sispl.shop/api/v1/health");
  console.log("GET /api/v1/health Status:", health.statusCode, "Body:", health.body.trim());

  const ready = await checkUrl("https://api.sispl.shop/api/v1/health/ready");
  console.log("GET /api/v1/health/ready Status:", ready.statusCode, "Body:", ready.body.trim());

  const frontend = await checkUrl("https://sispl.shop");
  console.log("GET https://sispl.shop Status:", frontend.statusCode);
}

run();
