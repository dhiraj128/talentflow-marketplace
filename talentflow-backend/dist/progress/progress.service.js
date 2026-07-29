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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProgressService = class ProgressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async markLessonComplete(lessonId, candidateId) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { module: { include: { course: true } } },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        const courseId = lesson.module.course.id;
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { candidateId_courseId: { candidateId, courseId } },
        });
        if (!enrollment)
            throw new common_1.BadRequestException('Not enrolled in this course');
        await this.prisma.lessonProgress.upsert({
            where: {
                enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId },
            },
            create: {
                enrollmentId: enrollment.id,
                lessonId,
                isCompleted: true,
                completedAt: new Date(),
            },
            update: { isCompleted: true, completedAt: new Date() },
        });
        const totalLessons = await this.prisma.lesson.count({
            where: { module: { courseId } },
        });
        const completedLessons = await this.prisma.lessonProgress.count({
            where: { enrollmentId: enrollment.id, isCompleted: true },
        });
        const progress = totalLessons === 0
            ? 100
            : Math.round((completedLessons / totalLessons) * 100);
        const updatedEnrollment = await this.prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { progress, completedAt: progress === 100 ? new Date() : null },
        });
        return updatedEnrollment;
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map