# TALENTFLOW MARKETPLACE — PRODUCTION OPERATIONAL RUNBOOK (V1)

**Production Architecture**:
- Frontend: Next.js App Router on Vercel (`https://sispl.shop`)
- Backend API: NestJS REST API on Render (`https://api.sispl.shop/api/v1`)
- Database: Render PostgreSQL (`sslmode=require`)
- Object Storage: AWS S3 Private Resume Storage
- Email Service: Resend Transactional Email Provider
- DNS & CDN: Cloudflare Proxy & SSL termination (`sispl.shop`, `api.sispl.shop`)

---

## 1. Service Inventory & Domain Mapping

| Service Name | Host / Domain | Provider | Health Endpoint |
|---|---|---|---|
| **Production Frontend** | `https://sispl.shop`<br>`https://www.sispl.shop` | Vercel | `GET /` |
| **Production API** | `https://api.sispl.shop/api/v1` | Render / Cloudflare | `GET /api/v1/health` |
| **Direct Backend Origin** | `https://talentflow-backend-qn7b.onrender.com` | Render Container | `GET /health` |
| **PostgreSQL Database** | Render Managed PostgreSQL | Render | `GET /api/v1/health/ready` |
| **Private Document Bucket** | AWS S3 Private Storage | AWS (`us-east-1`) | Pre-Signed S3 URLs |
| **Email Gateway** | Resend API | Resend | Transactional Email API |

---

## 2. Health & Readiness Monitoring

### Health Endpoint
- **URL**: `GET https://api.sispl.shop/api/v1/health`
- **Expected Status**: `HTTP 200 OK`
- **Response Format**:
  ```json
  {
    "status": "ok",
    "service": "talentflow-backend",
    "timestamp": "2026-07-30T20:15:00.000Z",
    "version": "1.0.2",
    "commit": "8614980",
    "uptime": 124.5,
    "dependencies": {
      "database": "healthy",
      "email": "healthy",
      "storage": "healthy"
    }
  }
  ```

### Readiness Endpoint
- **URL**: `GET https://api.sispl.shop/api/v1/health/ready`
- **Expected Status**: `HTTP 200 OK`
- **Failure Status**: `HTTP 503 Service Unavailable` (if PostgreSQL database `SELECT 1` fails or times out)
- **Response Format**:
  ```json
  {
    "status": "ready",
    "database": {
      "status": "healthy",
      "responseTimeMs": 4.56
    },
    "capabilities": {
      "email": "healthy",
      "storage": "healthy"
    }
  }
  ```

---

## 3. Environment Configuration Inventory

Names of required production environment variables (secret values stored in Render Vault / Vercel Environment Settings):

- `DATABASE_URL` (PostgreSQL connection string with `sslmode=require`)
- `JWT_SECRET` (Auth token signing secret)
- `RESEND_API_KEY` (Resend transactional email key)
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (AWS IAM credentials)
- `AWS_S3_BUCKET` (Private resume bucket name)
- `AWS_REGION` (AWS S3 region)
- `NEXT_PUBLIC_API_BASE_URL` (`https://api.sispl.shop/api/v1`)
- `FRONTEND_URL` (`https://sispl.shop`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (Google OAuth)

*Note: Never print raw credential values in logs, scripts, or operational runbooks.*

---

## 4. Deployment Procedures

### Frontend Deployment (Vercel)
- Production branch: `main`
- Automatic deployment triggered on git push to `origin/main`.
- Manual deployment via Vercel CLI: `vercel --prod`.

### Backend Deployment (Render)
- Production branch: `main`
- Automatic container build & deploy triggered on git push to `origin/main`.
- Build Command: `npm run build` (`npx rimraf dist && npx prisma generate && npx nest build`).
- Start Command: `npm run start:prod`.

---

## 5. Rollback Procedures

### Frontend Rollback (Vercel)
1. Open Vercel Dashboard $\rightarrow$ **Deployments**.
2. Select previous stable deployment hash (e.g. Commit `986fa6a` or `59af6e0`).
3. Click **Instant Rollback**.

### Backend Rollback (Render)
1. Open Render Dashboard $\rightarrow$ `talentflow-backend-qn7b`.
2. Select **Deploys** $\rightarrow$ Click **Rollback to this deploy** on prior commit (`986fa6a`).
3. Alternatively, git revert the breaking commit locally and push:
   ```bash
   git revert HEAD
   git push origin main
   ```

### Environment Configuration Rollback
1. Open Render Dashboard $\rightarrow$ **Environment**.
2. Revert modified variable key to previous known working value.
3. Save changes $\rightarrow$ Trigger zero-downtime container restart.

---

## 6. Incident Response & Escalation Protocols

| Incident Level | Severity | Example Scenario | Initial Action | Escalation Target |
|---|---|---|---|---|
| **P0 — Critical** | Database down, site outage (500/502) | PostgreSQL `SELECT 1` failure | Check `/health/ready`, check Render DB dashboard | Lead Infra Engineer |
| **P1 — Major** | Email delivery down or auth failure | Resend API failure / OAuth down | Fall back to in-app NotificationCenter | Lead Backend Engineer |
| **P2 — Minor** | UI alignment issue or search lag | Filter latency > 1s | Log ticket, issue hotfix in next release | Frontend Developer |

---

## 7. Database Backup & Disaster Recovery

- **Pre-Deployment Backup Script**: Run before major migrations or releases:
  ```powershell
  .\scripts\backup-database.ps1
  ```
- **Isolated Target Restore Verification Script**:
  ```powershell
  .\scripts\verify-restore.ps1 -TargetDbUrl "postgresql://dr_user:dr_pass@isolated-dr-host:5432/dr_db"
  ```
- **Disaster Recovery Runbook**: Refer to [DISASTER_RECOVERY.md](file:///c:/Users/dhira_5fqr2uc/Downloads/stitch_talentflow_marketplace/talentflow-marketplace/docs/DISASTER_RECOVERY.md).

---

## 8. S3 Storage & Object Versioning Guidelines

- **Access Policy**: Block Public Access enabled. Pre-signed URLs generated via `/api/v1/file-upload/presigned-url` with 15-minute expiration.
- **S3 Object Versioning & Recovery Tooling**:
  - List object version history:
    ```bash
    node scripts/s3-list-versions.js --key "resumes/<candidateId>/file.pdf"
    ```
  - Safe object version recovery (Dry-run mode by default; add `--execute` to apply):
    ```bash
    node scripts/s3-recover-object.js --key "resumes/<candidateId>/file.pdf" --delete-marker "<marker-id>" --execute
    ```
- **S3 Disaster Recovery Runbook**: Refer to [S3_DISASTER_RECOVERY.md](file:///c:/Users/dhira_5fqr2uc/Downloads/stitch_talentflow_marketplace/talentflow-marketplace/docs/S3_DISASTER_RECOVERY.md).

---

## 9. Troubleshooting & Log Correlation (`X-Request-ID`)

- Every HTTP request contains or inherits `X-Request-ID` in request headers and response payloads.
- Production backend logs include `requestId: req-...` for log correlation.
- Log entries automatically redact sensitive fields (`password`, `token`, `otp`, `authorization`, `cookie`, `resend_api_key`, `aws_secret_access_key`, `database_url`).
- Support Engineers can query Render log explorer by searching `requestId`.
