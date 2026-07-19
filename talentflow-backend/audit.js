const { Project } = require('ts-morph');
const path = require('path');

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
});

const controllers = project.getSourceFiles('src/**/*.controller.ts');
const services = project.getSourceFiles('src/**/*.service.ts');

const output = [];

for (const f of controllers) {
  const c = f.getClasses()[0];
  if (!c) continue;
  
  c.getMethods().forEach(m => {
    if (['update', 'remove', 'findOne', 'findAll'].includes(m.getName())) {
      const params = m.getParameters().map(p => p.getText());
      const hasUser = params.some(p => p.includes('CurrentUser') || p.includes('user'));
      output.push(`${c.getName()} - ${m.getName()}: hasUser=${hasUser}`);
    }
  });
}

const fs = require('fs');
fs.writeFileSync('C:\\Users\\dhira_5fqr2uc\\Downloads\\stitch_talentflow_marketplace\\talentflow-marketplace\\talentflow-backend\\audit-output.txt', output.join('\n'));
