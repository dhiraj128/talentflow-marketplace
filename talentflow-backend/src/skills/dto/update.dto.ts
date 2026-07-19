import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillsDto } from './create.dto';
export class UpdateSkillsDto extends PartialType(CreateSkillsDto) {}
