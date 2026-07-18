import { PartialType } from '@nestjs/mapped-types';
import { CreatePlansDto } from './create.dto';
export class UpdatePlansDto extends PartialType(CreatePlansDto) {}