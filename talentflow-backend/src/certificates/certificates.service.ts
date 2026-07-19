import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async findOne(id: string, user?: any) {
    const cert = await this.prisma.certificate.findUnique({
      where: { id },
      include: { candidate: true, course: { include: { trainer: true } } },
    });
    if (!cert) throw new NotFoundException('Certificate not found');
    if (user && user.role !== 'ADMIN') {
      const isCandidate = cert.candidate.userId === (user.sub || user.userId);
      const isTrainer = cert.course.trainer.userId === (user.sub || user.userId);
      if (!isCandidate && !isTrainer) throw new ForbiddenException('Forbidden');
    }
    return cert;
  }

  async update(id: string, updateCertificateDto: UpdateCertificateDto, user?: any) {
    const cert = await this.prisma.certificate.findUnique({
      where: { id },
      include: { candidate: true, course: { include: { trainer: true } } },
    });
    if (!cert) throw new NotFoundException('Certificate not found');
    if (user && user.role !== 'ADMIN') {
      const isCandidate = cert.candidate.userId === (user.sub || user.userId);
      const isTrainer = cert.course.trainer.userId === (user.sub || user.userId);
      if (!isCandidate && !isTrainer) throw new ForbiddenException('Forbidden');
    }
    return this.prisma.certificate.update({
      where: { id },
      data: updateCertificateDto,
    });
  }

  async remove(id: string, user?: any) {
    const cert = await this.prisma.certificate.findUnique({
      where: { id },
      include: { candidate: true, course: { include: { trainer: true } } },
    });
    if (!cert) throw new NotFoundException('Certificate not found');
    if (user && user.role !== 'ADMIN') {
      const isCandidate = cert.candidate.userId === (user.sub || user.userId);
      const isTrainer = cert.course.trainer.userId === (user.sub || user.userId);
      if (!isCandidate && !isTrainer) throw new ForbiddenException('Forbidden');
    }
    await this.prisma.certificate.delete({ where: { id } });
    return { success: true };
  }
}
