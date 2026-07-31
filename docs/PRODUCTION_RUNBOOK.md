# TALENTFLOW MARKETPLACE — PRODUCTION OPERATIONAL RUNBOOK (V1.4)

## 1. Production Architecture Overview
- **Frontend App**: Next.js 14 hosted on Vercel (`https://sispl.shop`)
- **Backend API**: NestJS hosted on Render (`https://api.sispl.shop/api/v1`)
- **Database**: PostgreSQL with Prisma ORM
- **Object Storage**: AWS S3 with Block Public Access & Pre-signed URLs
- **Transactional Email**: Resend API

---

## 2. Health Monitoring & Observability

### Endpoint Checks
```bash
# Liveness Check
curl -i https://api.sispl.shop/api/v1/health

# Readiness Check (Live PostgreSQL SELECT 1 test)
curl -i https://api.sispl.shop/api/v1/health/ready
```

### Log Correlation
Every HTTP request generates or propagates `X-Request-ID`.
Search Render and Cloudflare logs using `requestId: <UUID>` to trace request lifecycles across frontend and backend boundaries.

---

## 3. Disaster Recovery & Backup Protocols

### PostgreSQL DR Protocol
1. Daily automated WAL archiving and point-in-time recovery (PITR).
2. To test restore on non-production canary instance:
   ```bash
   pg_restore -h <dr-host> -U <dr-user> -d <dr-dbname> backup.dump
   ```
3. Forward-only Prisma migrations are strictly mandated. `prisma migrate reset` is strictly forbidden in production.

### AWS S3 Recovery Protocol
1. AWS S3 Versioning & Default Encryption (AES-256) enabled.
2. Block Public Access enabled on all production buckets.
3. Candidate resume access uses temporary pre-signed GET URLs with 15-minute expiration.

---

## 4. Incident Response & Escalation Matrix

- **P0 Outage**: Database down or `GET /health/ready` returns 503. Action: Page primary on-call engineer, check Render DB metrics, initiate PITR restore if needed.
- **P1 Core Failure**: Authentication / OTP or Offer Acceptance endpoint failing. Action: Inspect `AllExceptionsFilter` logs by `X-Request-ID`, deploy hotfix patch tag `v1.4.x`.
- **P2 Degradation**: Transactional email queue delayed. Action: Check Resend API dashboard, verify API key health.
- **P3 Non-Critical**: Minor UI layout defect. Action: Log in backlog.
