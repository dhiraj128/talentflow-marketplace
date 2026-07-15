import { PartialType } from '@nestjs/swagger';
import { CreateMatchingEngineDto } from './create-matching-engine.dto';

export class UpdateMatchingEngineDto extends PartialType(CreateMatchingEngineDto) {}
