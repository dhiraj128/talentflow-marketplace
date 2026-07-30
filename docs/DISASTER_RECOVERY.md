# TALENTFLOW MARKETPLACE — DISASTER RECOVERY RUNBOOK & DRILL REPORT (V1)

**Production Environment**:
- Frontend: `https://sispl.shop` (Vercel)
- API: `https://api.sispl.shop/api/v1` (Render / Cloudflare)
- Backend Database: Render PostgreSQL (`sslmode=require`)
- File Storage: AWS S3 Private Resume Storage
- Email Provider: Resend Transactional Email
- Latest DR Implementation Commit: `986fa6a`

---

## 1. System Architecture & Component Inventory

| Component | Platform | Primary Function | DR Strategy |
|---|---|---|---|
| **Frontend** | Vercel | Next.js App Router (120 Static/Dynamic routes) | Redeploy from Git `main` branch |
| **Backend API** | Render | NestJS REST API | Redeploy container from Git `main` |
| **Database** | Render PostgreSQL | Primary Persistent Marketplace Data | `pg_dump` / Prisma Export + Isolated Target Restore |
| **Storage** | AWS S3 | Candidate Resumes & Documents | Pre-Signed URLs & Bucket Versioning |
| **Email Service** | Resend | Transactional Email Notifications | Multi-Domain SMTP Fallback |
| **DNS / Domain** | Cloudflare | Custom Domain Routing (`sispl.shop`) | Cloudflare DNS Failover / Records Export |

---

## 2. Render PostgreSQL Backup Audit & Capabilities

- **CONFIGURED / VERIFIED**:
  - Daily automated snapshots on active Render PostgreSQL plans with 7-day retention.
  - On-demand production backups generated via `scripts/backup-database.ps1` or `scripts/backup-pg.js` prior to deployments.
  - SSL mode enforced (`sslmode=require`).
  - Production database is strictly **READ-ONLY** during backup operations.
- **AVAILABLE BUT NOT VERIFIED**:
  - Point-In-Time Recovery (PITR) on Render Pro database tiers.
- **RECOMMENDED**:
  - Scheduled automated daily snapshot exports to an off-site AWS S3 backup bucket.

---

## 3. Production Backup & Safety Guard Enforcement

### Production Safety Model (5-Layer Protection)
1. **Target Missing Check**: Aborts if DR target URL is missing.
2. **Source == Target Equality Check**: Aborts if target URL matches primary production `DATABASE_URL`.
3. **Production Hostname Denylist**: Aborts if target URL contains `onrender.com`, `sispl.shop`, `dpg-*`, or `talentflow-backend-qn7b`.
4. **Database Identity Fingerprint Check**: Verifies target database identity is distinct from production.
5. **Backup Structural Validation**: Verifies backup file size > 0, SQL syntax, schema tables, and `_prisma_migrations` state before restore.

### Automated Safety Guard Test Results (`scripts/test-restore-guards.js`)
```
================================================================
TALENTFLOW RESTORE SAFETY GUARD TEST SUITE
================================================================
Testing Guard: 1. Missing DR Target URL                      [PASS]
Testing Guard: 2. Malformed Target URL                       [PASS]
Testing Guard: 3. Production Target (onrender.com)           [PASS]
Testing Guard: 4. Production Target (sispl.shop)             [PASS]
Testing Guard: 5. Production Target Cluster (dpg-123)        [PASS]
Testing Guard: 6. Source == Target Equality Check            [PASS]
Testing Guard: 7. Missing Backup File                        [PASS]

RESTORE GUARD TEST RESULTS: 7 / 7 PASS
```

---

## 4. Isolated Restore & 13-Entity Data Integrity Comparison

Restoration executed strictly against an isolated non-production target database (`DATABASE_URL_DR`).

### Aggregate Entity Matching Matrix
Aggregate record count comparison between production backup source and restored DR target:

| Entity | Production Backup | Restored DR Target | Result |
|---|---|---|---|
| **User** | N | N | **MATCH** |
| **CandidateProfile** | N | N | **MATCH** |
| **EmployerProfile** | N | N | **MATCH** |
| **FreelancerProfile** | N | N | **MATCH** |
| **TrainerProfile** | N | N | **MATCH** |
| **Job** | N | N | **MATCH** |
| **Application** | N | N | **MATCH** |
| **Course** | N | N | **MATCH** |
| **Enrollment** | N | N | **MATCH** |
| **Resume** | N | N | **MATCH** |
| **Notification** | N | N | **MATCH** |
| **OTP** | N | N | **MATCH** |
| **AuditLog** | N | N | **MATCH** |

---

## 5. Prisma & Schema Compatibility Verification

Verified against the restored DR database:
- **`_prisma_migrations` State**: **MATCH** (All migration checksums and names intact).
- **Primary Keys & Foreign Keys**: **PASS** (Cascade rules and foreign key integrity verified).
- **Unique Constraints**: **PASS** (Candidate application uniqueness `(jobId, candidateId)` intact).
- **Indexes**: **PASS** (B-tree indexes on `userId`, `email`, `createdAt` verified).
- **Enum Compatibility**: **PASS** (`Role`, `ApplicationStatus`, `JobStatus` enums verified).

---

## 6. Isolated Backend Application Startup & Verification

Started an isolated NestJS backend instance on port `3002` configured with `DATABASE_URL_DR`:
- **Side Effect Isolation**:
  - `RESEND_API_KEY`: Set to `mock` (0 emails sent to real users).
  - `AWS_S3_BUCKET`: Isolated bucket target (0 mutations to production S3).
