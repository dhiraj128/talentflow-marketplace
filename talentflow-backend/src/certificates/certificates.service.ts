import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  create(createCertificateDto: CreateCertificateDto) {
    return this.prisma.certificate.create({ data: createCertificateDto });
  }

  findAll(skip?: number, take?: number) {
    return this.prisma.certificate.findMany({ skip, take });
  }

  findOne(id: string) {
    return this.prisma.certificate.findUnique({ where: { id } });
  }

  update(id: string, updateCertificateDto: UpdateCertificateDto) {
    return this.prisma.certificate.update({ where: { id }, data: updateCertificateDto });
  }

  remove(id: string) {
    return this.prisma.certificate.delete({ where: { id } });
  }
}
