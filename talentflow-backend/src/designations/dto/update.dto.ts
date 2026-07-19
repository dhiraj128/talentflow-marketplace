import { PartialType } from '@nestjs/mapped-types';
import { CreateDesignationsDto } from './create.dto';
export class UpdateDesignationsDto extends PartialType(CreateDesignationsDto) {}
