import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectRequestsService {
  constructor(private prisma: PrismaService) {}

  async createRequest(employerUserId: string, createData: any) {
    const employer = await this.prisma.employerProfile.findUnique({
      where: { userId: employerUserId }
    });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    const freelancer = await this.prisma.freelancerProfile.findUnique({
      where: { id: createData.freelancerId }
    });
    if (!freelancer) {
      throw new NotFoundException('Freelancer not found');
    }
    if (!freelancer.isVerified) {
      throw new ForbiddenException('Cannot send request to unverified freelancer');
    }

    // Check for existing pending/accepted requests between this employer and freelancer
    const existing = await this.prisma.projectRequest.findFirst({
      where: {
        employerId: employer.id,
        freelancerId: freelancer.id,
        status: { in: ['PENDING', 'ACCEPTED'] }
      }
    });

    if (existing) {
      throw new ConflictException('You already have an active request with this freelancer');
    }

    return this.prisma.projectRequest.create({
      data: {
        employerId: employer.id,
        freelancerId: freelancer.id,
        title: createData.title,
        description: createData.description,
        budget: parseFloat(createData.budget)
      }
    });
  }

  async getFreelancerRequests(freelancerUserId: string) {
    const freelancer = await this.prisma.freelancerProfile.findUnique({
      where: { userId: freelancerUserId }
    });
    if (!freelancer) {
      throw new NotFoundException('Freelancer profile not found');
    }

    return this.prisma.projectRequest.findMany({
      where: { freelancerId: freelancer.id },
      include: {
        employer: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getEmployerRequests(employerUserId: string) {
    const employer = await this.prisma.employerProfile.findUnique({
      where: { userId: employerUserId }
    });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    return this.prisma.projectRequest.findMany({
      where: { employerId: employer.id },
      include: {
        freelancer: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(userId: string, userRole: string, requestId: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED') {
    const request = await this.prisma.projectRequest.findUnique({
      where: { id: requestId },
      include: { freelancer: true, employer: true }
    });

    if (!request) {
      throw new NotFoundException('Project request not found');
    }

    // Authorization checks
    if (userRole === 'FREELANCER') {
      if (request.freelancer.userId !== userId) {
        throw new ForbiddenException('Not authorized');
      }
      if (status !== 'ACCEPTED' && status !== 'REJECTED') {
        throw new ForbiddenException('Freelancers can only ACCEPT or REJECT requests');
      }
      if (request.status !== 'PENDING') {
        throw new ConflictException(`Cannot transition from ${request.status} to ${status}`);
      }
    } else if (userRole === 'EMPLOYER') {
      if (request.employer.userId !== userId) {
        throw new ForbiddenException('Not authorized');
      }
      if (status !== 'COMPLETED') {
        throw new ForbiddenException('Employers can only mark requests as COMPLETED');
      }
      if (request.status !== 'ACCEPTED') {
        throw new ConflictException('Only ACCEPTED active engagements can be marked COMPLETED');
      }
    }

    return this.prisma.projectRequest.update({
      where: { id: requestId },
      data: { status }
    });
  }

  async createReview(employerUserId: string, requestId: string, reviewData: { rating: number, text?: string }) {
    const employer = await this.prisma.employerProfile.findUnique({
      where: { userId: employerUserId }
    });
    
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    const request = await this.prisma.projectRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.employerId !== employer.id) {
      throw new ForbiddenException('You do not own this request');
    }

    if (request.status !== 'COMPLETED') {
      throw new ForbiddenException('You can only review COMPLETED requests');
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new ConflictException('Rating must be between 1 and 5');
    }

    // Check if review already exists
    const existing = await this.prisma.review.findUnique({
      where: {
        employerId_projectRequestId: {
          employerId: employer.id,
          projectRequestId: request.id
        }
      }
    });

    if (existing) {
      throw new ConflictException('You have already reviewed this project');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        employerId: employer.id,
        freelancerId: request.freelancerId,
        projectRequestId: request.id,
        rating: reviewData.rating,
        text: reviewData.text
      }
    });

    // Recalculate average rating for freelancer
    const allReviews = await this.prisma.review.findMany({
      where: { freelancerId: request.freelancerId }
    });

    const reviewCount = allReviews.length;
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviewCount;

    await this.prisma.freelancerProfile.update({
      where: { id: request.freelancerId },
      data: {
        rating: averageRating,
        reviewCount
      }
    });

    return review;
  }
}
