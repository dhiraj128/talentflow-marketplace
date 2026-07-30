# TALENTFLOW MARKETPLACE — DISASTER RECOVERY RUNBOOK (V1)

**Production Environment**:
- Frontend: `https://sispl.shop` (Vercel)
- API: `https://api.sispl.shop/api/v1` (Render / Cloudflare)
- Backend Database: Render PostgreSQL (`sslmode=require`)
- File Storage: AWS S3 Private Resume Storage
- Email Provider: Resend Transactional Email

---

## 1. System Architecture & Component Inventory

| Component | Platform | Primary Function | DR Strategy |
|---|---|---|---|
| **Frontend** | Vercel | Next.js App Router (120 Static/Dynamic routes) | Redeploy from Git `main` branch |
| **Backend API** | Render | NestJS REST API | Redeploy container from Git `main` |
| **Database** | Render PostgreSQL | Primary Persistent Marketplace Data | `pg_dump` Backups + Point-in-Time Restore |
| **Storage** | AWS S3 | Candidate Resumes & Documents | Bucket Versioning & Multi-Region Backup |
| **Email Service** | Resend | Transactional Email Notifications | Multi-Domain SMTP Fallback |
| **DNS / Domain** | Cloudflare | Custom Domain Routing (`sispl.shop`) | Cloudflare DNS Failover / Records Export |

---

## 2. Render PostgreSQL Backup Capabilities

- **Automatic Backups**: Render provides daily automated PostgreSQL snapshots on active database plans with 7-day retention.
- **Manual Backups**: On-demand production backups generated using `scripts/backup-database.ps1` (`pg_dump`) prior to deployments.
- **Export Format**: Plaintext SQL or custom format `.dump` containing database schema, table data, constraints, indexes, sequences, and `_prisma_migrations` state.
- **Production Safety Guarantee**: Production PostgreSQL is strictly **READ-ONLY** during backup operations. Restores into production database are **STRICTLY PROHIBITED**.

---

## 3. Step-by-Step Production Backup Procedure

### Pre-Requisites
- PowerShell 5.1+ or Node.js v18+
- `$env:DATABASE_URL` configured for production access (with `sslmode=require`)

### Execution
Run the automated backup script from the repository root:

```powershell
.\scripts\backup-database.ps1
```

### Verification
- Backup file created at `backups/talentflow-backup-<timestamp>.sql`.
- File size > 0 bytes.
- Header contains timestamp and SQL `INSERT` statements for all public schema tables.
- File is ignored by Git (`.gitignore` entry `backups/` & `*.sql`).

---

## 4. Step-by-Step Isolated Restore & Verification Procedure

### CRITICAL PRODUCTION SAFETY RULE
Restores MUST ONLY target an isolated DR database (`DATABASE_URL_DR` or local test database). Restore operations pointing at production hostnames (`onrender.com`, `sispl.shop`, `dpg-*`) will be **BLOCKED IMMEDIATELY** by safety guards.

### Execution

```powershell
.\scripts\verify-restore.ps1 -TargetDbUrl "postgresql://dr_user:dr_pass@isolated-dr-host:5432/talentflow_dr"
```

### Data Integrity Verification Checklist (13 Core Entities)
The restore script verifies entity record counts across:
1. `User`
2. `CandidateProfile`
3. `EmployerProfile`
4. `FreelancerProfile`
5. `TrainerProfile`
6. `Job`
7. `Application`
8. `Course`
9. `Enrollment`
10. `Resume`
11. `Notification`
12. `OTP`
13. `AuditLog`

---

## 5. AWS S3 Storage Recovery Audit & Strategy

- **Current Security**: Private access control (`private`), public access blocked, access granted via time-bound pre-signed S3 URLs (`/api/v1/file-upload/presigned-url`).
- **Recommended Versioning**: Enable S3 Bucket Versioning (`aws s3api put-bucket-versioning --bucket <bucket-name> --versioning-configuration Status=Enabled`).
- **Object Deletion Recovery**:
  - If S3 versioning is enabled: Deleted objects receive a Delete Marker. Recover by deleting the Delete Marker.
  - Replacement Recovery: Previous object versions remain accessible via S3 Version ID.

