const SENSITIVE_KEYS = new Set([
  'password',
  'pass',
  'passwordhash',
  'otp',
  'code',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'cookie',
  'resend_api_key',
  'aws_secret_access_key',
  'aws_access_key_id',
  'database_url',
  'jwt_secret',
  'secret',
]);

/**
 * Centralized log redaction utility to strip credentials, OTPs, tokens, and secrets
 */
export function redactSensitiveData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    // Redact Bearer tokens
    if (data.toLowerCase().startsWith('bearer ')) {
      return 'Bearer [REDACTED]';
    }
    // Redact postgres database connection strings
    if (data.toLowerCase().includes('postgres://') || data.toLowerCase().includes('postgresql://')) {
      return 'postgresql://[REDACTED_DB_URL]';
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item));
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lowerKey)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = redactSensitiveData(data[key]);
      }
    }
    return sanitized;
  }

  return data;
}
