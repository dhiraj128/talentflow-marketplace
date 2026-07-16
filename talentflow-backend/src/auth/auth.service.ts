import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, isEmailVerified: true, createdAt: true }
    });
    
    if (!user) throw new UnauthorizedException('User not found');
    
    let profile = null;
    if (user.role === Role.CANDIDATE) {
      profile = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    } else if (user.role === Role.EMPLOYER) {
      profile = await this.prisma.employerProfile.findUnique({ where: { userId } });
    } else if (user.role === Role.FREELANCER) {
      profile = await this.prisma.freelancerProfile.findUnique({ where: { userId } });
    } else if (user.role === Role.TRAINER) {
      profile = await this.prisma.trainerProfile.findUnique({ where: { userId } });
    }
    
    return { ...user, profile };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      expiresIn: '15m'
    });
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-change-in-production',
      expiresIn: '7d'
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user
    };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: registerDto.email } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        passwordHash,
        role: registerDto.role,
        isEmailVerified: false,
      },
    });

    if (registerDto.role === Role.CANDIDATE) {
      await this.prisma.candidateProfile.create({
        data: {
          userId: user.id,
          fullName: registerDto.fullName || '',
        }
      });
    } else if (registerDto.role === Role.EMPLOYER) {
      await this.prisma.employerProfile.create({
        data: {
          userId: user.id,
          companyName: registerDto.fullName || '',
        }
      });
    } else if (registerDto.role === Role.FREELANCER) {
      await this.prisma.freelancerProfile.create({
        data: {
          userId: user.id,
          fullName: registerDto.fullName || '',
        }
      });
    } else if (registerDto.role === Role.TRAINER) {
      await this.prisma.trainerProfile.create({
        data: {
          userId: user.id,
          fullName: registerDto.fullName || '',
        }
      });
    }

    return this.login({ email: registerDto.email, password: registerDto.password });
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
        secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-change-in-production',
      });
      
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
        expiresIn: '15m'
      });

      return { access_token: accessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
