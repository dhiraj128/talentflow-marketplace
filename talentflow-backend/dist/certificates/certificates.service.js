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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CertificatesService = class CertificatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createCertificateDto) {
        return this.prisma.certificate.create({ data: createCertificateDto });
    }
    findAll(skip, take) {
        return this.prisma.certificate.findMany({ skip, take });
    }
    async findOne(id, user) {
        const cert = await this.prisma.certificate.findUnique({
            where: { id },
            include: { candidate: true, course: { include: { trainer: true } } },
        });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found');
        if (user && user.role !== 'ADMIN') {
            const isCandidate = cert.candidate.userId === (user.sub || user.userId);
            const isTrainer = cert.course.trainer.userId === (user.sub || user.userId);
            if (!isCandidate && !isTrainer)
                throw new common_1.ForbiddenException('Forbidden');
        }
        return cert;
    }
    async update(id, updateCertificateDto, user) {
        const cert = await this.prisma.certificate.findUnique({
            where: { id },
            include: { candidate: true, course: { include: { trainer: true } } },
        });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found');
        if (user && user.role !== 'ADMIN') {
            const isCandidate = cert.candidate.userId === (user.sub || user.userId);
            const isTrainer = cert.course.trainer.userId === (user.sub || user.userId);
            if (!isCandidate && !isTrainer)
                throw new common_1.ForbiddenException('Forbidden');
        }
        return this.prisma.certificate.update({
            where: { id },
            data: updateCertificateDto,
        });
    }
    async remove(id, user) {
        const cert = await this.prisma.certificate.findUnique({
            where: { id },
            include: { candidate: true, course: { include: { trainer: true } } },
        });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found');
        if (user && user.role !== 'ADMIN') {
            const isCandidate = cert.candidate.userId === (user.sub || user.userId);
            const isTrainer = cert.course.trainer.userId === (user.sub || user.userId);
            if (!isCandidate && !isTrainer)
                throw new common_1.ForbiddenException('Forbidden');
        }
        await this.prisma.certificate.delete({ where: { id } });
        return { success: true };
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map