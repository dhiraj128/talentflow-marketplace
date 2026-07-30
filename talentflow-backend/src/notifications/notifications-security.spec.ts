import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('Notification Center Security & Role Isolation Spec', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  const mockUserA = { sub: 'user-id-a', role: 'CANDIDATE' };
  const mockUserB = { sub: 'user-id-b', role: 'EMPLOYER' };
  const mockAdmin = { sub: 'admin-id-1', role: 'ADMIN' };

  const mockNotificationsService = {
    findAllForUser: jest.fn(),
    getUnreadCount: jest.fn(),
    findOneForUser: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    removeForUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('1. Role Isolation & Ownership Derivation', () => {
    it('GET /notifications derives userId strictly from JWT context (User A)', async () => {
      mockNotificationsService.findAllForUser.mockResolvedValue({
        data: [{ id: 'notif-a1', userId: 'user-id-a', title: 'Test' }],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        unreadCount: 1,
      });

      const res = await controller.findAll(mockUserA, '1', '20');

      expect(mockNotificationsService.findAllForUser).toHaveBeenCalledWith(
        'user-id-a',
        { page: 1, limit: 20, unreadOnly: false },
      );
      expect(res.data[0].userId).toBe('user-id-a');
    });

    it('GET /notifications/unread-count derives userId strictly from JWT context (User A)', async () => {
      mockNotificationsService.getUnreadCount.mockResolvedValue({ count: 3 });

      const res = await controller.getUnreadCount(mockUserA);

      expect(mockNotificationsService.getUnreadCount).toHaveBeenCalledWith('user-id-a');
      expect(res.count).toBe(3);
    });

    it('User A cannot fetch or view User B notification', async () => {
      mockNotificationsService.findOneForUser.mockRejectedValue(
        new ForbiddenException('Forbidden: You do not own this notification'),
      );

      await expect(controller.findOne('notif-b1', mockUserA)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockNotificationsService.findOneForUser).toHaveBeenCalledWith(
        'notif-b1',
        'user-id-a',
      );
    });

    it('User A cannot mark User B notification as read', async () => {
      mockNotificationsService.markAsRead.mockRejectedValue(
        new ForbiddenException('Forbidden: You do not own this notification'),
      );

      await expect(
        controller.markAsRead('notif-b1', mockUserA),
      ).rejects.toThrow(ForbiddenException);
      expect(mockNotificationsService.markAsRead).toHaveBeenCalledWith(
        'notif-b1',
        'user-id-a',
      );
    });

    it('User A cannot delete User B notification', async () => {
      mockNotificationsService.removeForUser.mockRejectedValue(
        new ForbiddenException('Forbidden: You do not own this notification'),
      );

      await expect(controller.remove('notif-b1', mockUserA)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockNotificationsService.removeForUser).toHaveBeenCalledWith(
        'notif-b1',
        'user-id-a',
      );
    });
  });

  describe('2. Admin Boundary Safety', () => {
    it('Admin calling GET /notifications retrieves ONLY Admin own notifications', async () => {
      mockNotificationsService.findAllForUser.mockResolvedValue({
        data: [{ id: 'notif-admin1', userId: 'admin-id-1', title: 'Admin Alert' }],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        unreadCount: 0,
      });

      const res = await controller.findAll(mockAdmin, '1', '20');

      expect(mockNotificationsService.findAllForUser).toHaveBeenCalledWith(
        'admin-id-1',
        { page: 1, limit: 20, unreadOnly: false },
      );
      expect(res.data[0].userId).toBe('admin-id-1');
    });

    it('Admin cannot read User A private notification via standard endpoints', async () => {
      mockNotificationsService.findOneForUser.mockRejectedValue(
        new ForbiddenException('Forbidden: You do not own this notification'),
      );

      await expect(controller.findOne('notif-a1', mockAdmin)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
