import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export class OAuthException extends HttpException {
  constructor(public readonly errorType: string) {
    super(errorType, HttpStatus.UNAUTHORIZED);
  }
}

@Catch(OAuthException)
export class OAuthExceptionFilter implements ExceptionFilter {
  catch(exception: OAuthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    const errorMsg = exception.errorType || 'GoogleAuthFailed';

    if (!response.headersSent) {
      response.redirect(
        `${frontendUrl}/sign-in?error=${encodeURIComponent(errorMsg)}`,
      );
    }
  }
}
