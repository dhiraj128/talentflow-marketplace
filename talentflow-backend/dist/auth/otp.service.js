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
var OtpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcrypt"));
const resend_email_provider_1 = require("./providers/resend-email.provider");
let OtpService = OtpService_1 = class OtpService {
    prisma;
    emailProvider;
    logger = new common_1.Logger(OtpService_1.name);
    constructor(prisma, emailProvider) {
        this.prisma = prisma;
        this.emailProvider = emailProvider;
    }
    generateSecureCode() {
        return crypto.randomInt(100000, 999999).toString();
    }
    async sendOtp(identifier, purpose, type) {
        const recentOtp = await this.prisma.oTP.findFirst({
            where: { identifier, purpose },
            orderBy: { createdAt: 'desc' },
        });
        if (recentOtp && (Date.now() - recentOtp.createdAt.getTime()) < 60000) {
            throw new common_1.BadRequestException('Please wait 60 seconds before requesting a new OTP.');
        }
        const code = this.generateSecureCode();
        const codeHash = await bcrypt.hash(code, 10);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.prisma.oTP.create({
            data: {
                identifier,
                codeHash,
                purpose,
                expiresAt,
            },
        });
        this.logger.log(`[OTP] OTP record created for ${purpose} (${type})`);
        if (type === 'EMAIL') {
            await this.emailProvider.sendOtp(identifier, code);
        }
        else {
            this.logger.log(`[MOCK SMS PROVIDER] Sending OTP to ${identifier} for ${purpose}`);
        }
        return { message: 'OTP sent successfully' };
    }
    async verifyOtp(identifier, code, purpose) {
        const otpRecord = await this.prisma.oTP.findFirst({
            where: { identifier, purpose },
            orderBy: { createdAt: 'desc' },
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('No OTP found for this identifier.');
        }
        if (otpRecord.verifiedAt) {
            throw new common_1.BadRequestException('This OTP has already been verified.');
        }
        if (otpRecord.attempts >= 5) {
            throw new common_1.BadRequestException('Maximum verification attempts reached. Please request a new OTP.');
        }
        if (otpRecord.expiresAt < new Date()) {
            throw new common_1.BadRequestException('OTP has expired.');
        }
        const isValid = await bcrypt.compare(code, otpRecord.codeHash);
        if (!isValid) {
            await this.prisma.oTP.update({
                where: { id: otpRecord.id },
                data: { attempts: otpRecord.attempts + 1 },
            });
            throw new common_1.BadRequestException('Invalid OTP code.');
        }
        await this.prisma.oTP.update({
            where: { id: otpRecord.id },
            data: { verifiedAt: new Date() },
        });
        return { message: 'OTP verified successfully' };
    }
    async isVerifiedRecently(identifier, purpose) {
        const otpRecord = await this.prisma.oTP.findFirst({
            where: {
                identifier,
                purpose,
                verifiedAt: { not: null }
            },
            orderBy: { verifiedAt: 'desc' },
        });
        if (!otpRecord)
            return false;
        return (Date.now() - otpRecord.verifiedAt.getTime()) < 30 * 60 * 1000;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = OtpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        resend_email_provider_1.ResendEmailProvider])
], OtpService);
//# sourceMappingURL=otp.service.js.map