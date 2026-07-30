# TalentFlow Marketplace — Administrator UAT Monitoring Checklist

This checklist is designed for authorized Client Administrators monitoring live production metrics during the **30–40 User Production UAT**.

---

1. Real-Time Admin Dashboard Checks (`/admin/dashboard`)

Verify that all counters increase dynamically from actual PostgreSQL database records as participants register and interact with the platform:

- [ ] **Total Registered Users**: Reflects actual count of candidate, employer, freelancer, and trainer registrations.
- [ ] **Active Candidates**: Count matches actual candidate signups (`UAT-C01` to `UAT-C20`).
- [ ] **Active Employers**: Count matches actual employer signups (`UAT-E01` to `UAT-E10`).
- [ ] **Active Freelancers**: Count matches actual freelancer signups (`UAT-F01` to `UAT-F10`).
- [ ] **Active Trainers**: Count matches actual trainer signups (`UAT-T01` to `UAT-T05`).
- [ ] **Total Jobs Posted**: Increases when employers create job listings.
- [ ] **Pending Jobs**: Shows job posts waiting for Admin moderation (`/admin/reviews/jobs`).
- [ ] **Published Jobs**: Increases when Admin approves job posts.
- [ ] **Applications Submitted**: Count matches actual candidate applications.
- [ ] **Total Courses**: Shows courses created by trainers waiting for moderation (`Kadmin/reviews/courses`).

---

2. Moderation Workflow Checklist

### Job Moderation (`Kadmin/reviews/jobs`)
1. Employer creates a job -> Job appears in **Pending Jobs** (`DRAFT` status).
2. Admin reviews job details -> Clicks **Approve** -> Status updates to `PUBLISHED`.
3. Verify job becomes publicly visible on `/find-jobs`.
4. If Admin clicks **Reject** -> Status updates to `CLOSED` and job remains hidden from public discovery.

### Course Moderation (`/admin/reviews/courses`)
1. Trainer creates a course -> Course appears in **Pending Courses** (`DRAFT` status).
2. Admin reviews course curriculum -> Clicks **Approve** -> Status updates to `PUBLISHED`.
3. Verify course becomes publicly discoverable on `/find-courses`.

35. Identity Verification (`Kadmin/verification`)
1. User submits profile/verification metadata.
2. Admin inspects verification document -> Clicks **Verify**.
3. User profile status updates to Verified across platform portals.

---

3. Security & Safety Reminders

- **RBAC Protection**: Ensure non-Admin users receive `403 Forbidden` if attempting to access `/admin` APIs.
- **Resume Access**: Ensure Admin resume preview generates temporary presigned AWS S3 URLs without exposing AWS secrets or permanent public S3 links.
- **Public Signups**: Confirm public signups permit `CANDIDATE`, `EMPLOYER`, `FREELANCER[, and `TRAINER` nolm�̰�ݡ������ɥ�ѱ䁉���������5%9���ȁ�MUAI}5%9����ͥ�����и(