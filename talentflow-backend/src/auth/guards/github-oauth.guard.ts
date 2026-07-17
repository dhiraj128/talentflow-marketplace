import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Injectable()
export class GithubOAuthGuard extends AuthGuard('github') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (err || !user) {
      const res = context.switchToHttp().getResponse<Response>();
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001';
      
      let errorMsg = 'GithubAuthFailed';
      if (err?.message?.includes('invalid_client')) errorMsg = 'OAuthConfigurationMissing';
      else if (err) errorMsg = err.message || 'GithubAuthFailed';
      else if (info && info.message === 'Missing email') errorMsg = 'MissingEmail';
      
      // Redirect to frontend with error instead of returning 401 JSON
      res.redirect(`${frontendUrl}/sign-in?error=${encodeURIComponent(errorMsg)}`);
      
      return null;
    }
    return user;
  }
}
