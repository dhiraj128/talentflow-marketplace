import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeCenterDto } from './create.dto';
export class UpdateResumeCenterDto extends PartialType(CreateResumeCenterDto) {}
