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
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EnrollmentsService = class EnrollmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createEnrollmentDto) {
        return this.prisma.enrollment.create({ data: createEnrollmentDto });
    }
    findAll(filters) {
        const where = {};
        if (filters.candidateId)
            where.candidateId = filters.candidateId;
        if (filters.courseId)
            where.courseId = filters.courseId;
        return this.prisma.enrollment.findMany({
            where,
            include: { course: true },
            orderBy: { enrolledAt: 'desc' },
        });
    }
    findOne(id, user) {
        return this.prisma.enrollment.findUnique({ where: { id } });
    }
    update(id, updateEnrollmentDto, user) {
        return this.prisma.enrollment.update({
            where: { id },
            data: updateEnrollmentDto,
        });
    }
    remove(id, user) {
        return this.prisma.enrollment.delete({ where: { id } });
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map