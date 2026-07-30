import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResendEmailProvider } from '../auth/providers/resend-email.provider';

describe('Transactional Notification & Email System (Unit & Integration Spec)', () => {
  let service: NotificationsService;
  let emailProvider: ResendEmailProvider;

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    application: {
      findUnique: jest.fn(),
    },
    interview: {
      findUnique: jest.fn(),
    },
    job: {
      findUnique: jest.fn(),
    },
    course: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockResendEmailProvider = {
    sendTransactionalEmail: jest.fn().mockResolvedValue({ success: true, messageId: 'resend_msg_999' }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ResendEmailProvider, useValue: mockResendEmailProvider },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    emailProvider = module.get<ResendEmailProvider>(ResendEmailProvider);
  });

  describe('1. Candidate Application Submitted Event', () => {
    it('creates DB Notification for Employer and sends email to Employer', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-101',
        candidate: { fullName: 'Jane Candidate', user: { email: 'jane@candidate.com' } },
        job: {
          title: 'Senior Frontend Engineer',
          employer: {
            companyName: 'Acme Corp',
            user: { id: 'user-employer-1', email: 'employer@acme.com' },
          },
        },
      });

      await service.notifyApplicationSubmitted('app-101');

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-employer-1',
          title: 'New Application Received',
          message: 'Jane Candidate applied for your job "Senior Frontend Engineer".',
        },
      });

      expect(mockResendEmailProvider.sendTransactionalEmail).toHaveBeenCalledWith({
        to: 'employer@acme.com',
        recipientName: 'Acme Corp',
        subject: 'New Application for Senior Frontend Engineer',
        title: 'New Candidate Application Submitted',
        bodyParagraphs: expect.any(Array),
        details: expect.any(Array),
        ctaText: 'Review Applications',
        ctaUrl: 'https://sispl.shop/employer/applications',
      });
    });
  });

  describe('2 & 3. Application Status Changed Events (SHORTLISTED & INTERVIEWING)', () => {
    it('dispatches SHORTLISTED notification and email to Candidate', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-102',
        candidate: { fullName: 'John Doe', user: { id: 'user-candidate-1', email: 'candidate@gmail.com' } },
        job: { title: 'Fullstack Developer', employer: { companyName: 'TechCorp' } },
      });

      await service.notifyApplicationStatusChanged('app-102', 'SHORTLISTED');

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-candidate-1',
          title: 'Application Shortlisted',
          message: expect.stringContaining('shortlisted'),
        },
      });

      expect(mockResendEmailProvider.sendTransactionalEmail).toHaveBeenCalledWith({
        to: 'candidate@gmail.com',
        recipientName: 'John Doe',
        subject: 'Your Application for Fullstack Developer Has Been Shortlisted',
        title: 'Application Shortlisted',
        bodyParagraphs: expect.any(Array),
        details: expect.any(Array),
        ctaText: 'View Applications',
        ctaUrl: 'https://sispl.shop/job-seeker/applications',
      });
    });

    it('dispatches INTERVIEWING notification and email to Candidate', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-103',
        candidate: { fullName: 'John Doe', user: { id: 'user-candidate-1', email: 'candidate@gmail.com' } },
        job: { title: 'Fullstack Developer', employer: { companyName: 'TechCorp' } },
      });

      await service.notifyApplicationStatusChanged('app-103', 'INTERVIEWING');

      expect(mockResendEmailProvider.sendTransactionalEmail).toHaveBeenCalledWith({
        to: 'candidate@gmail.com',
        recipientName: 'John Doe',
        subject: 'Interview Stage Update for Fullstack Developer',
        title: 'Interview Stage Started',
        bodyParagraphs: expect.any(Array),
        details: expect.any(Array),
        ctaText: 'View Interviews',
        ctaUrl: 'https://sispl.shop/job-seeker/interviews',
      });
    });
  });

  describe('4. Interview Event (SCHEDULED, RESCHEDULED, CANCELLED)', () => {
    it('dispatches notifications and emails to BOTH Candidate and Employer for SCHEDULED interview', async () => {
      mockPrismaService.interview.findUnique.mockResolvedValue({
        id: 'int-201',
        scheduledAt: new Date('2026-08-05T10:00:00Z'),
        duration: 45,
        meetingUrl: 'https://meet.sispl.shop/int-201',
        candidate: { fullName: 'Alice', user: { id: 'cand-user-1', email: 'cand@test.com' } },
        employer: { companyName: 'Bob Co', user: { id: 'emp-user-1', email: 'emp@test.com' } },
        application: { job: { title: 'React Developer' } },
      });

      await service.notifyInterviewEvent('int-201', 'SCHEDULED');

      expect(mockPrismaService.notification.create).toHaveBeenCalledTimes(2);
      expect(mockResendEmailProvider.sendTransactionalEmail).toHaveBeenCalledTimes(2);
    });
  });

  describe('5. Admin Job Moderation Event', () => {
    it('dispatches APPROVED job moderation email and in-app notification to Employer', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue({
        id: 'job-301',
        title: 'Cloud Architect',
        employer: { companyName: 'Cloud Inc', user: { id: 'emp-1', email: 'employer@cloud.com' } },
      });

      await service.notifyJobModeration('job-301', 'PUBLISHED');

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'emp-1',
          title: 'Job Posting Approved',
          message: 'Your job posting "Cloud Architect" has been approved and published.',
        },
      });

      expect(mockResendEmailProvider.sendTransactionalEmail).toHaveBeenCalledWith({
        to: 'employer@cloud.com',
        recipientName: 'Cloud Inc',
        subject: 'Job Posting Update: Cloud Architect (Approved)',
        title: 'Job Posting Approved',
        bodyParagraphs: expect.any(Array),
        details: expect.any(Array),
        ctaText: 'Manage Jobs',
        ctaUrl: 'https://sispl.shop/employer/jobs',
      });
    });
  });

  describe('6. Admin Course Moderation Event', () => {
    it('dispatches APPROVED course moderation email and in-app notification to Trainer', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue({
        id: 'course-401',
        title: 'Mastering NestJS Architecture',
        category: 'Development',
        trainer: { user: { id: 'trainer-1', email: 'trainer@learn.com', candidateProfile: { fullName: 'Prof. Smith' } } },
      });

      await service.notifyCourseModeration('course-401', 'PUBLISHED');

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'trainer-1',
          title: 'Course Approved',
          message: expect.stringContaining('approved'),
        },
      });

      expect(mockResendEmailProvider.sendTransactionalEmail).toHaveBeenCalledWith({
        to: 'trainer@learn.com',
        recipientName: 'Prof. Smith',
        subject: 'Course Status Update: Mastering NestJS Architecture (Approved)',
        title: 'Course Approved',
        bodyParagraphs: expect.any(Array),
        details: expect.any(Array),
        ctaText: 'Manage Courses',
        ctaUrl: 'https://sispl.shop/trainer/courses',
      });
    });
  });

  describe('7. Security Password Reset Event', () => {
    it('dispatches security alert notification and email to Account Owner', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-sec-1',
        email: 'user@security.com',
        candidateProfile: { fullName: 'Security Minded User' },
      });

      await service.notifyPasswordReset('user-sec-1');

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-sec-1',
          title: 'Security Alert: Password Changed',
          message: expect.stringContaining('password was updated successfully'),
        },
      });

      expect(mockResendEmailProvider.sendTransactionalEmail).toHaveBeenCalledWith({
        to: 'user@security.com',
        recipientName: 'Security Minded User',
        subject: 'Security Alert: TalentFlow Account Password Changed',
        title: 'Security Alert: Password Changed',
        bodyParagraphs: expect.any(Array),
        details: expect.any(Array),
        ctaText: 'Sign In to Account',
        ctaUrl: 'https://sispl.shop/sign-in',
      });
    });
  });

  describe('8. Non-Blocking Failure Handling', () => {
    it('email provider failure does NOT crash notification creation or throw exception', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-999',
        candidate: { fullName: 'Test Candidate', user: { email: 'cand999@test.com' } },
        job: {
          title: 'DevOps Engineer',
          employer: { companyName: 'Test Corp', user: { id: 'emp-999', email: 'emp999@test.com' } },
        },
      });

      mockResendEmailProvider.sendTransactionalEmail.mockRejectedValue(new Error('Resend API Network Timeout'));

      await expect(service.notifyApplicationSubmitted('app-999')).resolves.not.toThrow();
      expect(mockPrismaService.notification.create).toHaveBeenCalled();
    });
  });
});
