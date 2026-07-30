"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const refresh_dto_1 = require("./dto/refresh.dto");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const google_oauth_guard_1 = require("./guards/google-oauth.guard");
const github_oauth_guard_1 = require("./guards/github-oauth.guard");
const oauth_exception_filter_1 = require("./filters/oauth-exception.filter");
const otp_service_1 = require("./otp.service");
const otp_dto_1 = require("./dto/otp.dto");
let AuthController = class AuthController {
    authService;
    otpService;
    constructor(authService, otpService) {
        this.authService = authService;
        this.otpService = otpService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async sendEmailOtp(dto) {
        return this.otpService.sendOtp(dto.identifier, dto.purpose, 'EMAIL');
    }
    async sendPhoneOtp(dto) {
        return this.otpService.sendOtp(dto.identifier, dto.purpose, 'PHONE');
    }
    async verifyEmailOtp(dto) {
        return this.otpService.verifyOtp(dto.identifier, dto.code, dto.purpose);
    }
    async verifyPhoneOtp(dto) {
        return this.otpService.verifyOtp(dto.identifier, dto.code, dto.purpose);
    }
    async resendOtp(dto) {
        const type = dto.identifier.includes('@') ? 'EMAIL' : 'PHONE';
        return this.otpService.sendOtp(dto.identifier, dto.purpose, type);
    }
    async forgotPassword(dto) {
        return this.authService.forgotPassword(dto.identifier);
    }
    async resetPassword(dto) {
        return this.authService.resetPassword(dto.identifier, dto.code, dto.newPassword);
    }
    async logout(user) {
        return this.authService.logout(user.userId || user.sub);
    }
    getProfile(user) {
        if (!user) {
            throw new common_1.UnauthorizedException('User is not authenticated');
        }
        return this.authService.getProfile(user.sub || user.userId);
    }
    async refresh(body) {
        return this.authService.refreshToken(body.refresh_token);
    }
    async googleAuth(req) { }
    async googleAuthRedirect(req, res) {
        const tokens = await this.authService.loginOAuth(req.user);
        const frontendUrl = process.env.FRONTEND_URL || 'https://sispl.shop';
        return res.redirect(`${frontendUrl}/auth/callback?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`);
    }
    async githubAuth(req) { }
    async githubAuthRedirect(req, res) {
        const tokens = await this.authService.loginOAuth(req.user);
        const frontendUrl = process.env.FRONTEND_URL || 'https://sispl.shop';
        return res.redirect(`${frontendUrl}/auth/callback?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login to the application' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return access and refresh tokens.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('send-email-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Send OTP to Email' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.SendOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendEmailOtp", null);
__decorate([
    (0, common_1.Post)('send-phone-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Send OTP to Phone' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.SendOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendPhoneOtp", null);
__decorate([
    (0, common_1.Post)('verify-email-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Email OTP' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmailOtp", null);
__decorate([
    (0, common_1.Post)('verify-phone-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Phone OTP' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyPhoneOtp", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Resend OTP' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.SendOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Forgot Password' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset Password using OTP' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout and invalidate refresh token' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using refresh token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_dto_1.RefreshDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Login with Google' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOAuthGuard),
    (0, common_1.UseFilters)(oauth_exception_filter_1.OAuthExceptionFilter),
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth callback' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)('github'),
    (0, common_1.UseGuards)(github_oauth_guard_1.GithubOAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Login with GitHub' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuth", null);
__decorate([
    (0, common_1.Get)('github/callback'),
    (0, common_1.UseGuards)(github_oauth_guard_1.GithubOAuthGuard),
    (0, common_1.UseFilters)(oauth_exception_filter_1.OAuthExceptionFilter),
    (0, swagger_1.ApiOperation)({ summary: 'GitHub OAuth callback' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuthRedirect", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        otp_service_1.OtpService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map