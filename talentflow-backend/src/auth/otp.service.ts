import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OtpPurpose } from '@prisma/client';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ResendEmailProvider } from './providers/resend-email.provider';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailProvider: ResendEmailProvider,
  ) {}

  // Generate a cryptographically secure 6-digit OTP
  private generateSecureCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Send OTP
  async sendOtp(identifier: string, purpose: OtpPurpose, type: 'EMAIL' | 'PHONE') {
    // 1. Rate Limiting Check (60 seconds cooldown)
    const recentOtp = await this.prisma.oTP.findFirst({
      where: { identifier, purpose },
      orderBy: { createdAt: 'desc' },
    });

    if (recentOtp && (Date.now() - recentOtp.createdAt.getTime()) < 60000) {
      throw new BadRequestException('Please wait 60 seconds before requesting a new OTP.');
    }

    // 2. Generate and hash OTP
    const code = this.generateSecureCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 3. Store OTP
    await this.prisma.oTP.create({
      data: {
        identifier,
        codeHash,
        purpose,
        expiresAt,
      },
    });

    // 4. Send OTP
    if (type === 'EMAIL') {
      await this.emailProvider.sendOtp(identifier, code);
    } else {
      console.log(`[MOCK SMS PROVIDER] Sending OTP ${code} to ${identifier} for ${purpose}`);
    }

    return { message: 'OTP sent successfully' };
  }

  // Verify OTP
  async verifyOtp(identifier: string, code: string, purpose: OtpPurpose) {
    const otpRecord = await this.prisma.oTP.findFirst({
      where: { identifier, purpose },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException('No OTP found for this identifier.');
    }

    if (otpRecord.verifiedAt) {
      throw new BadRequestException('This OTP has already been verified.');
    }

    if (otpRecord.attempts >= 5) {
      throw new BadRequestException('Maximum verification attempts reached. Please request a new OTP.');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired.');
    }

    const isValid = await bcrypt.compare(code, otpRecord.codeHash);
    
    if (!isValid) {
      await this.prisma.oTP.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 },
      });
      throw new BadRequestException('Invalid OTP code.');
    }

    await this.prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { verifiedAt: new Date() },
    });

    return { message: 'OTP verified successfully' };
  }

  // Check if identifier was recently verified
  async isVerifiedRecently(identifier: string, purpose: OtpPurpose): Promise<boolean> {
    const otpRecord = await this.prisma.oTP.findFirst({
      where: { 
        identifier, 
        purpose, 
        verifiedAt: { not: null } 
      },
      orderBy: { verifiedAt: 'desc' },
    });

    if (!otpRecord) return false;

    // Check if verified within the last 30 minutes
    return (Date.now() - otpRecord.verifiedAt!.getTime()) < 30 * 60 * 1000;
  }
}
