import { RefreshDto } from './dto/refresh.dto';
import { Controller, Post, Body, UseGuards, Get, Req, Res, UseFilters } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { GithubOAuthGuard } from './guards/github-oauth.guard';
import { OAuthExceptionFilter } from './filters/oauth-exception.filter';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to the application' })
  @ApiResponse({ status: 200, description: 'Return access and refresh tokens.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.userId || user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Login with Google' })
  async googleAuth(@Req() req: Request) {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.loginOAuth(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    // Redirect back to frontend callback page with tokens
    return res.redirect(`${frontendUrl}/auth/callback?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`);
  }

  // --- GITHUB OAUTH ---
  @Get('github')
  @UseGuards(GithubOAuthGuard)
  @ApiOperation({ summary: 'Login with GitHub' })
  async githubAuth(@Req() req: Request) {}

  @Get('github/callback')
  @UseGuards(GithubOAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.loginOAuth(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    // Redirect back to frontend callback page with tokens
    return res.redirect(`${frontendUrl}/auth/callback?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`);
  }
}

