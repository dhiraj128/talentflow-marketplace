const fs = require('fs');
const temp2 = fs.readFileSync('temp2.sql', 'utf8');
const migs = fs.readdirSync('prisma/migrations').filter(d=>fs.statSync('prisma/migrations/'+d).isDirectory()).map(d=>fs.readFileSync('prisma/migrations/'+d+'/migration.sql', 'utf8')).join('\n');
const temp2Enums = [...temp2.matchAll(/CREATE TYPE \"([^\"]+)\" AS ENUM \((.*?)\)/g)].map(m => ({name: m[1], vals: m[2]}));
const migEnums = [...migs.matchAll(/CREATE TYPE \"([^\"]+)\" AS ENUM \((.*?)\)/g)].map(m => ({name: m[1], vals: m[2]}));
for(let e of temp2Enums){
  const mig = migEnums.find(x => x.name === e.name);
  if(!mig) console.log('NEW ENUM:', e.name, e.vals);
  else if(mig.vals !== e.vals) console.log('ALTER ENUM:', e.name, '\n  OLD:', mig.vals, '\n  NEW:', e.vals);
}
