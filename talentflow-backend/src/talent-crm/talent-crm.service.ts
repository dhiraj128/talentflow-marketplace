import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ApplicationsService } from '../applications/applications.service';
import { InvitationStatus } from '@prisma/client';

@Injectable()
export class TalentCrmService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private applicationsService: ApplicationsService,
  ) {}

  // 1. Save Candidate / Toggle Favorite
  async saveCandidate(candidateId: string, isFavorite: boolean = false, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    const candidate = await this.prisma.candidateProfile.findUnique({ where: { id: candidateId } });
    if (!candidate) throw new NotFoundException('Candidate not found');

    if (!candidate.profileDiscoverable) {
      throw new BadRequestException('Candidate profile is not discoverable');
    }

    const saved = await this.prisma.savedCandidate.upsert({
      where: { employerId_candidateId: { employerId: employer.id, candidateId } },
      create: { employerId: employer.id, candidateId, isFavorite },
      update: { isFavorite },
    });

    // Audit Log
    try {
      await this.prisma.auditLog.create({
        data: {
          actionBy: userId,
          action: 'SAVE_CANDIDATE',
          resource: `Candidate:${candidateId}`,
          details: { employerId: employer.id, isFavorite },
        },
      });
    } catch (e) {
      console.warn('AuditLog creation warning:', e);
    }

    return saved;
  }

  async unsaveCandidate(candidateId: string, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    await this.prisma.savedCandidate.deleteMany({
      where: { employerId: employer.id, candidateId },
    });

    return { success: true };
  }

  async getSavedCandidates(user: any, query: any = {}) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    const where: any = { employerId: employer.id };
    if (query.favoritesOnly === 'true' || query.favoritesOnly === true) {
      where.isFavorite = true;
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.savedCandidate.findMany({
        where,
        include: {
          candidate: {
            select: {
              id: true,
              fullName: true,
              title: true,
              location: true,
              avatarUrl: true,
              bio: true,
              skills: { include: { skill: true } },
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.savedCandidate.count({ where }),
    ]);

    return { data: items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // 2. Talent Pools
  async createPool(name: string, description: string, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    if (!name || !name.trim()) throw new BadRequestException('Pool name required');

    return this.prisma.talentPool.create({
      data: {
        employerId: employer.id,
        name: name.trim(),
        description: description ? description.trim() : null,
      },
    });
  }

  async getPools(user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    return this.prisma.talentPool.findMany({
      where: { employerId: employer.id },
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPool(poolId: string, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    const pool = await this.prisma.talentPool.findUnique({
      where: { id: poolId },
      include: {
        members: {
          include: {
            candidate: {
              select: {
                id: true,
                fullName: true,
                title: true,
                location: true,
                avatarUrl: true,
                bio: true,
                skills: { include: { skill: true } },
              },
            },
          },
        },
      },
    });

    if (!pool || pool.employerId !== employer.id) {
      throw new ForbiddenException('Forbidden: Cannot access another employers talent pool');
    }

    return pool;
  }

  async updatePool(poolId: string, name: string, description: string, user: any) {
    const pool = await this.getPool(poolId, user);
    return this.prisma.talentPool.update({
      where: { id: pool.id },
      data: {
        name: name ? name.trim() : pool.name,
        description: description !== undefined ? description.trim() : pool.description,
      },
    });
  }

  async deletePool(poolId: string, user: any) {
    const pool = await this.getPool(poolId, user);
    await this.prisma.talentPool.delete({ where: { id: pool.id } });
    return { success: true };
  }

  async addMemberToPool(poolId: string, candidateId: string, user: any) {
    const pool = await this.getPool(poolId, user);
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { id: candidateId } });
    if (!candidate) throw new NotFoundException('Candidate not found');

    return this.prisma.talentPoolMember.upsert({
      where: { talentPoolId_candidateId: { talentPoolId: pool.id, candidateId } },
      create: { talentPoolId: pool.id, candidateId },
      update: {},
    });
  }

  async removeMemberFromPool(poolId: string, candidateId: string, user: any) {
    const pool = await this.getPool(poolId, user);
    await this.prisma.talentPoolMember.deleteMany({
      where: { talentPoolId: pool.id, candidateId },
    });
    return { success: true };
  }

  // 3. Talent Discovery Search
  async searchTalent(user: any, query: any = {}) {
    const where: any = { profileDiscoverable: true };

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { bio: { contains: query.search, mode: 'insensitive' } },
        { location: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.location) {
      where.location = { contains: query.location, mode: 'insensitive' };
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.candidateProfile.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          title: true,
          location: true,
          avatarUrl: true,
          bio: true,
          skills: { include: { skill: true } },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.candidateProfile.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // 4. Invite-to-Apply Workflow
  async createInvitation(candidateId: string, jobId: string, message: string, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.employerId !== employer.id) {
      throw new ForbiddenException('Forbidden: Cannot invite candidates to jobs posted by other employers');
    }

    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id: candidateId },
      include: { user: true },
    });
    if (!candidate) throw new NotFoundException('Candidate not found');

    if (!candidate.profileDiscoverable) {
      throw new BadRequestException('Candidate profile is not discoverable');
    }

    // Check existing application
    const existingApp = await this.prisma.application.findUnique({
      where: { candidateId_jobId: { candidateId, jobId } },
    });
    if (existingApp) {
      throw new ConflictException('Candidate has already applied to this job');
    }

    // Check duplicate pending invitation
    const existingInv = await this.prisma.candidateInvitation.findFirst({
      where: { employerId: employer.id, candidateId, jobId, status: InvitationStatus.PENDING },
    });
    if (existingInv) {
      throw new ConflictException('Active invitation already exists for this job and candidate');
    }

    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14-day expiry

    const invitation = await this.prisma.candidateInvitation.create({
      data: {
        employerId: employer.id,
        candidateId,
        jobId,
        message: message ? message.trim() : `You are invited to apply for ${job.title}`,
        expiresAt,
        status: InvitationStatus.PENDING,
      },
    });

    // In-app Notification Trigger
    try {
      await this.notificationsService.create({
        userId: candidate.userId,
        title: 'Job Invitation Received',
        message: `${employer.companyName} invited you to apply for "${job.title}"`,
      });
    } catch (e) {
      console.warn('Notification trigger warning:', e);
    }

    return invitation;
  }

  async getEmployerInvitations(user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    return this.prisma.candidateInvitation.findMany({
      where: { employerId: employer.id },
      include: {
        candidate: { select: { id: true, fullName: true, title: true, avatarUrl: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCandidateInvitations(user: any) {
    const userId = user.sub || user.userId;
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate) throw new NotFoundException('Candidate profile not found');

    return this.prisma.candidateInvitation.findMany({
      where: { candidateId: candidate.id },
      include: {
        employer: { select: { id: true, companyName: true, logoUrl: true } },
        job: { select: { id: true, title: true, location: true, type: true, salaryRange: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async declineInvitation(invitationId: string, user: any) {
    const userId = user.sub || user.userId;
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate) throw new ForbiddenException('Candidate profile required');

    const invitation = await this.prisma.candidateInvitation.findUnique({ where: { id: invitationId } });
    if (!invitation || invitation.candidateId !== candidate.id) {
      throw new ForbiddenException('Forbidden: Cannot decline invitation for another candidate');
    }

    return this.prisma.candidateInvitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.DECLINED },
    });
  }

  async cancelInvitation(invitationId: string, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    const invitation = await this.prisma.candidateInvitation.findUnique({ where: { id: invitationId } });
    if (!invitation || invitation.employerId !== employer.id) {
      throw new ForbiddenException('Forbidden: Cannot cancel invitation sent by another employer');
    }

    return this.prisma.candidateInvitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.CANCELLED },
    });
  }

  async acceptInvitationAndApply(invitationId: string, user: any) {
    const userId = user.sub || user.userId;
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate) throw new ForbiddenException('Candidate profile required');

    const invitation = await this.prisma.candidateInvitation.findUnique({ where: { id: invitationId } });
    if (!invitation || invitation.candidateId !== candidate.id) {
      throw new ForbiddenException('Forbidden: Cannot accept invitation for another candidate');
    }

    if (invitation.status === InvitationStatus.CANCELLED || invitation.status === InvitationStatus.EXPIRED) {
      throw new BadRequestException(`Cannot accept invitation in state: ${invitation.status}`);
    }

    // Call applicationsService.create to enter V1.1 Hiring Pipeline normally
    const application = await this.applicationsService.create({
      candidateId: candidate.id,
      jobId: invitation.jobId,
    });

    // Mark invitation ACCEPTED and link applicationId
    await this.prisma.candidateInvitation.update({
      where: { id: invitationId },
      data: {
        status: InvitationStatus.ACCEPTED,
        applicationId: application.id,
      },
    });

    return application;
  }

  // 5. CRM Analytics
  async getAnalytics(user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    const [savedCount, favoritesCount, poolsCount, invitations] = await Promise.all([
      this.prisma.savedCandidate.count({ where: { employerId: employer.id } }),
      this.prisma.savedCandidate.count({ where: { employerId: employer.id, isFavorite: true } }),
      this.prisma.talentPool.count({ where: { employerId: employer.id } }),
      this.prisma.candidateInvitation.findMany({
        where: { employerId: employer.id },
        select: { status: true },
      }),
    ]);

    const invitationsSent = invitations.length;
    const pendingInvitations = invitations.filter((i) => i.status === 'PENDING').length;
    const acceptedInvitations = invitations.filter((i) => i.status === 'ACCEPTED').length;
    const declinedInvitations = invitations.filter((i) => i.status === 'DECLINED').length;

    const conversionRate = invitationsSent > 0 ? Math.round((acceptedInvitations / invitationsSent) * 100) : 0;

    return {
      savedCandidates: savedCount,
      favorites: favoritesCount,
      talentPools: poolsCount,
      invitationsSent,
      pendingInvitations,
      acceptedInvitations,
      declinedInvitations,
      conversionRate,
    };
  }

  async getAdminAnalytics() {
    const [savedCount, poolsCount, invitationsSent, acceptedInvitations] = await Promise.all([
      this.prisma.savedCandidate.count(),
      this.prisma.talentPool.count(),
      this.prisma.candidateInvitation.count(),
      this.prisma.candidateInvitation.count({ where: { status: InvitationStatus.ACCEPTED } }),
    ]);

    return {
      savedCandidates: savedCount,
      talentPools: poolsCount,
      invitationsSent,
      acceptedInvitations,
      overallConversionRate: invitationsSent > 0 ? Math.round((acceptedInvitations / invitationsSent) * 100) : 0,
    };
  }
}
