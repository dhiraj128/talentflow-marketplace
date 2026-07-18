const fs = require('fs');
const dir = 'src/courses/dto';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(dir + '/course-parts.dto.ts', `import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';\nexport class CreateModuleDto {\n  @IsString() title: string;\n  @IsOptional() @IsString() description?: string;\n}\nexport class CreateLessonDto {\n  @IsString() title: string;\n  @IsOptional() @IsString() content?: string;\n  @IsOptional() @IsString() videoUrl?: string;\n}\nexport class CreateAssessmentDto {\n  @IsString() title: string;\n}\nexport class CreateQuestionDto {\n  @IsString() text: string;\n  @IsArray() options: any[];\n}`);

let ctrl = fs.readFileSync('src/courses/courses.controller.ts', 'utf-8');
ctrl = ctrl.replace(/createModule\(@Param\('id'\) courseId: string, @Body\(\) data: any/, `createModule(@Param('id') courseId: string, @Body() data: CreateModuleDto`);
ctrl = ctrl.replace(/createLesson\(@Param\('moduleId'\) moduleId: string, @Body\(\) data: any/, `createLesson(@Param('moduleId') moduleId: string, @Body() data: CreateLessonDto`);
ctrl = ctrl.replace(/createAssessment\(@Param\('courseId'\) courseId: string, @Body\(\) data: any/, `createAssessment(@Param('courseId') courseId: string, @Body() data: CreateAssessmentDto`);
ctrl = ctrl.replace(/createQuestion\(@Param\('assessmentId'\) assessmentId: string, @Body\(\) data: any/, `createQuestion(@Param('assessmentId') assessmentId: string, @Body() data: CreateQuestionDto`);
ctrl = `import { CreateModuleDto, CreateLessonDto, CreateAssessmentDto, CreateQuestionDto } from './dto/course-parts.dto';\n` + ctrl;
fs.writeFileSync('src/courses/courses.controller.ts', ctrl);


if (!fs.existsSync('src/freelancers/dto')) fs.mkdirSync('src/freelancers/dto', { recursive: true });
fs.writeFileSync('src/freelancers/dto/update-me.dto.ts', `import { IsOptional, IsString } from 'class-validator';\nexport class UpdateMeDto {\n  @IsOptional() @IsString() title?: string;\n  @IsOptional() @IsString() bio?: string;\n}`);
let fctrl = fs.readFileSync('src/freelancers/freelancers.controller.ts', 'utf-8');
fctrl = fctrl.replace(/updateMe\(@Req\(\) req: any, @Body\(\) updateData: any/, `updateMe(@Req() req: any, @Body() updateData: UpdateMeDto`);
fctrl = `import { UpdateMeDto } from './dto/update-me.dto';\n` + fctrl;
fs.writeFileSync('src/freelancers/freelancers.controller.ts', fctrl);
