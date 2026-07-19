import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationsDto } from './create.dto';
export class UpdateLocationsDto extends PartialType(CreateLocationsDto) {}
