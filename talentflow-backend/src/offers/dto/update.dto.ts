import { PartialType } from '@nestjs/mapped-types';
import { CreateOffersDto } from './create.dto';
export class UpdateOffersDto extends PartialType(CreateOffersDto) {}