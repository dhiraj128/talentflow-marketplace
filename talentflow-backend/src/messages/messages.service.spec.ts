import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { StorageService } from '../storage/storage.service';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('MessagesService', () => {
  let service: MessagesService;

  const mockPrisma = {
    application: { findUnique: jest.fn(), findFirst: jest.fn() },
    candidateInvitation: { findUnique: jest.fn(), findFirst: jest.fn() },
    interview: { findUnique: jest.fn() },
    jobOffer: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
    conversation: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    message: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
    },
    messageAttachment: { create: jest.fn() },
  };

  const mockNotificationsService = {
    createNotification: jest.fn(),
  };

  const mockStorageService = {
    getPresignedUrl: jest.fn().mockResolvedValue('https://s3.signed.url'),
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(() => {
    service = new MessagesService(
      mockPrisma as any,
      mockNotificationsService as any,
      mockStorageService as any,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Communication Policy Validation', () => {
    it('should reject conversation creation between candidate and employer if no active relationship exists', async () => {
      mockPrisma.application.findFirst.mockResolvedValue(null);
      mockPrisma.candidateInvitation.findFirst.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockImplementation(({ where }) => {
        if (where.id === 'candidate-1') return Promise.resolve({ id: 'candidate-1', role: 'CANDIDATE' });
        if (where.id === 'employer-1') return Promise.resolve({ id: 'employer-1', role: 'EMPLOYER' });
        return Promise.resolve(null);
      });
      mockPrisma.conversation.findFirst.mockResolvedValue(null);

      await expect(
        service.createConversation(
          { participant1Id: 'candidate-1', participant2Id: 'employer-1' },
          { sub: 'candidate-1', role: 'CANDIDATE' },
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow conversation creation when an active application relationship exists', async () => {
      mockPrisma.application.findFirst.mockResolvedValue({ id: 'app-123' });
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', role: 'CANDIDATE' });
      mockPrisma.conversation.findFirst.mockResolvedValue(null);
      mockPrisma.conversation.create.mockResolvedValue({
        id: 'conv-100',
        participant1Id: 'candidate-1',
        participant2Id: 'employer-1',
      });

      const result = await service.createConversation(
        { participant1Id: 'candidate-1', participant2Id: 'employer-1' },
        { sub: 'candidate-1', role: 'CANDIDATE' },
      );

      expect(result.id).toBe('conv-100');
    });
  });

  describe('BOLA / IDOR Protection', () => {
    it('should prevent Candidate B from fetching Candidate A conversation messages', async () => {
      mockPrisma.conversation.findUnique.mockResolvedValue({
        id: 'conv-100',
        participant1Id: 'candidate-A',
        participant2Id: 'employer-A',
      });

      await expect(
        service.getMessages('conv-100', { sub: 'candidate-B', role: 'CANDIDATE' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should prevent Employer B from sending a message into Employer A conversation', async () => {
      mockPrisma.conversation.findUnique.mockResolvedValue({
        id: 'conv-100',
        participant1Id: 'candidate-A',
        participant2Id: 'employer-A',
      });

      await expect(
        service.sendMessage(
          { conversationId: 'conv-100', content: 'Malicious payload' },
          { sub: 'employer-B', role: 'EMPLOYER' },
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Message Validation & Unread Count', () => {
    it('should reject empty or whitespace-only messages', async () => {
      mockPrisma.conversation.findUnique.mockResolvedValue({
        id: 'conv-100',
        participant1Id: 'user-1',
        participant2Id: 'user-2',
      });

      await expect(
        service.sendMessage(
          { conversationId: 'conv-100', content: '    ' },
          { sub: 'user-1', role: 'CANDIDATE' },
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return unread count for current user', async () => {
      mockPrisma.message.count.mockResolvedValue(5);

      const res = await service.getUnreadCount({ sub: 'user-1', role: 'CANDIDATE' });
      expect(res.unreadCount).toBe(5);
    });
  });
});
