# TALENTFLOW MARKETPLACE — WEEKLY SECURITY & QUALITY REVIEW (V1.4)

Perform the following weekly operational reviews:

- [ ] **Automated Regression Suite**: Run full Jest test suite (`npx jest`) and Next.js production build (`npm run build`).
- [ ] **Playwright Multi-Browser Audit**: Run `node scratch/playwright_v1_3_e2e.js` across Chromium, Firefox, WebKit and 8 viewports.
- [ ] **Security & OWASP Verification**: Re-run BOLA, IDOR, candidate feedback privacy, and draft offer privacy test suites (`src/common/security-audit.spec.ts`).
- [ ] **Database Index & Query Audit**: Review slow queries (`> 200ms`) in PostgreSQL performance metrics and verify Prisma indexes.
- [ ] **S3 Security & Access Control Review**: Confirm Block Public Access remains enabled and S3 bucket versioning is active.
- [ ] **DR Backup Restoration Drill**: Perform a dry-run restoration of a non-production DB snapshot to canary test environment.
