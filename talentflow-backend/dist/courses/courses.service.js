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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CoursesService = class CoursesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCourseDto, trainerId) {
        const trainer = await this.prisma.trainerProfile.findUnique({
            where: { id: trainerId },
        });
        if (!trainer || !trainer.isVerified) {
            throw new common_1.ForbiddenException('You must be a verified trainer to create courses');
        }
        return this.prisma.course.create({
            data: {
                ...createCourseDto,
                trainerId,
                status: 'DRAFT',
            },
        });
    }
    async findAll(filters) {
        const where = { status: 'PUBLISHED' };
        if (filters.q) {
            where.title = { contains: filters.q, mode: 'insensitive' };
        }
        if (filters.category) {
            where.category = { contains: filters.category, mode: 'insensitive' };
        }
        if (filters.trainerId) {
            where.trainerId = filters.trainerId;
        }
        const page = Number(filters.page) || 1;
        const limit = Number(filters.limit) || 20;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.course.findMany({
                where,
                include: { trainer: true, modules: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.course.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                trainer: true,
                modules: {
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                        },
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return course;
    }
    async update(id, updateCourseDto, trainerId) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course || course.trainerId !== trainerId) {
            throw new common_1.ForbiddenException('You can only update your own courses');
        }
        return this.prisma.course.update({
            where: { id },
            data: updateCourseDto,
        });
    }
    async remove(id, trainerId) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course || course.trainerId !== trainerId) {
            throw new common_1.ForbiddenException('You can only delete your own courses');
        }
        return this.prisma.course.delete({ where: { id } });
    }
    async approve(id) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (course.status !== 'PENDING')
            throw new common_1.BadRequestException('Only PENDING courses can be approved');
        return this.prisma.course.update({
            where: { id },
            data: { status: 'PUBLISHED' },
        });
    }
    async submit(id, trainerId) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course || course.trainerId !== trainerId) {
            throw new common_1.ForbiddenException('You can only submit your own courses');
        }
        if (course.status !== 'DRAFT' && course.status !== 'REJECTED') {
            throw new common_1.BadRequestException('Only DRAFT or REJECTED courses can be submitted');
        }
        return this.prisma.course.update({
            where: { id },
            data: { status: 'PENDING' },
        });
    }
    async getMyLearning(candidateId) {
        return this.prisma.enrollment.findMany({
            where: { candidateId },
            include: {
                course: {
                    include: { trainer: true, modules: { include: { lessons: true } } },
                },
                lessonProgress: true,
            },
            orderBy: { enrolledAt: 'desc' },
        });
    }
    async enroll(courseId, candidateId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (course.status !== 'PUBLISHED') {
            throw new common_1.BadRequestException('Course not available for enrollment');
        }
        const existing = await this.prisma.enrollment.findUnique({
            where: { candidateId_courseId: { candidateId, courseId } },
        });
        if (existing) {
            throw new common_1.BadRequestException('Already enrolled in this course');
        }
        return this.prisma.enrollment.create({
            data: {
                candidateId,
                courseId,
                progress: 0,
            },
        });
    }
    async createModule(courseId, data, trainerId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course || course.trainerId !== trainerId)
            throw new common_1.ForbiddenException('Cannot modify this course');
        return this.prisma.courseModule.create({
            data: {
                ...data,
                courseId,
            },
        });
    }
    async createLesson(moduleId, data, trainerId) {
        const module = await this.prisma.courseModule.findUnique({
            where: { id: moduleId },
            include: { course: true },
        });
        if (!module || module.course.trainerId !== trainerId)
            throw new common_1.ForbiddenException('Cannot modify this course');
        return this.prisma.lesson.create({
            data: {
                ...data,
                moduleId,
            },
        });
    }
    async createAssessment(courseId, data, trainerId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course || course.trainerId !== trainerId)
            throw new common_1.ForbiddenException('Cannot modify this course');
        return this.prisma.assessment.create({
            data: {
                ...data,
                courseId,
            },
        });
    }
    async createQuestion(assessmentId, data, trainerId) {
        const assessment = await this.prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: { course: true },
        });
        if (!assessment || assessment.course.trainerId !== trainerId)
            throw new common_1.ForbiddenException('Cannot modify this course');
        return this.prisma.question.create({
            data: {
                ...data,
                assessmentId,
            },
        });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map