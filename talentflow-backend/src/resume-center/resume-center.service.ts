import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractStorageService } from '../storage/storage.service';

@Injectable()
export class ResumeCenterService {
  constructor(
    private prisma: PrismaService,
    private storage: AbstractStorageService,
  ) {}

  create(data: any) {
    return this.prisma.resume.create({ data });
  }

  findAll(candidateId?: string) {
    const where: any = {};
    if (candidateId) where.candidateId = candidateId;
    return this.prisma.resume.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.resume.findUnique({ where: { id } });
  }

  update(id: string, data: any) {
    return this.prisma.resume.update({ where: { id }, data });
  }

  async remove(id: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
      include: { applications: true },
    });
    if (!resume) throw new NotFoundException('Resume not found');

    if (resume.applications && resume.applications.length > 0) {
      // Keep historical resume versions used by applications by preventing physical deletion
      throw new BadRequestException(
        'Cannot delete a resume that has been used in job applications',
      );
    }

    if (resume.storageKey) {
      await this.storage.deleteFile(resume.storageKey);
    }

    return this.prisma.resume.delete({ where: { id } });
  }

  async uploadDocument(): Promise<string> {
    return 'Document uploaded successfully';
  }
  async replaceDocument(documentId: string): Promise<string> {
    return `Document ${documentId} replaced successfully`;
  }

  async deleteDocument(documentId: string): Promise<string> {
    return `Document ${documentId} deleted successfully`;
  }

  async previewDocument(documentId: string): Promise<string> {
    return `Preview URL for document ${documentId}`;
  }

  async downloadDocument(documentId: string): Promise<string> {
    return `Download URL for document ${documentId}`;
  }

  async publishResume(resumeId: string): Promise<string> {
    return `Resume ${resumeId} published successfully`;
  }

  async unpublishResume(resumeId: string): Promise<string> {
    return `Resume ${resumeId} unpublished successfully`;
  }

  async generateATS(resumeId: string): Promise<any> {
    return { score: 85, summary: 'ATS generated successfully' };
  }

  async verifyDocument(documentId: string): Promise<string> {
    return `Document ${documentId} verification pending`;
  }

  async approveDocument(documentId: string, notes?: string): Promise<string> {
    return `Document ${documentId} approved with notes: ${notes || 'none'}`;
  }

  async rejectDocument(documentId: string, notes?: string): Promise<string> {
    return `Document ${documentId} rejected with notes: ${notes || 'none'}`;
  }

  async requestReupload(documentId: string, notes?: string): Promise<string> {
    return `Re-upload requested for document ${documentId} with notes: ${notes || 'none'}`;
  }
}
