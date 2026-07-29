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
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssessmentsService = class AssessmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitAssessment(courseId, candidateId, answers) {
        const assessment = await this.prisma.assessment.findUnique({
            where: { courseId },
            include: { questions: true },
        });
        if (!assessment) {
            throw new common_1.NotFoundException('Assessment not found for this course');
        }
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { candidateId_courseId: { candidateId, courseId } },
        });
        if (!enrollment) {
            throw new common_1.BadRequestException('Not enrolled in this course');
        }
        let correctCount = 0;
        const totalQuestions = assessment.questions.length;
        for (const question of assessment.questions) {
            const options = question.options;
            const correctOption = options.find((o) => o.isCorrect);
            if (correctOption && answers[question.id] === correctOption.text) {
                correctCount++;
            }
        }
        const score = totalQuestions === 0
            ? 100
            : Math.round((correctCount / totalQuestions) * 100);
        const passed = score >= assessment.passingScore;
        const attempt = await this.prisma.assessmentAttempt.create({
            data: {
                enrollmentId: enrollment.id,
                assessmentId: assessment.id,
                score,
                passed,
            },
        });
        if (passed && enrollment.progress === 100) {
            const existingCert = await this.prisma.certificate.findUnique({
                where: { candidateId_courseId: { candidateId, courseId } },
            });
            if (!existingCert) {
                await this.prisma.certificate.create({
                    data: {
                        candidateId,
                        courseId,
                        certificateUrl: `/certificates/${courseId}-${candidateId}.pdf`,
                    },
                });
            }
        }
        return {
            attempt,
            passed,
            score,
            totalQuestions,
            correctCount,
        };
    }
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map