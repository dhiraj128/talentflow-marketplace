import { Test, TestingModule } from '@nestjs/testing';
import { redactSensitiveData } from './utils/redact.util';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('Production Security Hardening Spec', () => {
  describe('1. Log & Data Redaction Utility', () => {
    it('should redact passwords, OTPs, Bearer tokens, and secrets from nested objects', () => {
      const sensitiveInput = {
        email: 'user@sispl.shop',
        password: 'SuperSecretPassword123!',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        otp: '654321',
        authorization: 'Bearer secret_jwt_token',
        nested: {
          aws_secret_access_key: 'AWSSECRETKEY123',
          resend_api_key: 're_123456789',
          database_url: 'postgresql://user:pass@render.com/db',
        },
      };

      const redacted = redactSensitiveData(sensitiveInput);

      expect(redacted.password).toBe('[REDACTED]');
      expect(redacted.token).toBe('[REDACTED]');
      expect(redacted.otp).toBe('[REDACTED]');
      expect(redacted.authorization).toBe('[REDACTED]');
      expect(redacted.nested.aws_secret_access_key).toBe('[REDACTED]');
      expect(redacted.nested.resend_api_key).toBe('[REDACTED]');
      expect(redacted.nested.database_url).toBe('[REDACTED]');
      expect(redacted.email).toBe('user@sispl.shop');
    });
  });

  describe('2. Global Exception Filter Security & Information Disclosure', () => {
    let filter: AllExceptionsFilter;

    beforeEach(() => {
      filter = new AllExceptionsFilter();
    });

    it('should sanitize internal 500 errors and attach X-Request-ID without leaking stack traces or SQL', () => {
      const mockJson = jest.fn();
      const mockStatus = jest.fn().mockImplementation(() => ({ json: mockJson }));
      const mockSetHeader = jest.fn();

      const mockHost = {
        switchToHttp: () => ({
          getRequest: () => ({
            id: 'req-security-test-123',
            url: '/api/v1/jobs',
          }),
          getResponse: () => ({
            status: mockStatus,
            setHeader: mockSetHeader,
          }),
        }),
      } as unknown as ArgumentsHost;

      const internalDbError = new Error('FATAL: Connection to PostgreSQL failed at 192.168.1.10:5432 SELECT * FROM "User"');

      filter.catch(internalDbError, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockSetHeader).toHaveBeenCalledWith('X-Request-ID', 'req-security-test-123');

      const responseBody = mockJson.mock.calls[0][0];
      expect(responseBody.statusCode).toBe(500);
      expect(responseBody.message).toBe('Internal server error');
      expect(responseBody.requestId).toBe('req-security-test-123');
      expect(JSON.stringify(responseBody)).not.toContain('192.168.1.10');
      expect(JSON.stringify(responseBody)).not.toContain('SELECT * FROM');
      expect(JSON.stringify(responseBody)).not.toContain('PostgreSQL');
    });

    it('should preserve standard user HTTP status codes (400, 401, 403, 404, 409, 429)', () => {
      const mockJson = jest.fn();
      const mockStatus = jest.fn().mockImplementation(() => ({ json: mockJson }));
      const mockSetHeader = jest.fn();

      const mockHost = {
        switchToHttp: () => ({
          getRequest: () => ({
            id: 'req-403-test',
            url: '/api/v1/admin/users',
          }),
          getResponse: () => ({
            status: mockStatus,
            setHeader: mockSetHeader,
          }),
        }),
      } as unknown as ArgumentsHost;

      const forbiddenException = new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);

      filter.catch(forbiddenException, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(403);
      const responseBody = mockJson.mock.calls[0][0];
      expect(responseBody.statusCode).toBe(403);
      expect(responseBody.message).toBe('Forbidden resource');
      expect(responseBody.requestId).toBe('req-403-test');
    });
  });
});
