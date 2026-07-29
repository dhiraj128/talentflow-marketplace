"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(identifier, pass) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phoneNumber: identifier }
                ]
            }
        });
        if (user && user.status === 'SUSPENDED') {
            throw new common_1.UnauthorizedException('Your account has been suspended.');
        }
        if (user &&
            user.passwordHash &&
            (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async validateOAuthUser(oauthUser) {
        const { email, firstName, lastName, provider, providerId, picture } = oauthUser;
        let user = await this.prisma.user.findUnique({ where: { email } });
        const fullName = `${firstName} ${lastName}`.trim();
        if (user && user.status === 'SUSPENDED') {
            throw new common_1.UnauthorizedException('Your account has been suspended.');
        }
        if (user) {
            const updateData = {};
            if (!user.provider)
                updateData.provider = provider;
            if (provider === 'google' && !user.googleId)
                updateData.googleId = providerId;
            if (provider === 'github' && !user.githubId)
                updateData.githubId = providerId;
            if (!user.avatarUrl && picture)
                updateData.avatarUrl = picture;
            if (Object.keys(updateData).length > 0) {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: updateData,
                });
            }
        }
        else {
            user = await this.prisma.user.create({
                data: {
                    email,
                    role: client_1.Role.CANDIDATE,
                    isEmailVerified: true,
                    provider,
                    googleId: provider === 'google' ? providerId : null,
                    githubId: provider === 'github' ? providerId : null,
                    avatarUrl: picture,
                },
            });
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
    async getProfile(userId) {
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
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        let profile = null;
        if (user.role === client_1.Role.CANDIDATE) {
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
        }
        else if (user.role === client_1.Role.EMPLOYER) {
            profile = await this.prisma.employerProfile.findUnique({
                where: { userId },
            });
        }
        else if (user.role === client_1.Role.FREELANCER) {
            profile = await this.prisma.freelancerProfile.findUnique({
                where: { userId },
            });
        }
        else if (user.role === client_1.Role.TRAINER) {
            profile = await this.prisma.trainerProfile.findUnique({
                where: { userId },
            });
        }
        return { ...user, profile };
    }
    async login(loginDto) {
        const identifier = loginDto.email || loginDto.phoneNumber;
        if (!identifier) {
            throw new common_1.BadRequestException('Email or Phone Number is required');
        }
        const user = await this.validateUser(identifier, loginDto.password);
        if (!user) {
            const existingUser = await this.prisma.user.findFirst({
                where: { OR: [{ email: identifier }, { phoneNumber: identifier }] }
            });
            if (existingUser) {
                await this.prisma.auditLog.create({
                    data: { actionBy: existingUser.id, action: 'LOGIN_FAILURE', resource: 'Auth' }
                });
            }
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.prisma.auditLog.create({
            data: { actionBy: user.id, action: 'LOGIN_SUCCESS', resource: 'Auth' }
        });
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET ||
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
    async loginOAuth(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET ||
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
    async register(registerDto) {
        const identifier = registerDto.email || registerDto.phoneNumber;
        if (!identifier) {
            throw new common_1.BadRequestException('Email or Phone Number is required');
        }
        console.log('[AuthService] Public registration requested for:', identifier);
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: registerDto.email || 'NO_EMAIL' },
                    { phoneNumber: registerDto.phoneNumber || 'NO_PHONE' }
                ]
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('User with this email or phone already exists');
        }
        const allowedPublicRoles = [client_1.Role.CANDIDATE, client_1.Role.EMPLOYER, client_1.Role.FREELANCER, client_1.Role.TRAINER];
        const role = registerDto.role || client_1.Role.CANDIDATE;
        if (!allowedPublicRoles.includes(role)) {
            throw new common_1.BadRequestException('Privileged or invalid role assignment is not permitted via public registration.');
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(registerDto.password, salt);
        const fullName = registerDto.fullName || 'User';
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email || `${registerDto.phoneNumber}@talentflow.mock`,
                phoneNumber: registerDto.phoneNumber,
                countryCode: registerDto.countryCode,
                isEmailVerified: false,
                phoneVerified: false,
                verificationMethod: registerDto.verificationMethod || 'EMAIL',
                passwordHash,
                role,
                status: 'ACTIVE',
            },
        });
        if (role === client_1.Role.CANDIDATE) {
            await this.prisma.candidateProfile.create({
                data: {
                    userId: user.id,
                    fullName,
                },
            });
        }
        else if (role === client_1.Role.EMPLOYER) {
            await this.prisma.employerProfile.create({
                data: {
                    userId: user.id,
                    companyName: fullName,
                },
            });
        }
        else if (role === client_1.Role.FREELANCER) {
            await this.prisma.freelancerProfile.create({
                data: {
                    userId: user.id,
                    fullName,
                },
            });
        }
        else if (role === client_1.Role.TRAINER) {
            await this.prisma.trainerProfile.create({
                data: {
                    userId: user.id,
                    fullName,
                },
            });
        }
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
    async forgotPassword(identifier) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phoneNumber: identifier }
                ]
            }
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return { message: 'User found', type: user.phoneNumber === identifier ? 'PHONE' : 'EMAIL' };
    }
    async resetPassword(identifier, code, newPassword) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phoneNumber: identifier }
                ]
            }
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                refreshToken: null
            },
        });
        await this.prisma.auditLog.create({
            data: { actionBy: user.id, action: 'PASSWORD_RESET_SUCCESS', resource: 'Auth' }
        });
        return { message: 'Password reset successfully' };
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return { success: true };
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_REFRESH_SECRET ||
                    'super-secret-refresh-key-change-in-production',
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user || user.refreshToken !== token) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            if (user.status === 'SUSPENDED') {
                throw new common_1.UnauthorizedException('Your account has been suspended.');
            }
            const newPayload = { email: user.email, sub: user.id, role: user.role };
            const accessToken = this.jwtService.sign(newPayload, {
                secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
                expiresIn: '15m',
            });
            return { access_token: accessToken };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map