import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  create(createAuditLogDto: CreateAuditLogDto) {
    // details usually json, so typecast to any or Prisma.InputJsonValue
    return this.prisma.auditLog.create({ 
      data: {
        ...createAuditLogDto,
        details: createAuditLogDto.details || {}
      } 
    });
  }

  findAll(skip?: number, take?: number) {
    return this.prisma.auditLog.findMany({ skip, take });
  }

  findOne(id: string) {
    return this.prisma.auditLog.findUnique({ where: { id } });
  }

  update(id: string, updateAuditLogDto: UpdateAuditLogDto) {
    return this.prisma.auditLog.update({ 
      where: { id }, 
      data: {
        ...updateAuditLogDto,
        details: updateAuditLogDto.details ? updateAuditLogDto.details : undefined
      } 
    });
  }

  remove(id: string) {
    return this.prisma.auditLog.delete({ where: { id } });
  }
}
