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

    console.log(`[FileUploadService] Storage key generated: ${result.key}. URL: ${result.url}`);
    
    // Create Resume record in DB
    console.log(`[FileUploadService] Before Resume record creation in DB for candidate: ${user.candidateProfile.id}`);
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
    console.log(`[FileUploadService] After Resume record creation in DB. ID: ${resume.id}`);

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

  async testAws() {
    const s3Client = this.storageService.getS3Client();
    if (!s3Client) return { success: false, reason: 'No S3 client' };
    
    const config = await s3Client.config.credentials();
    const region = await s3Client.config.region();
    
    // Log environment variables safely
    const envVars = {
       AWS_REGION: process.env.AWS_REGION,
       AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
       has_AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
       has_AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
       has_ACCESS_KEY_ID: !!process.env.ACCESS_KEY_ID,
       has_SECRET_ACCESS_KEY: !!process.env.SECRET_ACCESS_KEY,
       accessKeyIdSuffix: config.accessKeyId.slice(-4),
       secretLength: config.secretAccessKey ? config.secretAccessKey.length : 0,
       secretHasWhitespace: /\s/.test(config.secretAccessKey || ''),
       accessKeyHasWhitespace: /\s/.test(config.accessKeyId || ''),
    };

    let uploadResult;
    try {
      const buffer = Buffer.from('Diagnostic test file content', 'utf8');
      uploadResult = await this.storageService.uploadFile({
        filename: 'diagnostic-test.txt',
        originalname: 'diagnostic-test.txt',
        mimetype: 'text/plain',
        size: buffer.length,
        buffer,
      }, 'diagnostic');
    } catch (e: any) {
      uploadResult = {
        error: e.message,
        awsErrorName: e?.response?.awsErrorName || e?.awsErrorName || e?.name,
        details: e?.response?.details || e?.details,
        code: e?.response?.awsErrorCode || e?.awsErrorCode || e?.code
      };
    }

    return {
      region,
      bucket: this.storageService.getBucketName(),
      envVars,
      uploadResult
    };
  }
}
