# TalentFlow Marketplace Production Runbook

## Overview
This runbook provides step-by-step procedures for managing production deployments, migrations, health monitoring, and DR procedures for TalentFlow Marketplace (Release `v1.3.0`).

---

## 1. System Architecture & Production Domains

- **Production Frontend**: `https://sispl.shop` (Vercel)
- **Production API**: `https://api.sispl.shop/api/v1` (Render / Cloudflare)
- **Database**: PostgreSQL (AWS RDS / Render Postgres)
- **Object Storage**: AWS S3 (`sispl-talentflow-resumes`, Versioning: ENABLED)
- **Email Service**: Resend Transactional Email API

---

## 2. Health Monitoring & Verification

```bash
# Check API liveness
curl -i https://api.sispl.shop/api/v1/health

# Check API readiness & DB connection
curl -i https://api.sispl.shop/api/v1/health/ready
```

---

## 3. Production Deployment & Database Migration Procedure

### Forward Migration Policy
- **STRICT RULE**: Only forward-only Prisma migrations (`npx prisma migrate deploy`) are permitted.
- `prisma migrate reset`, `prisma db push`, `prisma db seed`, `TRUNCATE`, and `DROP TABLE` are **STRICTLY FORBIDDEN**.

```bash
# 1. Pull latest release tag
git checkout v1.3.0

# 2. Execute forward migration against production database
cd talentflow-backend
npx prisma migrate deploy

# 3. Verify zero mock data compliance
cd ..
node scripts/audit-production-mocks.js
```
