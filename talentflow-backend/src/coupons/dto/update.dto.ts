import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponsDto } from './create.dto';
export class UpdateCouponsDto extends PartialType(CreateCouponsDto) {}