---

## 6. Configuration Recovery Matrix

Recreate environment variables from designated secure credential stores:

| Configuration Item | Platform | Recovery Source |
|---|---|---|
| `DATABASE_URL` | Render / Vercel | Render PostgreSQL Connection Details |
| `JWT_SECRET` | Render | Environment Vault / 1Password |
| `RESEND_API_KEY` | Render | Resend Dashboard API Keys |
| `AWS_ACCESS_KEY_ID` | Render | AWS IAM Console |
| `AWS_SECRET_ACCESS_KEY` | Render | AWS IAM Console |
| `AWS_S3_BUCKET` | Render | AWS S3 Console |
| `NEXT_PUBLIC_API_BASE_URL` | Vercel | Vercel Environment Settings (`https://api.sispl.shop/api/v1`) |
| `NEXTAUTH_SECRET` | Vercel | Vercel Environment Settings |

*Note: Never store raw secret values in source code repository or markdown documentation.*

---

## 7. RPO & RTO Targets

- **RPO (Recovery Point Objective)**:
  - **24 Hours** for daily automated database snapshots.
  - **< 1 Hour** when executing pre-deployment manual backup script (`scripts/backup-database.ps1`).
- **RTO (Recovery Time Objective)**:
  - **< 30 Minutes** for database restoration into a new Render PostgreSQL instance.
  - **< 15 Minutes** for NestJS API / Next.js frontend service redeployment.

---

## 8. Disaster Scenario Matrix (A to H)

| Scenario | Detection | Impact | Recovery Procedure | Fallback / Rollback |
|---|---|---|---|---|
| **A. Render Backend Failure** | `GET /health` fails or Render status alert | API unavailable (502/503) | Trigger manual redeploy in Render dashboard or restart container. | Rollback to previous deployment commit hash on Render. |
| **B. PostgreSQL Corruption/Loss** | `GET /health/ready` returns 503 (`database: unhealthy`) | Write/Read failures | 1. Provision new Render DB<br>2. Run `verify-restore.ps1` with new DB URL<br>3. Update `DATABASE_URL` in Render. | Switch API connection string to last valid backup target. |
| **C. Accidental Record Deletion** | User/Audit alert or missing records | Partial data missing | Restore backup to isolated DR database, extract deleted rows, and insert into production. | Restore to point-in-time snapshot. |
| **D. Failed Deployment** | High 5xx rate / build error post-deploy | Broken endpoints | Trigger Render / Vercel rollback to prior git commit `9ef159d`. | `git revert` breaking commit and push to `main`. |
| **E. S3 Object Deletion** | 404 on pre-signed URL download | Resume download fails | Fetch previous object version from S3 Versioning or restore from S3 backup bucket. | Re-upload document via candidate profile. |
| **F. Vercel Frontend Failure** | `sispl.shop` unreachable | UI down | Redeploy latest production build via Vercel CLI / Dashboard. | Point DNS to secondary Vercel deployment preview. |
| **G. DNS / Custom Domain Failure** | Domain resolution failure (`api.sispl.shop`) | Network timeout | Update Cloudflare DNS records to point to direct Render/Vercel CNAME targets. | Revert Cloudflare DNS settings. |
| **H. Resend Email Outage** | `GET /health` shows `email: degraded` | Notifications delayed | System automatically falls back to in-app notifications (`NotificationCenter`). Marketplace remains fully operational. | Switch to secondary SMTP email provider. |

---

## 9. Post-Recovery Validation Checklist

After completing any disaster recovery restoration:

1. [ ] Verify `GET https://api.sispl.shop/api/v1/health` returns `status: "ok"`.
2. [ ] Verify `GET https://api.sispl.shop/api/v1/health/ready` returns `status: "ready"` with `database.responseTimeMs < 20ms`.
3. [ ] Verify candidate sign-in & JWT token authentication.
4. [ ] Verify job search and application submission flow.
5. [ ] Verify Notification Center unread count and dropdown updates.
6. [ ] Verify resume upload and pre-signed S3 URL generation.
7. [ ] Confirm zero data corruption across all 13 core marketplace tables.
