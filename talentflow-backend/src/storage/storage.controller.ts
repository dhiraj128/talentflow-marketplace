import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { AbstractStorageService } from './storage.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@Controller('files')
export class StorageController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: AbstractStorageService,
  ) {}

  @Get('*')
    @UseGuards(JwtAuthGuard)
  async serveFile(
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser() user: any,
  ) {
    // req.params[0] contains the wildcard part, e.g., 'resumes/cId/file.pdf'
    const storageKey = req.params[0];
    if (!storageKey) {
      throw new BadRequestException('File path is required');
    }

    const isResume = storageKey.startsWith('resumes/');

    // Verify access
    const dbUser = (await this.prisma.user.findUnique({
      where: { id: user.sub || user.userId },
      include: { candidateProfile: true, employerProfile: true },
    })) as any;

    if (!dbUser) {
      throw new UnauthorizedException();
    }

    let resumeRecord = null;

    if (isResume) {
      if (dbUser.role === 'ADMIN') {
        // Admins can see everything
      } else if (dbUser.role === 'CANDIDATE') {
        // Candidate must own the resume
        resumeRecord = await this.prisma.resume.findFirst({
          where: { storageKey, candidateId: dbUser.candidateProfile?.id },
        });
        if (!resumeRecord)
          throw new ForbiddenException('Not authorized to view this resume');
      } else if (dbUser.role === 'EMPLOYER') {
        // Employer must have a job application containing this resume
        resumeRecord = await this.prisma.resume.findFirst({
          where: { storageKey },
        });
        if (!resumeRecord) throw new NotFoundException('Resume not found');

        const application = await this.prisma.application.findFirst({
          where: {
            resumeId: resumeRecord.id,
            job: { employerId: dbUser.employerProfile?.id },
          },
        });
        if (!application)
          throw new ForbiddenException(
            "Not authorized to view this candidate's resume",
          );
      } else {
        throw new ForbiddenException();
      }
    }

    // Basic security: prevent directory traversal (not strictly needed for S3, but good practice)
    if (storageKey.includes('..')) {
      throw new UnauthorizedException('Invalid file path');
    }

    try {
      const s3Client = this.storageService.getS3Client();
      const bucket = this.storageService.getBucketName();

      if (!s3Client || !bucket) {
        throw new InternalServerErrorException(
          'Storage service not configured properly',
        );
      }

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: storageKey,
      });

      const data = await s3Client.send(command);

      if (data.ContentType) {
        res.setHeader('Content-Type', data.ContentType);
      }
      if (data.ContentLength) {
        res.setHeader('Content-Length', data.ContentLength);
      }

      // We can also set Content-Disposition here if desired
      // res.setHeader('Content-Disposition', `attachment; filename="${resumeRecord?.title || 'resume.pdf'}"`);

      // Type cast the body to allow streaming
      const bodyStream = data.Body as any;

      bodyStream.pipe(res);
      bodyStream.on('error', (err: any) => {
        console.error('Error streaming file from S3', err);
        if (!res.headersSent) {
          res.status(500).send('Error streaming file');
        }
      });
    } catch (error: any) {
      console.error('S3 GetObject Error:', error);
      if (error.name === 'NoSuchKey') {
        throw new NotFoundException('File not found in storage');
      }
      throw new InternalServerErrorException('Failed to retrieve file');
    }
  }
}
