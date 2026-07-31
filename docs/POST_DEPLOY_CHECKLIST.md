# Post-Deployment Verification Checklist — V1.3.0 Release

Following any production deployment of `v1.3.0`, execute this checklist to verify operational health:

- [x] **API Liveness**: `GET /api/v1/health` returns `200 OK`.
- [x] **API Readiness**: `GET /api/v1/health/ready` returns `200 OK` with database `SELECT 1` passing.
- [x] **Frontend Home**: `https://sispl.shop` loads cleanly with 0 console errors.
- [x] **Candidate Interviews Portal**: `/job-seeker/interviews` loads candidate interview schedule and meeting links.
- [x] **Candidate Offers Portal**: `/job-seeker/offers` loads active, accepted, declined, and expired offers.
- [x] **Employer Interviews Center**: `/employer/interviews` displays interview schedule, filter controls, and feedback modal.
- [x] **Employer Hiring Pipeline**: `/employer/pipeline` displays pipeline cards with Schedule Interview & Create Offer triggers.
- [x] **Zero Mock Compliance**: `node scripts/audit-production-mocks.js` passes with 0 violations.
- [x] **Candidate Privacy Guard**: Verify candidate API responses strip all employer evaluation notes and rating data.
- [x] **Audit Logging**: Confirm `OFFER_SENT`, `OFFER_ACCEPTED`, `INTERVIEW_SCHEDULED` events are written to `AuditLog` table.
