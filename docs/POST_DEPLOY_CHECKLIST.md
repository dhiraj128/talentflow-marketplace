# TALENTFLOW MARKETPLACE — POST-DEPLOYMENT VERIFICATION CHECKLIST (V1.4)

Execute after every production deployment:

- [ ] **Forward Migration Check**: Confirm database migration executed via `npx prisma migrate deploy`. Zero `prisma migrate reset`.
- [ ] **Health & Readiness Endpoints**:
  - `curl -i https://api.sispl.shop/api/v1/health` $\rightarrow$ `200 OK`
  - `curl -i https://api.sispl.shop/api/v1/health/ready` $\rightarrow$ `200 OK`
- [ ] **Zero Mock Guard**: Run `node scripts/audit-production-mocks.js` $\rightarrow$ `0 violations`.
- [ ] **Candidate & Employer Portal Smoke Test**: Log in with candidate and employer UAT accounts; verify application pipeline, interview scheduling, and offer workflows.
- [ ] **SEO Verification**: Check `https://sispl.shop/sitemap.xml` and `https://sispl.shop/robots.txt`. Confirm private portal routes (`/job-seeker/`, `/employer/`, `/admin/`) are disallowed.
- [ ] **Security Headers & CORS**: Confirm `X-Request-ID`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and strict CORS headers are present.
