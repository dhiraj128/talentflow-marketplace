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
exports.ResumeCenterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
let ResumeCenterService = class ResumeCenterService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    create(data) {
        return this.prisma.resume.create({ data });
    }
    findAll(candidateId) {
        const where = {};
        if (candidateId)
            where.candidateId = candidateId;
        return this.prisma.resume.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    findOne(id, user) {
        return this.prisma.resume.findUnique({ where: { id } });
    }
    update(id, data, user) {
        return this.prisma.resume.update({ where: { id }, data });
    }
    async remove(id, user) {
        const resume = await this.prisma.resume.findUnique({
            where: { id },
            include: { applications: true },
        });
        if (!resume)
            throw new common_1.NotFoundException('Resume not found');
        if (resume.applications && resume.applications.length > 0) {
            throw new common_1.BadRequestException('Cannot delete a resume that has been used in job applications');
        }
        if (resume.storageKey) {
            await this.storage.deleteFile(resume.storageKey);
        }
        return this.prisma.resume.delete({ where: { id } });
    }
    async uploadDocument() {
        return 'Document uploaded successfully';
    }
    async replaceDocument(documentId) {
        return `Document ${documentId} replaced successfully`;
    }
    async deleteDocument(documentId) {
        return `Document ${documentId} deleted successfully`;
    }
    async previewDocument(documentId) {
        return `Preview URL for document ${documentId}`;
    }
    async downloadDocument(documentId) {
        return `Download URL for document ${documentId}`;
    }
    async publishResume(resumeId) {
        return `Resume ${resumeId} published successfully`;
    }
    async unpublishResume(resumeId) {
        return `Resume ${resumeId} unpublished successfully`;
    }
    async generateATS(resumeId) {
        return { score: 85, summary: 'ATS generated successfully' };
    }
    async verifyDocument(documentId) {
        return `Document ${documentId} verification pending`;
    }
    async approveDocument(documentId, notes) {
        return `Document ${documentId} approved with notes: ${notes || 'none'}`;
    }
    async rejectDocument(documentId, notes) {
        return `Document ${documentId} rejected with notes: ${notes || 'none'}`;
    }
    async requestReupload(documentId, notes) {
        return `Re-upload requested for document ${documentId} with notes: ${notes || 'none'}`;
    }
};
exports.ResumeCenterService = ResumeCenterService;
exports.ResumeCenterService = ResumeCenterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.AbstractStorageService])
], ResumeCenterService);
//# sourceMappingURL=resume-center.service.js.map