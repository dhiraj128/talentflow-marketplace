import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { redactSensitiveData } from '../utils/redact.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. Extract or Generate Request ID
    const requestId =
      (request as any).id ||
      (request.headers['x-request-id'] as string) ||
      `req-unknown-${Date.now()}`;

    response.setHeader('X-Request-ID', requestId);

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal Server Error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responsePayload = exception.getResponse() as any;

      if (typeof responsePayload === 'string') {
        message = responsePayload;
      } else if (typeof responsePayload === 'object' && responsePayload !== null) {
        message = responsePayload.message || exception.message;
        error = responsePayload.error || exception.name;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Securely map Prisma errors to standard HTTP status codes without leaking DB internals
      this.logger.error(
        `[PRISMA ERROR] requestId: ${requestId} - Code: ${exception.code}`,
      );

      switch (exception.code) {
        case 'P2002':
          statusCode = HttpStatus.CONFLICT;
          message = 'A record with this value already exists.';
          error = 'Conflict';
          break;
        case 'P2003':
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Foreign key constraint validation failed.';
          error = 'Bad Request';
          break;
        case 'P2025':
          statusCode = HttpStatus.NOT_FOUND;
          message = 'Record not found.';
          error = 'Not Found';
          break;
        default:
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Database request validation failed.';
          error = 'Bad Request';
          break;
      }
    } else {
      // Unhandled Server Exception
      const rawErrorMsg =
        exception instanceof Error ? exception.message : String(exception);
      this.logger.error(
        `[UNHANDLED ERROR] requestId: ${requestId} - ${rawErrorMsg}`,
        exception instanceof Error ? exception.stack : undefined,
      );
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Internal Server Error';
    }

    // Standardized Safe Error Payload
    const errorResponse: any = redactSensitiveData({
      statusCode,
      message,
      error,
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    });

    response.status(statusCode).json(errorResponse);
  }
}
