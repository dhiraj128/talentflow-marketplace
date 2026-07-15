import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateAuditLogDto {
  @ApiProperty()
  @IsUUID()
  actionBy: string;

  @ApiProperty()
  @IsString()
  action: string;

  @ApiProperty()
  @IsString()
  resource: string;

  @ApiPropertyOptional()
  @IsOptional()
  details?: any;
}
