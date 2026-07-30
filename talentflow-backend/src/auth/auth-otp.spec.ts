import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResendEmailProvider } from './providers/resend-email.provider';
import { BadRequestException } from '@nestjs/common';
import { OtpPurpose } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('Auth & OTP Password Reset Workflow (Unit & Integration Spec)', () => {
  let controller: AuthController;
  let authService: AuthService;
  let otpService: OtpService;
  let emailProvider: ResendEmailProvider;

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    oTP: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  };

  const mockResendEmailProvider = {
    sendOtp: jest.fn().mockResolvedValue({ id: 'resend_msg_12345' }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_jwt_token'),
    verify: jest.fn().mockReturnValue({ sub: 'user-1' }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        OtpService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ResendEmailProvider, useValue: mockResendEmailProvider },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    otpService = module.get<OtpService>(OtpService);
    emailProvider = module.get<ResendEmailProvider>(ResendEmailProvider);
  });

  describe('1. Forgot Password Workflow', () => {
    it('1. forgot-password with valid registered email triggers OTP send & returns success', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({
        id: 'user-1',
        email: 'dhrjk128@gmail.com',
        phoneNumber: null,
      });
      mockPrismaService.oTP.findFirst.mockResolvedValue(null);

      const result = await controller.forgotPassword({ identifier: 'dhrjk128@gmail.com' });

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: 'dhrjk128@gmail.com' }, { phoneNumber: 'dhrjk128@gmail.com' }],
        },
      });
      expect(mockPrismaService.oTP.create).toHaveBeenCalled();
      expect(mockResendEmailProvider.sendOtp).toHaveBeenCalledWith('dhrjk128@gmail.com', expect.any(String));
      expect(result).toEqual({ message: 'OTP sent successfully', type: 'EMAIL' });
    });

    it('2. resend-otp with valid payload { identifier, purpose } triggers OTP send', async () => {
      mockPrismaService.oTP.findFirst.mockResolvedValue(null);

      const result = await controller.resendOtp({
        identifier: 'dhrjk128@gmail.com',
        purpose: OtpPurpose.FORGOT_PASSWORD,
      });

      expect(mockResendEmailProvider.sendOtp).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'OTP sent successfully' });
    });

    it('3. resend-otp cooldown rate limit blocks requests within 60 seconds', async () => {
      mockPrismaService.oTP.findFirst.mockResolvedValue({
        id: 'otp-1',
        createdAt: new Date(),
      });

      await expect(
        otpService.sendOtp('dhrjk128@gmail.com', OtpPurpose.FORGOT_PASSWORD, 'EMAIL'),
      ).rejects.toThrow(BadRequestException);
      expect(mockResendEmailProvider.sendOtp).not.toHaveBeenCalled();
    });

    it('4. valid resend triggers email provider exactly once', async () => {
      mockPrismaService.oTP.findFirst.mockResolvedValue(null);

      await otpService.sendOtp('dhrjk128@gmail.com', OtpPurpose.FORGOT_PASSWORD, 'EMAIL');

      expect(mockResendEmailProvider.sendOtp).toHaveBeenCalledTimes(1);
    });

    it('5. invalid user on forgot-password throws BadRequestException without triggering email provider', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        controller.forgotPassword({ identifier: 'nonexistent@gmail.com' }),
      ).rejects.toThrow(BadRequestException);
      expect(mockResendEmailProvider.sendOtp).not.toHaveBeenCalled();
    });
  });

  describe('2. OTP Verification & Security Assertions', () => {
    it('6. valid OTP verification succeeds', async () => {
      const codeHash = await bcrypt.hash('123456', 10);
      mockPrismaService.oTP.findFirst.mockResolvedValue({
        id: 'otp-1',
        identifier: 'dhrjk128@gmail.com',
        codeHash,
        purpose: OtpPurpose.FORGOT_PASSWORD,
        expiresAt: new Date(Date.now() + 300000),
        attempts: 0,
        verifiedAt: null,
      });

      const result = await otpService.verifyOtp('dhrjk128@gmail.com', '123456', OtpPurpose.FORGOT_PASSWORD);

      expect(mockPrismaService.oTP.update).toHaveBeenCalledWith({
        where: { id: 'otp-1' },
        data: { verifiedAt: expect.any(Date) },
      });
      expect(result).toEqual({ message: 'OTP verified successfully' });
    });

    it('7. invalid OTP code is rejected', async () => {
      const codeHash = await bcrypt.hash('123456', 10);
      mockPrismaService.oTP.findFirst.mockResolvedValue({
        id: 'otp-1',
        identifier: 'dhrjk128@gmail.com',
        codeHash,
        purpose: OtpPurpose.FORGOT_PASSWORD,
        expiresAt: new Date(Date.now() + 300000),
        attempts: 0,
        verifiedAt: null,
      });

      await expect(
        otpService.verifyOtp('dhrjk128@gmail.com', '999999', OtpPurpose.FORGOT_PASSWORD),
      ).rejects.toThrow(BadRequestException);
    });

    it('8. expired OTP is rejected', async () => {
      const codeHash = await bcrypt.hash('123456', 10);
      mockPrismaService.oTP.findFirst.mockResolvedValue({
        id: 'otp-1',
        identifier: 'dhrjk128@gmail.com',
        codeHash,
        purpose: OtpPurpose.FORGOT_PASSWORD,
        expiresAt: new Date(Date.now() - 1000),
        attempts: 0,
        verifiedAt: null,
      });

      await expect(
        otpService.verifyOtp('dhrjk128@gmail.com', '123456', OtpPurpose.FORGOT_PASSWORD),
      ).rejects.toThrow(BadRequestException);
    });

    it('9. consumed/verified OTP cannot be reused', async () => {
      mockPrismaService.oTP.findFirst.mockResolvedValue({
        id: 'otp-1',
        identifier: 'dhrjk128@gmail.com',
        codeHash: 'hash',
        purpose: OtpPurpose.FORGOT_PASSWORD,
        expiresAt: new Date(Date.now() + 300000),
        attempts: 0,
        verifiedAt: new Date(),
      });

      await expect(
        otpService.verifyOtp('dhrjk128@gmail.com', '123456', OtpPurpose.FORGOT_PASSWORD),
      ).rejects.toThrow(BadRequestException);
    });

    it('10. password reset requires valid OTP and updates bcrypt password hash', async () => {
      const oldHash = await bcrypt.hash('OldPassword123!', 10);
      const codeHash = await bcrypt.hash('123456', 10);

      mockPrismaService.user.findFirst.mockResolvedValue({
        id: 'user-1',
        email: 'dhrjk128@gmail.com',
        passwordHash: oldHash,
        status: 'ACTIVE',
      });
      mockPrismaService.oTP.findFirst.mockResolvedValue({
        id: 'otp-1',
        identifier: 'dhrjk128@gmail.com',
        codeHash,
        purpose: OtpPurpose.FORGOT_PASSWORD,
        expiresAt: new Date(Date.now() + 300000),
        attempts: 0,
        verifiedAt: null,
      });

      const result = await authService.resetPassword('dhrjk128@gmail.com', '123456', 'NewPassword123!');

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: {
          passwordHash: expect.any(String),
          refreshToken: null,
        },
      });
      expect(result).toEqual({ message: 'Password reset successfully' });
    });
  });
});
