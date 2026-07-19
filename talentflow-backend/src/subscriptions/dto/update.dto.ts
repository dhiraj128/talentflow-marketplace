import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionsDto } from './create.dto';
export class UpdateSubscriptionsDto extends PartialType(
  CreateSubscriptionsDto,
) {}
