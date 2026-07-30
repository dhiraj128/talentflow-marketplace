# TALENTFLOW PRODUCTION POST-DEPLOYMENT CHECKLIST

**Execution Trigger**: After every production code push to `main` branch or release deployment.  

---

## Post-Deployment Verification Sequence

1. **Deployment Health Check**:
   - [ ] Verify Vercel deployment status is Green.
   - [ ] Verify Render backend deployment status is Green.
   - [ ] Request `GET https://api.sispl.shop/api/v1/health` $\rightarrow$ Confirm HTTP 200 OK.
   - [ ] Request `GET https://api.sispl.shop/api/v1/health/ready` $\rightarrow$ Confirm HTTP 200 OK (`database.status: "healthy"`).
2. **Core Workflow Verification**:
   - [ ] Verify user sign-in & JWT authentication flow.
   - [ ] Verify job search and public discovery routes (`/find-jobs`, `/find-courses`).
   - [ ] Verify candidate resume pre-signed URL download.
   - [ ] Verify Notification Center unread count polling.
3. **Log & Error Monitoring**:
   - [ ] Monitor Render container logs for 15 minutes post-deploy for unexpected 5xx errors or crash loops.
   - [ ] Confirm `X-Request-ID` is present in HTTP response headers.
