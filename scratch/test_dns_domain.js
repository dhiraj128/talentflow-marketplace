const https = require('https');
const dns = require('dns');

const domains = ['sispl.shop', 'www.sispl.shop', 'api.sispl.shop'];

console.log('--- AUDITING CLIENT DOMAIN DNS & HTTP REACHABILITY ---');

domains.forEach(domain => {
  dns.lookup(domain, (err, address) => {
    if (err) {
      console.log(`[DNS] ${domain} -> LOOKUP FAILED (${err.code})`);
    } else {
      console.log(`[DNS] ${domain} -> ${address}`);
    }
  });

  const req = https.get(`https://${domain}/api/v1/health`, { timeout: 5000 }, (res) => {
    console.log(`[HTTPS] https://${domain}/api/v1/health -> Status: ${res.statusCode}`);
  });

  req.on('error', (err) => {
    console.log(`[HTTPS] https://${domain} -> ${err.message}`);
  });
  req.on('timeout', () => {
    req.destroy();
    console.log(`[HTTPS] https://${domain} -> Timeout`);
  });
});
