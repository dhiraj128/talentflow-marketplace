import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { InterviewStatus } from '@prisma/client';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async schedule(createInterviewDto: CreateInterviewDto, userId: string) {
    // Ensure the employer profile exists for this user
    const employerProfile = await this.prisma.employerProfile.findUnique({
      where: { userId },
    });

    if (!employerProfile) {
      throw new NotFoundException('Employer profile not found');
    }

    // Ensure application exists and update status to INTERVIEWING if it's currently PENDING or REVIEWING or SHORTLISTED
    const application = await this.prisma.application.findUnique({
      where: { id: createInterviewDto.applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (['PENDING', 'REVIEWING', 'SHORTLISTED'].includes(application.status)) {
      await this.prisma.application.update({
        where: { id: application.id },
        data: { status: 'INTERVIEWING' },
      });
    }

    return this.prisma.interview.create({
      data: {
        ...createInterviewDto,
        employerId: employerProfile.id,
      },
    });
  }

  async findAllByEmployer(userId: string) {
    const employerProfile = await this.prisma.employerProfile.findUnique({
      where: { userId },
    });

    if (!employerProfile) {
      return [];
    }

    return this.prisma.interview.findMany({
      where: { employerId: employerProfile.id },
      include: {
        candidate: {
          include: { user: { select: { email: true } } },
        },
        application: {
          include: { job: { select: { title: true } } },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findAllByCandidate(userId: string) {
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) {
      return [];
    }

    return this.prisma.interview.findMany({
      where: { candidateId: candidateProfile.id },
      include: {
        employer: {
          include: { user: { select: { email: true } } },
        },
        application: {
          include: { job: { select: { title: true } } },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        candidate: true,
        employer: true,
        application: { include: { job: true } },
      },
    });
    if (!interview) {
      throw new NotFoundException(`Interview with ID ${id} not found`);
    }
    return interview;
  }

  async reschedule(id: string, updateInterviewDto: UpdateInterviewDto) {
    await this.findOne(id);
    return this.prisma.interview.update({
      where: { id },
      data: {
        scheduledAt: updateInterviewDto.scheduledAt,
        duration: updateInterviewDto.duration,
        meetingUrl: updateInterviewDto.meetingUrl,
        notes: updateInterviewDto.notes,
        status: 'SCHEDULED' // Reset to scheduled if it was something else? Keep it scheduled.
      },
    });
  }

  async cancel(id: string) {
    await this.findOne(id);
    return this.prisma.interview.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async complete(id: string, feedback?: string) {
    await this.findOne(id);
    return this.prisma.interview.update({
      where: { id },
      data: { status: 'COMPLETED', feedback },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.interview.delete({
      where: { id },
    });
  }
}
