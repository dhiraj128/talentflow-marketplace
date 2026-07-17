import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (err || !user) {
      const res = context.switchToHttp().getResponse<Response>();
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      
      let errorMsg = 'GoogleAuthFailed';
      if (err?.message?.includes('invalid_client')) errorMsg = 'OAuthConfigurationMissing';
      else if (err) errorMsg = err.message || 'GoogleAuthFailed';
      else if (info && info.message === 'Missing email') errorMsg = 'MissingEmail';
      
      // Redirect to frontend with error instead of returning 401 JSON
      res.redirect(`${frontendUrl}/sign-in?error=${encodeURIComponent(errorMsg)}`);
      
      return null;
    }
    return user;
  }
}
