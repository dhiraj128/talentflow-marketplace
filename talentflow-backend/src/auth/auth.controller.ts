import { RefreshDto } from './dto/refresh.dto';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { GithubOAuthGuard } from './guards/github-oauth.guard';
import { OAuthExceptionFilter } from './filters/oauth-exception.filter';
import { OtpService } from './otp.service';
import { SendOtpDto, VerifyOtpDto, ForgotPasswordDto, ResetPasswordDto } from './dto/otp.dto';
import { Role } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to the application' })
  @ApiResponse({
    status: 200,
    description: 'Return access and refresh tokens.',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('send-email-otp')
  @ApiOperation({ summary: 'Send OTP to Email' })
  async sendEmailOtp(@Body() dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.identifier, dto.purpose, 'EMAIL');
  }

  @Post('send-phone-otp')
  @ApiOperation({ summary: 'Send OTP to Phone' })
  async sendPhoneOtp(@Body() dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.identifier, dto.purpose, 'PHONE');
  }

  @Post('verify-email-otp')
  @ApiOperation({ summary: 'Verify Email OTP' })
  async verifyEmailOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto.identifier, dto.code, dto.purpose);
  }

  @Post('verify-phone-otp')
  @ApiOperation({ summary: 'Verify Phone OTP' })
  async verifyPhoneOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto.identifier, dto.code, dto.purpose);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP' })
  async resendOtp(@Body() dto: SendOtpDto) {
    const type = dto.identifier.includes('@') ? 'EMAIL' : 'PHONE';
    return this.otpService.sendOtp(dto.identifier, dto.purpose, type);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate Forgot Password' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.identifier);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password using OTP' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.identifier, dto.code, dto.newPassword);
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
    @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.userId || user.sub);
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.sub || user.userId);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refresh(@Body() body: RefreshDto) {
    return this.authService.refreshToken(body.refresh_token);
  }

  // --- GOOGLE OAUTH ---
  @Get('google')
  @ApiOperation({ summary: 'Login with Google' })
  async googleAuth(@Req() req: Request) {}

  @Get('google/callback')
  @UseFilters(OAuthExceptionFilter)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.loginOAuth(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    // Redirect back to frontend callback page with tokens
    return res.redirect(
      `${frontendUrl}/auth/callback?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`,
    );
  }

  // --- GITHUB OAUTH ---
  @Get('github')
  @ApiOperation({ summary: 'Login with GitHub' })
  async githubAuth(@Req() req: Request) {}

  @Get('github/callback')
  @UseFilters(OAuthExceptionFilter)
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.loginOAuth(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    // Redirect back to frontend callback page with tokens
    return res.redirect(
      `${frontendUrl}/auth/callback?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`,
    );
  }
}
