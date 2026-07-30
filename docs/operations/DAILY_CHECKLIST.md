# TALENTFLOW PRODUCTION DAILY OPERATIONAL CHECKLIST

**Execution Schedule**: Every business day at 09:00 AM UTC  
**Responsible Role**: On-Duty Operations / Site Reliability Engineer  

---

## Daily Verification Items

1. **Frontend Availability**:
   - [ ] Visit `https://sispl.shop` $\rightarrow$ Confirm HTTP 200 OK and clean landing page render.
2. **Backend API Availability**:
   - [ ] Request `GET https://api.sispl.shop/api/v1/health` $\rightarrow$ Confirm HTTP 200 OK (`status: "ok"`).
3. **Database Readiness**:
   - [ ] Request `GET https://api.sispl.shop/api/v1/health/ready` $\rightarrow$ Confirm HTTP 200 OK (`database.status: "healthy"`, response time `< 20ms`).
4. **Render Log Review**:
   - [ ] Check Render log explorer for HTTP `5xx` error spikes.
   - [ ] Check for `429 Too Many Requests` rate limiting spikes.
   - [ ] Confirm no container crash loops or unexpected restarts.
5. **Vercel Frontend Health**:
   - [ ] Check Vercel project dashboard for static page rendering errors or edge function failures.
6. **Resend Email Gateway**:
   - [ ] Check Resend dashboard for email delivery rates, bounce spikes, or API failures.
7. **AWS S3 Storage Health**:
   - [ ] Verify candidate resume pre-signed URL downloads operating normally.
8. **Automated Backup Status**:
   - [ ] Confirm daily Render automated PostgreSQL snapshot completed successfully.
9. **Incident Escalation**:
   - [ ] Log any P0/P1 incidents in the defect register and follow [PRODUCTION_RUNBOOK.md](file:///c:/Users/dhira_5fqr2uc/Downloads/stitch_talentflow_marketplace/talentflow-marketplace/docs/PRODUCTION_RUNBOOK.md).
