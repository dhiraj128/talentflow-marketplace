import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { AbstractStorageService } from '../storage/storage.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FileUploadService {
  private readonly allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  private readonly maxSize = 5 * 1024 * 1024; // 5MB

  constructor(
    private readonly storageService: AbstractStorageService,
    private readonly prisma: PrismaService
  ) {}

  async uploadResume(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only PDF, DOC, and DOCX are allowed.');
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException('File is too large. Maximum size is 5MB.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true }
    });

    if (!user || !user.candidateProfile) {
      throw new NotFoundException('Candidate profile not found');
    }

    const result = await this.storageService.uploadFile({
      filename: file.originalname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    }, 'resumes', user.candidateProfile.id);

    // Create Resume record in DB
    const resume = await this.prisma.resume.create({
      data: {
        candidateId: user.candidateProfile.id,
        title: file.originalname,
        type: 'ORIGINAL',
        storageKey: result.key,
        fileUrl: result.url,
        bucket: this.storageService.getBucketName(),
        mimeType: file.mimetype,
        size: file.size,
        isDefault: true
      }
    });

    return {
      success: true,
      url: result.url,
      key: result.key,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      resumeId: resume.id
    };
  }

  async deleteFile(key: string) {
    await this.storageService.deleteFile(key);
    return { success: true };
  }
}
