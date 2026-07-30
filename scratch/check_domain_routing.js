const https = require('https');
const http = require('http');
const dns = require('dns');

function lookupDns(domain) {
  return new Promise((resolve) => {
    dns.resolve4(domain, (err, addresses) => {
      resolve({ domain, addresses: addresses || [], error: err ? err.message : null });
    });
  });
}

function checkHttp(urlStr) {
  return new Promise((resolve) => {
    const u = new URL(urlStr);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.get(urlStr, { timeout: 10000 }, (res) => {
      let body = '';
      res.on('data', chunk => {
        if (body.length < 2000) body += chunk;
      });
      res.on('end', () => {
        const titleMatch = body.match(/<title>(.*?)<\/title>/i);
        resolve({
          url: urlStr,
          statusCode: res.statusCode,
          headers: {
            server: res.headers.server,
            location: res.headers.location,
            xVercelId: res.headers['x-vercel-id'],
            xRenderOriginServer: res.headers['x-render-origin-server'],
          },
          title: titleMatch ? titleMatch[1] : 'No title found',
          bodySnippet: body.slice(0, 300)
        });
      });
    });
    req.on('error', (err) => resolve({ url: urlStr, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url: urlStr, error: 'Timeout' }); });
  });
}

async function run() {
  console.log('=== DNS LOOKUP ===');
  console.log(await lookupDns('sispl.shop'));
  console.log(await lookupDns('www.sispl.shop'));
  console.log(await lookupDns('talentflow-marketplace.vercel.app'));

  console.log('\n=== HTTP CONTENT CHECK ===');
  console.log('1. Vercel Provider URL:');
  console.log(await checkHttp('https://talentflow-marketplace.vercel.app'));

  console.log('\n2. Custom Client Domain (sispl.shop):');
  console.log(await checkHttp('https://sispl.shop'));

  console.log('\n3. Custom Client Domain WWW (www.sispl.shop):');
  console.log(await checkHttp('https://www.sispl.shop'));
}

run();
