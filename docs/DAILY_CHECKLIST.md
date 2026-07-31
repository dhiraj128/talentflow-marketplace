# TALENTFLOW MARKETPLACE — DAILY OPERATIONAL CHECKLIST (V1.4)

Perform the following daily health & operational checks:

- [ ] **Liveness Health Check**: Execute `GET https://api.sispl.shop/api/v1/health` and verify status `ok`.
- [ ] **Readiness Health Check**: Execute `GET https://api.sispl.shop/api/v1/health/ready` and verify DB status `healthy` with `responseTimeMs < 100ms`.
- [ ] **Error Rate Audit**: Inspect Render logs for 5xx HTTP response counts. Target: `< 0.01%`.
- [ ] **Email Delivery Health**: Check Resend API dashboard for bounce and delivery failure rates. Target: `> 99.5% delivery`.
- [ ] **Zero Mock Guard Audit**: Run `node scripts/audit-production-mocks.js`. Target: `0 violations`.
- [ ] **Backup Verification**: Verify daily PostgreSQL snapshot completion timestamp.
