const dns = require('dns');
const { Resolver } = dns;

async function queryNs() {
  console.log('=== 1. RESOLVING AUTHORITATIVE NAMESERVERS ===');
  return new Promise((resolve) => {
    dns.resolveNs('sispl.shop', (err, nsList) => {
      if (err) {
        console.log('Error resolving NS:', err.message);
        resolve([]);
      } else {
        console.log('Authoritative NS for sispl.shop:', nsList);
        resolve(nsList);
      }
    });
  });
}

async function queryServer(nsHostOrIp, recordType, domain) {
  const resolver = new Resolver();
  try {
    const ips = await new Promise(r => dns.resolve4(nsHostOrIp, (err, addrs) => r(addrs || [nsHostOrIp])));
    if (ips && ips.length > 0) {
      resolver.setServers([ips[0]]);
    }
  } catch(e) {}

  return new Promise((resolve) => {
    if (recordType === 'A') {
      resolver.resolve4(domain, (err, addrs) => resolve({ type: 'A', addrs, error: err ? err.message : null }));
    } else if (recordType === 'CNAME') {
      resolver.resolveCname(domain, (err, addrs) => resolve({ type: 'CNAME', addrs, error: err ? err.message : null }));
    } else if (recordType === 'CAA') {
      resolver.resolveCaa(domain, (err, addrs) => resolve({ type: 'CAA', addrs, error: err ? err.message : null }));
    } else if (recordType === 'SOA') {
      resolver.resolveSoa(domain, (err, record) => resolve({ type: 'SOA', record, error: err ? err.message : null }));
    }
  });
}

async function run() {
  console.log('=== PUBLIC DNS RESOLUTION (SYSTEM DEFAULT) ===');
  dns.resolve4('sispl.shop', (err, addrs) => console.log('Public System A sispl.shop:', err ? err.message : addrs));
  dns.resolveCname('www.sispl.shop', (err, addrs) => console.log('Public System CNAME www.sispl.shop:', err ? err.message : addrs));
  dns.resolve4('www.sispl.shop', (err, addrs) => console.log('Public System A www.sispl.shop:', err ? err.message : addrs));
  dns.resolve4('api.sispl.shop', (err, addrs) => console.log('Public System A api.sispl.shop:', err ? err.message : addrs));
  dns.resolveMx('sispl.shop', (err, addrs) => console.log('Public System MX sispl.shop:', err ? err.message : addrs));

  const nsList = await queryNs();

  console.log('\n=== DIRECT AUTHORITATIVE NAMESERVER QUERIES ===');
  for (const ns of nsList) {
    console.log(`\nQuerying Nameserver: ${ns}`);
    const apexA = await queryServer(ns, 'A', 'sispl.shop');
    console.log(`  sispl.shop A ->`, apexA);

    const wwwCname = await queryServer(ns, 'CNAME', 'www.sispl.shop');
    console.log(`  www.sispl.shop CNAME ->`, wwwCname);

    const wwwA = await queryServer(ns, 'A', 'www.sispl.shop');
    console.log(`  www.sispl.shop A ->`, wwwA);

    const caa = await queryServer(ns, 'CAA', 'sispl.shop');
    console.log(`  sispl.shop CAA ->`, caa);

    const soa = await queryServer(ns, 'SOA', 'sispl.shop');
    console.log(`  sispl.shop SOA ->`, soa);
  }
}

run();
