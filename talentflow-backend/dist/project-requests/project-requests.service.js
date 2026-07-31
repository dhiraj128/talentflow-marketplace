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
exports.ProjectRequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectRequestsService = class ProjectRequestsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRequest(employerUserId, createData) {
        const employer = await this.prisma.employerProfile.findUnique({
            where: { userId: employerUserId },
        });
        if (!employer) {
            throw new common_1.NotFoundException('Employer profile not found');
        }
        const freelancer = await this.prisma.freelancerProfile.findUnique({
            where: { id: createData.freelancerId },
        });
        if (!freelancer) {
            throw new common_1.NotFoundException('Freelancer not found');
        }
        if (!freelancer.isVerified) {
            throw new common_1.ForbiddenException('Cannot send request to unverified freelancer');
        }
        const existing = await this.prisma.projectRequest.findFirst({
            where: {
                employerId: employer.id,
                freelancerId: freelancer.id,
                status: { in: ['PENDING', 'ACCEPTED'] },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('You already have an active request with this freelancer');
        }
        return this.prisma.projectRequest.create({
            data: {
                employerId: employer.id,
                freelancerId: freelancer.id,
                title: createData.title,
                description: createData.description,
                budget: parseFloat(createData.budget),
            },
        });
    }
    async getFreelancerRequests(freelancerUserId) {
        const freelancer = await this.prisma.freelancerProfile.findUnique({
            where: { userId: freelancerUserId },
        });
        if (!freelancer) {
            throw new common_1.NotFoundException('Freelancer profile not found');
        }
        return this.prisma.projectRequest.findMany({
            where: { freelancerId: freelancer.id },
            include: {
                employer: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getEmployerRequests(employerUserId) {
        const employer = await this.prisma.employerProfile.findUnique({
            where: { userId: employerUserId },
        });
        if (!employer) {
            throw new common_1.NotFoundException('Employer profile not found');
        }
        return this.prisma.projectRequest.findMany({
            where: { employerId: employer.id },
            include: {
                freelancer: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(userId, userRole, requestId, status) {
        const request = await this.prisma.projectRequest.findUnique({
            where: { id: requestId },
            include: { freelancer: true, employer: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Project request not found');
        }
        if (userRole === 'FREELANCER') {
            if (request.freelancer.userId !== userId) {
                throw new common_1.ForbiddenException('Not authorized');
            }
            if (status !== 'ACCEPTED' && status !== 'REJECTED') {
                throw new common_1.ForbiddenException('Freelancers can only ACCEPT or REJECT requests');
            }
            if (request.status !== 'PENDING') {
                throw new common_1.ConflictException(`Cannot transition from ${request.status} to ${status}`);
            }
        }
        else if (userRole === 'EMPLOYER') {
            if (request.employer.userId !== userId) {
                throw new common_1.ForbiddenException('Not authorized');
            }
            if (status !== 'COMPLETED') {
                throw new common_1.ForbiddenException('Employers can only mark requests as COMPLETED');
            }
            if (request.status !== 'ACCEPTED') {
                throw new common_1.ConflictException('Only ACCEPTED active engagements can be marked COMPLETED');
            }
        }
        return this.prisma.projectRequest.update({
            where: { id: requestId },
            data: { status },
        });
    }
    async createReview(employerUserId, requestId, reviewData) {
        const employer = await this.prisma.employerProfile.findUnique({
            where: { userId: employerUserId },
        });
        if (!employer) {
            throw new common_1.NotFoundException('Employer not found');
        }
        const request = await this.prisma.projectRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        if (request.employerId !== employer.id) {
            throw new common_1.ForbiddenException('You do not own this request');
        }
        if (request.status !== 'COMPLETED') {
            throw new common_1.ForbiddenException('You can only review COMPLETED requests');
        }
        if (reviewData.rating < 1 || reviewData.rating > 5) {
            throw new common_1.ConflictException('Rating must be between 1 and 5');
        }
        const existing = await this.prisma.review.findFirst({
            where: {
                reviewerUserId: employer.userId,
                relationshipType: 'CLIENT_TO_FREELANCER',
                relationshipId: request.id,
            },
        });
        if (existing) {
            throw new common_1.ConflictException('You have already reviewed this project');
        }
        const freelancerProfile = await this.prisma.freelancerProfile.findUnique({
            where: { id: request.freelancerId },
        });
        const review = await this.prisma.review.create({
            data: {
                reviewerUserId: employer.userId,
                subjectUserId: freelancerProfile?.userId || null,
                employerId: employer.id,
                freelancerId: request.freelancerId,
                projectRequestId: request.id,
                relationshipType: 'CLIENT_TO_FREELANCER',
                relationshipId: request.id,
                rating: reviewData.rating,
                comment: reviewData.text || '',
            },
        });
        const allReviews = await this.prisma.review.findMany({
            where: { freelancerId: request.freelancerId },
        });
        const reviewCount = allReviews.length;
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviewCount;
        await this.prisma.freelancerProfile.update({
            where: { id: request.freelancerId },
            data: {
                rating: averageRating,
                reviewCount,
            },
        });
        return review;
    }
};
exports.ProjectRequestsService = ProjectRequestsService;
exports.ProjectRequestsService = ProjectRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectRequestsService);
//# sourceMappingURL=project-requests.service.js.map