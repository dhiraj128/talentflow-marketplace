import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { redactSensitiveData } from '../utils/redact.util';

export interface RequestWithCorrelation extends Request {
  id?: string;
  user?: any;
}

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: RequestWithCorrelation, res: Response, next: NextFunction) {
    const startTime = process.hrtime.bigint();

    // 1. Generate or Propagate X-Request-ID Header
    const incomingRequestId = req.headers['x-request-id'] as string;
    const requestId =
      incomingRequestId && incomingRequestId.trim().length > 0
        ? incomingRequestId.trim()
        : `req-${uuidv4()}`;

    req.id = requestId;
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);

    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1000000;

      const userRole = req.user?.role || 'ANONYMOUS';
      const statusCode = res.statusCode;

      const logPayload = {
        timestamp: new Date().toISOString(),
        requestId,
        method: req.method,
        route: req.originalUrl || req.url,
        statusCode,
        durationMs: Number(durationMs.toFixed(2)),
        userRole,
      };

      const logMessage = `[${req.method}] ${req.originalUrl || req.url} ${statusCode} - ${logPayload.durationMs}ms (requestId: ${requestId})`;

      if (statusCode >= 500) {
        this.logger.error(logMessage, JSON.stringify(redactSensitiveData(logPayload)));
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}
