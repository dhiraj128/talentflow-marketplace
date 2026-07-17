import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { OAuthException } from '../filters/oauth-exception.filter';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (err || !user) {

      
      let errorMsg = 'GoogleAuthFailed';
      if (err?.message?.includes('invalid_client')) errorMsg = 'OAuthConfigurationMissing';
      else if (err) errorMsg = err.message || 'GoogleAuthFailed';
      else if (info && info.message === 'Missing email') errorMsg = 'MissingEmail';
      
      throw new OAuthException(errorMsg);
    }
    return user;
  }
}
