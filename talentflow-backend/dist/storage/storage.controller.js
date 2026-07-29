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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageController = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const storage_service_1 = require("./storage.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
let StorageController = class StorageController {
    prisma;
    storageService;
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async serveFile(req, res, user) {
        const storageKey = req.params[0];
        if (!storageKey) {
            throw new common_1.BadRequestException('File path is required');
        }
        const isResume = storageKey.startsWith('resumes/');
        const dbUser = (await this.prisma.user.findUnique({
            where: { id: user.sub || user.userId },
            include: { candidateProfile: true, employerProfile: true },
        }));
        if (!dbUser) {
            throw new common_1.UnauthorizedException();
        }
        let resumeRecord = null;
        if (isResume) {
            if (dbUser.role === 'ADMIN') {
            }
            else if (dbUser.role === 'CANDIDATE') {
                resumeRecord = await this.prisma.resume.findFirst({
                    where: { storageKey, candidateId: dbUser.candidateProfile?.id },
                });
                if (!resumeRecord)
                    throw new common_1.ForbiddenException('Not authorized to view this resume');
            }
            else if (dbUser.role === 'EMPLOYER') {
                resumeRecord = await this.prisma.resume.findFirst({
                    where: { storageKey },
                });
                if (!resumeRecord)
                    throw new common_1.NotFoundException('Resume not found');
                const application = await this.prisma.application.findFirst({
                    where: {
                        resumeId: resumeRecord.id,
                        job: { employerId: dbUser.employerProfile?.id },
                    },
                });
                if (!application)
                    throw new common_1.ForbiddenException("Not authorized to view this candidate's resume");
            }
            else {
                throw new common_1.ForbiddenException();
            }
        }
        if (storageKey.includes('..')) {
            throw new common_1.UnauthorizedException('Invalid file path');
        }
        try {
            const s3Client = this.storageService.getS3Client();
            const bucket = this.storageService.getBucketName();
            if (!s3Client || !bucket) {
                throw new common_1.InternalServerErrorException('Storage service not configured properly');
            }
            const command = new client_s3_1.GetObjectCommand({
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
            const bodyStream = data.Body;
            bodyStream.pipe(res);
            bodyStream.on('error', (err) => {
                console.error('Error streaming file from S3', err);
                if (!res.headersSent) {
                    res.status(500).send('Error streaming file');
                }
            });
        }
        catch (error) {
            console.error('S3 GetObject Error:', error);
            if (error.name === 'NoSuchKey') {
                throw new common_1.NotFoundException('File not found in storage');
            }
            throw new common_1.InternalServerErrorException('Failed to retrieve file');
        }
    }
};
exports.StorageController = StorageController;
__decorate([
    (0, common_1.Get)('*'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "serveFile", null);
exports.StorageController = StorageController = __decorate([
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.AbstractStorageService])
], StorageController);
//# sourceMappingURL=storage.controller.js.map