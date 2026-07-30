import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phoneNumber: identifier }
        ]
      }
    });

    if (user && user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Your account has been suspended.');
    }
    if (
      user &&
      user.passwordHash &&
      (await bcrypt.compare(pass, user.passwordHash))
    ) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async validateOAuthUser(oauthUser: any) {
    const { email, firstName, lastName, provider, providerId, picture } =
      oauthUser;

    // Find user by email
    let user = await this.prisma.user.findUnique({ where: { email } });
    const fullName = `${firstName} ${lastName}`.trim();

    if (user && user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Your account has been suspended.');
    }

    if (user) {
      // User exists, link account if not already linked
      const updateData: any = {};
      if (!user.provider) updateData.provider = provider;
      if (provider === 'google' && !user.googleId)
        updateData.googleId = providerId;
      if (provider === 'github' && !user.githubId)
        updateData.githubId = providerId;
      if (!user.avatarUrl && picture) updateData.avatarUrl = picture;

      if (Object.keys(updateData).length > 0) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    } else {
      // Create new user (default to CANDIDATE role)
      user = await this.prisma.user.create({
        data: {
          email,
          role: Role.CANDIDATE,
          isEmailVerified: true, // OAuth emails are generally verified
          provider,
          googleId: provider === 'google' ? providerId : null,
          githubId: provider === 'github' ? providerId : null,
          avatarUrl: picture,
        },
      });

      // Create a Candidate profile by default for OAuth signups
      await this.prisma.candidateProfile.create({
        data: {
          userId: user.id,
          fullName,
          avatarUrl: picture,
        },
      });
    }

    return user;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    let profile = null;
    if (user.role === Role.CANDIDATE) {
      profile = await this.prisma.candidateProfile.findUnique({
        where: { userId },
        include: {
          certificates: {
            include: {
              course: {
                include: {
                  trainer: true,
                },
              },
            },
          },
        },
      });
    } else if (user.role === Role.EMPLOYER) {
      profile = await this.prisma.employerProfile.findUnique({
        where: { userId },
      });
    } else if (user.role === Role.FREELANCER) {
      profile = await this.prisma.freelancerProfile.findUnique({
        where: { userId },
      });
    } else if (user.role === Role.TRAINER) {
      profile = await this.prisma.trainerProfile.findUnique({
        where: { userId },
      });
    }

    return { ...user, profile };
  }

  async login(loginDto: LoginDto) {
    const identifier = loginDto.email || loginDto.phoneNumber;
    if (!identifier) {
      throw new BadRequestException('Email or Phone Number is required');
    }
    const user = await this.validateUser(identifier, loginDto.password);
    if (!user) {
      // Try to find user to log failure
      const existingUser = await this.prisma.user.findFirst({
        where: { OR: [{ email: identifier }, { phoneNumber: identifier }] }
      });
      if (existingUser) {
        await this.prisma.auditLog.create({
          data: { actionBy: existingUser.id, action: 'LOGIN_FAILURE', resource: 'Auth' }
        });
      }
      throw new UnauthorizedException('Invalid credentials');
    }
    
    await this.prisma.auditLog.create({
      data: { actionBy: user.id, action: 'LOGIN_SUCCESS', resource: 'Auth' }
    });
    const payload = { email: user.email, sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET ||
        'super-secret-refresh-key-change-in-production',
      expiresIn: '7d',
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  async loginOAuth(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET ||
        'super-secret-refresh-key-change-in-production',
      expiresIn: '7d',
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    const identifier = registerDto.email || registerDto.phoneNumber;
    if (!identifier) {
      throw new BadRequestException('Email or Phone Number is required');
    }

    console.log('[AuthService] Public registration requested for:', identifier);

    // Public registration bypasses OTP verification (all underlying OTP infrastructure remains intact)
    /*
    const strictOtpEnforcement = process.env.STRICT_OTP_ENFORCEMENT === 'true' && process.env.ENFORCE_PUBLIC_REGISTRATION_OTP === 'true';
    if (strictOtpEnforcement) {
      const isVerified = await this.prisma.oTP.findFirst({
        where: {
          identifier,
          purpose: 'REGISTER',
          verifiedAt: { not: null }
        },
        orderBy: { verifiedAt: 'desc' }
      });

      if (!isVerified || (Date.now() - isVerified.verifiedAt!.getTime()) > 30 * 60 * 1000) {
        console.log('[AuthService] Unverified OTP status logged for public user registration:', identifier);
      }
    }
    */

    const existing = await this.prisma.user.findFirst({
      where: { 
        OR: [
          { email: registerDto.email || 'NO_EMAIL' },
          { phoneNumber: registerDto.phoneNumber || 'NO_PHONE' }
        ]
       },
    });

    if (existing) {
      throw new BadRequestException('User with this email or phone already exists');
    }

    // Enforce role security: Public registration permits ONLY CANDIDATE, EMPLOYER, FREELANCER, TRAINER
    const allowedPublicRoles: Role[] = [Role.CANDIDATE, Role.EMPLOYER, Role.FREELANCER, Role.TRAINER];
    const role = registerDto.role || Role.CANDIDATE;
    
    if (!allowedPublicRoles.includes(role)) {
      throw new BadRequestException('Privileged or invalid role assignment is not permitted via public registration.');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    // Default name if not provided
    const fullName = registerDto.fullName || 'User';

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email || `${registerDto.phoneNumber}@talentflow.mock`,
        phoneNumber: registerDto.phoneNumber,
        countryCode: registerDto.countryCode,
        isEmailVerified: false, // Truthful verification state for new public accounts
        phoneVerified: false,   // Truthful verification state for new public accounts
        verificationMethod: registerDto.verificationMethod || 'EMAIL',
        passwordHash,
        role,
        status: 'ACTIVE',
      },
    });

    // Create corresponding profile based on role
    if (role === Role.CANDIDATE) {
      await this.prisma.candidateProfile.create({
        data: {
          userId: user.id,
          fullName,
        },
      });
    } else if (role === Role.EMPLOYER) {
      await this.prisma.employerProfile.create({
        data: {
          userId: user.id,
          companyName: fullName, // mapping fullName to companyName for employer
        },
      });
    } else if (role === Role.FREELANCER) {
      await this.prisma.freelancerProfile.create({
        data: {
          userId: user.id,
          fullName,
        },
      });
    } else if (role === Role.TRAINER) {
      await this.prisma.trainerProfile.create({
        data: {
          userId: user.id,
          fullName,
        },
      });
    }

    // Return tokens so they are logged in immediately after register
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-change-in-production',
      expiresIn: '7d',
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    await this.prisma.auditLog.create({
      data: { actionBy: user.id, action: 'REGISTRATION_SUCCESS', resource: 'Auth' }
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  async forgotPassword(identifier: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phoneNumber: identifier }
        ]
      }
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Wait, the OTP logic is handled by OtpService inside the Controller,
    // so this method just verifies the user exists.
    return { message: 'OTP sent successfully', type: user.phoneNumber === identifier ? 'PHONE' : 'EMAIL' };
  }

  async resetPassword(identifier: string, code: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phoneNumber: identifier }
        ]
      }
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        passwordHash,
        refreshToken: null // invalidate sessions
      },
    });

    await this.prisma.auditLog.create({
      data: { actionBy: user.id, action: 'PASSWORD_RESET_SUCCESS', resource: 'Auth' }
    });

    await this.notificationsService.notifyPasswordReset(user.id);

    return { message: 'Password reset successfully' };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { success: true };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          'super-secret-refresh-key-change-in-production',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (user.status === 'SUSPENDED') {
        throw new UnauthorizedException('Your account has been suspended.');
      }

      const newPayload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = this.jwtService.sign(newPayload, {
        secret:
          process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
        expiresIn: '15m',
      });

      return { access_token: accessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
