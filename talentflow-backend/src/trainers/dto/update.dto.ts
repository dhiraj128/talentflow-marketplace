import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainersDto } from './create.dto';
export class UpdateTrainersDto extends PartialType(CreateTrainersDto) {}
