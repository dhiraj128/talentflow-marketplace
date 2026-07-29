"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const storage_service_1 = require("../storage/storage.service");
const prisma_service_1 = require("../prisma/prisma.service");
let FileUploadService = class FileUploadService {
    storageService;
    prisma;
    allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    maxSize = 5 * 1024 * 1024;
    constructor(storageService, prisma) {
        this.storageService = storageService;
        this.prisma = prisma;
    }
    async uploadResume(file, userId) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only PDF, DOC, and DOCX are allowed.');
        }
        if (file.size > this.maxSize) {
            throw new common_1.BadRequestException('File is too large. Maximum size is 5MB.');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { candidateProfile: true },
        });
        if (!user || !user.candidateProfile) {
            throw new common_1.NotFoundException('Candidate profile not found');
        }
        const result = await this.storageService.uploadFile({
            filename: file.originalname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer,
        }, 'resumes', user.candidateProfile.id);
        console.log(`[FileUploadService] Storage key generated: ${result.key}. URL: ${result.url}`);
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
                isDefault: true,
            },
        });
        console.log(`[FileUploadService] After Resume record creation in DB. ID: ${resume.id}`);
        await this.prisma.candidateProfile.update({
            where: { id: user.candidateProfile.id },
            data: { resumeUrl: result.url }
        });
        return {
            success: true,
            url: result.url,
            key: result.key,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            resumeId: resume.id,
            data: resume,
        };
    }
    async uploadVerificationDocument(file, userId, documentType) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const verificationMimeTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/jpg'
        ];
        if (!verificationMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only PDF, JPG, and PNG are allowed.');
        }
        if (file.size > this.maxSize) {
            throw new common_1.BadRequestException('File is too large. Maximum size is 5MB.');
        }
        const result = await this.storageService.uploadFile({
            filename: file.originalname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer,
        }, 'verifications', userId);
        const doc = await this.prisma.identityVerificationDocument.create({
            data: {
                userId: userId,
                documentUrl: result.url,
                documentType: documentType,
                status: 'pending',
            },
        });
        return {
            success: true,
            url: result.url,
            documentId: doc.id,
            documentType: doc.documentType,
            status: doc.status
        };
    }
    async deleteFile(key) {
        await this.storageService.deleteFile(key);
        return { success: true };
    }
    async uploadAvatar(file, userId) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPG, JPEG, and PNG are allowed.');
        }
        if (file.size > this.maxSize) {
            throw new common_1.BadRequestException('File is too large. Maximum size is 5MB.');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { candidateProfile: true, trainerProfile: true },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const prefix = `avatars/${userId}`;
        const result = await this.storageService.uploadFile({
            filename: file.originalname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer,
        }, prefix, userId);
        await this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: result.url },
        });
        if (user.candidateProfile) {
            await this.prisma.candidateProfile.update({
                where: { id: user.candidateProfile.id },
                data: { avatarUrl: result.url },
            });
        }
        if (user.trainerProfile) {
            await this.prisma.trainerProfile.update({
                where: { id: user.trainerProfile.id },
                data: { avatarUrl: result.url },
            });
        }
        return {
            success: true,
            url: result.url,
            avatarUrl: result.url,
            originalName: file.originalname,
            mimeType: file.mimetype,
        };
    }
    async testAws() {
        const s3Client = this.storageService.getS3Client();
        if (!s3Client)
            return { success: false, reason: 'No S3 client' };
        const config = await s3Client.config.credentials();
        const region = await s3Client.config.region();
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
        }
        catch (e) {
            uploadResult = {
                error: e.message,
                awsErrorName: e?.response?.awsErrorName || e?.awsErrorName || e?.name,
                details: e?.response?.details || e?.details,
                code: e?.response?.awsErrorCode || e?.awsErrorCode || e?.code,
            };
        }
        return {
            region,
            bucket: this.storageService.getBucketName(),
            envVars,
            uploadResult,
        };
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_service_1.AbstractStorageService,
        prisma_service_1.PrismaService])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map