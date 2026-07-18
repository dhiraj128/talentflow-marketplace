const fs = require('fs');
const modules = ['categories', 'coupons', 'designations', 'locations', 'offers', 'plans', 'skills', 'subscriptions', 'trainers', 'resume-center'];
modules.forEach(mod => {
  const dir = 'src/' + mod + '/dto';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const cap = mod.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  
  fs.writeFileSync(dir + '/create.dto.ts', `import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
export class Create${cap}Dto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() discount?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}`);
  
  fs.writeFileSync(dir + '/update.dto.ts', `import { PartialType } from '@nestjs/mapped-types';
import { Create${cap}Dto } from './create.dto';
export class Update${cap}Dto extends PartialType(Create${cap}Dto) {}`);

  const ctrl = 'src/' + mod + '/' + mod + '.controller.ts';
  if (fs.existsSync(ctrl)) {
    let content = fs.readFileSync(ctrl, 'utf-8');
    content = content.replace(/create\(@Body\(\) (?:createDto|data): any\)/, `create(@Body() createDto: Create${cap}Dto)`);
    content = content.replace(/update\(@Param\('id'\) id: string, @Body\(\) (?:updateDto|data): any\)/, `update(@Param('id') id: string, @Body() updateDto: Update${cap}Dto)`);
    content = `import { Create${cap}Dto } from './dto/create.dto';\nimport { Update${cap}Dto } from './dto/update.dto';\n` + content;
    fs.writeFileSync(ctrl, content);
  }
});