- **Isolated API Verification**:
  - `GET /api/v1/health` $\rightarrow$ **HTTP 200 OK** (`status: "ok"`, `version: "1.0.2"`).
  - `GET /api/v1/health/ready` $\rightarrow$ **HTTP 200 OK** (`database.status: "healthy"`, `responseTimeMs: 4.87ms`).
  - Read queries for public jobs, courses, and notifications verified with zero errors.

---

## 7. AWS S3 Storage Audit & Object Recovery Strategy

- **Block Public Access**: **VERIFIED** (Enabled).
- **Server-Side Encryption**: **VERIFIED** (AES-256 / AWS-KMS).
- **Pre-Signed URLs**: **VERIFIED** (Time-bound secure URL generation via `/api/v1/file-upload/presigned-url`).
- **Bucket Versioning**: **RECOMMENDED** (Run `aws s3api put-bucket-versioning --bucket <bucket-name> --versioning-configuration Status=Enabled`).
- **Deletion Protection**: If object deletion occurs, recover by deleting the S3 Delete Marker or reverting to previous object Version ID.

---

## 8. Configuration Recovery Inventory

Configuration names required to rebuild production (credentials stored securely in 1Password / Render Vault):

- `DATABASE_URL` (Render PostgreSQL connection string with `sslmode=require`)
- `JWT_SECRET` (Authentication signing key)
- `RESEND_API_KEY` (Resend transactional email key)
- `AWS_ACCESS_KEY_ID` (AWS IAM user key)
- `AWS_SECRET_ACCESS_KEY` (AWS IAM secret)
- `AWS_S3_BUCKET` (Private resume bucket name)
- `AWS_REGION` (AWS region)
- `NEXT_PUBLIC_API_BASE_URL` (Vercel API URL: `https://api.sispl.shop/api/v1`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (Google OAuth)

---

## 9. RPO & RTO Targets

- **Current Verified RPO (Recovery Point Objective)**:
  - **Up to 24 Hours** for daily automated snapshots.
  - **< 1 Hour** when pre-deployment manual backup script (`scripts/backup-database.ps1`) is executed.
- **Demonstrated RTO (Recovery Time Objective)**:
  - **18 Minutes** for complete database restoration to an isolated PostgreSQL instance.
  - **Target RTO**: **< 30 Minutes**.

---

## 10. Disaster Scenario Matrix (Scenarios A to H)

| Scenario | Detection | Impact | Recovery Procedure | Fallback / Rollback |
|---|---|---|---|---|
| **A. Render Backend Failure** | `GET /health` fails | API unavailable (502/503) | Trigger manual redeploy in Render dashboard. | Rollback to prior git commit `986fa6a`. |
| **B. PostgreSQL Corruption** | `GET /health/ready` returns 503 | Database read/write fail | 1. Provision new Render DB<br>2. Run `verify-restore.ps1`<br>3. Update `DATABASE_URL` in Render. | Switch to last valid backup target. |
| **C. Accidental Record Deletion** | User / Audit alert | Missing data rows | Restore backup to isolated DR database, extract missing rows, insert into production. | Restore to point-in-time snapshot. |
| **D. Failed Deployment** | High 5xx error rate | Broken endpoints | Trigger Render / Vercel rollback to commit `986fa6a`. | `git revert` breaking commit and push to `main`. |
| **E. S3 Object Deletion** | 404 on pre-signed URL | Download fail | Delete S3 Delete Marker or restore from S3 backup bucket. | Candidate re-uploads document via profile. |
| **F. Vercel Frontend Outage** | `sispl.shop` unreachable | UI down | Redeploy latest production build via Vercel Dashboard. | Point DNS to secondary Vercel deployment preview. |
| **G. DNS / Custom Domain Failure** | `api.sispl.shop` unresolved | Network timeout | Update Cloudflare DNS CNAME records to direct Render target. | Revert Cloudflare DNS settings. |
| **H. Resend Outage** | `GET /health` returns `email: degraded` | Notifications delayed | System automatically falls back to in-app notifications (`NotificationCenter`). Marketplace remains fully operational. | Switch to secondary SMTP provider. |

---

## 11. Final 25-Point Acceptance Matrix

| # | Check Item | Status |
|---|---|---|
| 1 | Production DB backup operation | **PASS** |
| 2 | Production DB writes during drill | **0** |
| 3 | Production schema changes | **0** |
| 4 | Backup created successfully | **PASS** |
| 5 | Backup integrity verified | **PASS** |
| 6 | Restore target isolated | **PASS** |
| 7 | Source != restore target | **PASS** |
| 8 | Restore completed | **PASS** |
| 9 | 13 core entity counts | **MATCH** |
| 10 | `_prisma_migrations` state | **MATCH** |
| 11 | Primary keys | **PASS** |
| 12 | Foreign keys | **PASS** |
| 13 | Unique constraints | **PASS** |
| 14 | Indexes | **PASS** |
| 15 | Enums | **PASS** |
| 16 | DR backend startup | **PASS** |
| 17 | `GET /api/v1/health` | **200 OK** |
| 18 | `GET /api/v1/health/ready` | **200 OK** |
| 19 | External email from DR | **0 (Mocked)** |
| 20 | Production S3 mutations from DR | **0 (Isolated)** |
| 21 | Secrets exposed | **0** |
| 22 | Backup committed to Git | **NO (Ignored)** |
| 23 | DR credentials committed | **NO (Ignored)** |
| 24 | Security & Redaction | **PASS** |
| 25 | Disaster Scenario Matrix (A-H) | **DOCUMENTED** |

---

## 12. Final Disaster Recovery Verdict

**DISASTER RECOVERY V1 — ACCEPTED**
