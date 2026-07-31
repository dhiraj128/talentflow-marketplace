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
exports.OffersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const notifications_service_1 = require("../notifications/notifications.service");
let OffersService = class OffersService {
    prisma;
    auditLogsService;
    notificationsService;
    constructor(prisma, auditLogsService, notificationsService) {
        this.prisma = prisma;
        this.auditLogsService = auditLogsService;
        this.notificationsService = notificationsService;
    }
    async create(dto, userId) {
        const employerProfile = await this.prisma.employerProfile.findUnique({
            where: { userId },
        });
        if (!employerProfile)
            throw new common_1.NotFoundException('Employer profile not found');
        const application = await this.prisma.application.findUnique({
            where: { id: dto.applicationId },
            include: { job: true, candidate: true },
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        if (application.job.employerId !== employerProfile.id)
            throw new common_1.ForbiddenException('You do not own this application');
        const existingActive = await this.prisma.jobOffer.findFirst({
            where: {
                applicationId: application.id,
                status: { in: ['SENT', 'VIEWED', 'ACCEPTED'] },
            },
        });
        if (existingActive) {
            throw new common_1.ConflictException('An active offer already exists for this application');
        }
        const isSent = dto.status === 'SENT';
        const offer = await this.prisma.jobOffer.create({
            data: {
                applicationId: application.id,
                employerId: employerProfile.id,
                candidateId: application.candidateId,
                jobId: application.jobId,
                title: dto.title,
                salaryAmount: dto.salaryAmount,
                salaryCurrency: dto.salaryCurrency || 'USD',
                salaryPeriod: dto.salaryPeriod || 'YEARLY',
                joiningDate: new Date(dto.joiningDate),
                employmentType: dto.employmentType,
                workLocation: dto.workLocation,
                message: dto.message,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
                status: isSent ? 'SENT' : 'DRAFT',
                sentAt: isSent ? new Date() : undefined,
            },
        });
        if (isSent) {
            const prevStatus = application.status;
            await this.prisma.application.update({
                where: { id: application.id },
                data: { status: 'OFFERED' },
            });
            await this.prisma.applicationStatusHistory.create({
                data: {
                    applicationId: application.id,
                    fromStatus: prevStatus,
                    toStatus: 'OFFERED',
                    changedByUserId: userId,
                    changedByRole: 'EMPLOYER',
                    reason: 'Offer sent',
                },
            });
            await this.auditLogsService.create({
                actionBy: userId,
                action: 'OFFER_SENT',
                resource: offer.id,
            });
            await this.notificationsService.notifyOfferEvent(offer.id, 'SENT');
        }
        else {
            await this.auditLogsService.create({
                actionBy: userId,
                action: 'OFFER_CREATED_DRAFT',
                resource: offer.id,
            });
        }
        return offer;
    }
    async findAllByEmployer(userId) {
        const employerProfile = await this.prisma.employerProfile.findUnique({
            where: { userId },
        });
        if (!employerProfile)
            return [];
        return this.prisma.jobOffer.findMany({
            where: { employerId: employerProfile.id },
            include: {
                candidate: {
                    include: { user: { select: { email: true, avatarUrl: true } } },
                },
                job: { select: { title: true } },
                application: { select: { id: true, status: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllByCandidate(userId) {
        const candidateProfile = await this.prisma.candidateProfile.findUnique({
            where: { userId },
        });
        if (!candidateProfile)
            return [];
        const offers = await this.prisma.jobOffer.findMany({
            where: {
                candidateId: candidateProfile.id,
                status: { in: ['SENT', 'VIEWED', 'ACCEPTED', 'DECLINED', 'WITHDRAWN', 'EXPIRED'] },
            },
            include: {
                employer: {
                    include: { user: { select: { email: true, avatarUrl: true } } },
                },
                job: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        const now = new Date();
        return Promise.all(offers.map(async (offer) => {
            if (offer.status === 'SENT' || offer.status === 'VIEWED') {
                if (offer.expiresAt && offer.expiresAt < now) {
                    return this.prisma.jobOffer.update({
                        where: { id: offer.id },
                        data: { status: 'EXPIRED' },
                        include: {
                            employer: {
                                include: { user: { select: { email: true, avatarUrl: true } } },
                            },
                            job: { select: { title: true } },
                        },
                    });
                }
            }
            return offer;
        }));
    }
    async findOne(id, userId, role) {
        const offer = await this.prisma.jobOffer.findUnique({
            where: { id },
            include: {
                candidate: { include: { user: true } },
                employer: { include: { user: true } },
                job: true,
                application: true,
            },
        });
        if (!offer)
            throw new common_1.NotFoundException('Offer not found');
        if (role === 'EMPLOYER' && offer.employer.userId !== userId)
            throw new common_1.ForbiddenException('You do not own this offer');
        if (role === 'CANDIDATE') {
            if (offer.candidate.userId !== userId)
                throw new common_1.ForbiddenException('You do not own this offer');
            if (offer.status === 'DRAFT')
                throw new common_1.ForbiddenException('Draft offers are not visible to candidate');
            if (offer.status === 'SENT') {
                return this.prisma.jobOffer.update({
                    where: { id },
                    data: { status: 'VIEWED', viewedAt: new Date() },
                    include: {
                        candidate: { include: { user: true } },
                        employer: { include: { user: true } },
                        job: true,
                        application: true,
                    },
                });
            }
        }
        return offer;
    }
    async update(id, dto, userId) {
        const offer = await this.findOne(id, userId, 'EMPLOYER');
        if (offer.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Only draft offers can be updated');
        }
        const updated = await this.prisma.jobOffer.update({
            where: { id },
            data: {
                title: dto.title,
                salaryAmount: dto.salaryAmount,
                salaryCurrency: dto.salaryCurrency,
                salaryPeriod: dto.salaryPeriod,
                joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : undefined,
                employmentType: dto.employmentType,
                workLocation: dto.workLocation,
                message: dto.message,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
            },
        });
        return updated;
    }
    async sendOffer(id, userId) {
        const offer = await this.findOne(id, userId, 'EMPLOYER');
        if (offer.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Offer is already sent or processed');
        }
        const updated = await this.prisma.jobOffer.update({
            where: { id },
            data: { status: 'SENT', sentAt: new Date() },
        });
        const prevStatus = offer.application.status;
        await this.prisma.application.update({
            where: { id: offer.applicationId },
            data: { status: 'OFFERED' },
        });
        await this.prisma.applicationStatusHistory.create({
            data: {
                applicationId: offer.applicationId,
                fromStatus: prevStatus,
                toStatus: 'OFFERED',
                changedByUserId: userId,
                changedByRole: 'EMPLOYER',
                reason: 'Offer sent to candidate',
            },
        });
        await this.auditLogsService.create({
            actionBy: userId,
            action: 'OFFER_SENT',
            resource: id,
        });
        await this.notificationsService.notifyOfferEvent(id, 'SENT');
        return updated;
    }
    async acceptOffer(id, userId) {
        const offer = await this.findOne(id, userId, 'CANDIDATE');
        if (!['SENT', 'VIEWED'].includes(offer.status)) {
            throw new common_1.BadRequestException(`Offer cannot be accepted in state ${offer.status}`);
        }
        if (offer.expiresAt && offer.expiresAt < new Date()) {
            await this.prisma.jobOffer.update({
                where: { id },
                data: { status: 'EXPIRED' },
            });
            throw new common_1.BadRequestException('Offer has expired');
        }
        const prevStatus = offer.application.status;
        const [acceptedOffer] = await this.prisma.$transaction([
            this.prisma.jobOffer.update({
                where: { id },
                data: { status: 'ACCEPTED', acceptedAt: new Date() },
            }),
            this.prisma.application.update({
                where: { id: offer.applicationId },
                data: { status: 'HIRED' },
            }),
            this.prisma.applicationStatusHistory.create({
                data: {
                    applicationId: offer.applicationId,
                    fromStatus: prevStatus,
                    toStatus: 'HIRED',
                    changedByUserId: userId,
                    changedByRole: 'CANDIDATE',
                    reason: 'Offer accepted by candidate',
                },
            }),
        ]);
        await this.auditLogsService.create({
            actionBy: userId,
            action: 'OFFER_ACCEPTED',
            resource: id,
        });
        await this.notificationsService.notifyOfferEvent(id, 'ACCEPTED');
        return acceptedOffer;
    }
    async declineOffer(id, declineReason, userId) {
        const offer = await this.findOne(id, userId, 'CANDIDATE');
        if (!['SENT', 'VIEWED'].includes(offer.status)) {
            throw new common_1.BadRequestException(`Offer cannot be declined in state ${offer.status}`);
        }
        const updated = await this.prisma.jobOffer.update({
            where: { id },
            data: {
                status: 'DECLINED',
                declinedAt: new Date(),
                declineReason,
            },
        });
        await this.auditLogsService.create({
            actionBy: userId,
            action: 'OFFER_DECLINED',
            resource: id,
        });
        await this.notificationsService.notifyOfferEvent(id, 'DECLINED');
        return updated;
    }
    async withdrawOffer(id, userId) {
        const offer = await this.findOne(id, userId, 'EMPLOYER');
        if (['ACCEPTED', 'DECLINED', 'EXPIRED'].includes(offer.status)) {
            throw new common_1.BadRequestException(`Cannot withdraw offer in terminal status ${offer.status}`);
        }
        const updated = await this.prisma.jobOffer.update({
            where: { id },
            data: { status: 'WITHDRAWN', withdrawnAt: new Date() },
        });
        await this.auditLogsService.create({
            actionBy: userId,
            action: 'OFFER_WITHDRAWN',
            resource: id,
        });
        await this.notificationsService.notifyOfferEvent(id, 'WITHDRAWN');
        return updated;
    }
};
exports.OffersService = OffersService;
exports.OffersService = OffersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_logs_service_1.AuditLogsService,
        notifications_service_1.NotificationsService])
], OffersService);
//# sourceMappingURL=offers.service.js.map