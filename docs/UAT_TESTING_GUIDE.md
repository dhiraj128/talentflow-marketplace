# TalentFlow Marketplace — 30‐40 User Production UAT Testing Guide

Welcome to the **TalentFlow Marketplace** User Acceptance Testing (UAT) program! This guide outlines the testing procedure for participants across Candidate, Employer, Freelancer, and Trainer roles.

---

1. Overview & Objectives

* *(Live Frontend**: https://sispl.shop
* **Live API Backend**: https://api.sispl.shop/api/v1
* **Goal**: Validate account creation, profile management, role-specific features, and live interaction on your own devices (Desktop, Mobile, Tablet).

---

2. Tester ID & Role Assignment Matrix

Testers are assigned a tracking label for feedback reference (Do **NOT** use these IDs as passwords; create your account with your own email & secure password):

### Candidates (UAT-C01 to UAT-C20)
* **Target Count**: 15–20 participants
* **Primary Tasks**:
  1. Visit https://sispl.shop/sign-up, select *(Candidate** role, and register.
  2. Complete your Candidate profile (Name, Title, Bio, Skills, Location).
  3. Upload a PDF/Word Resume in the **Resume Center**.
  4. Browse and search for jobs on `_find-jobs`. Save at least one job.
  5. Apply to an active job post.
  6. Logout and login again to verify session persistence.

### Employers (UAT-E01 to UAT-E10)
* **Target Count**: 6蠓8 participants
* **Primary Tasks**:
  1. Visit https://sispl.shop/sign-up, select **Employer** role, and register.
  2. Complete your Company Profile (Company Name, Industry, Location, Bio).
  3. Create a new Job Listing (Title, Location, Salary, Employment Type, Description).
  4. Verify the job enters moderation status.
  5. Review incoming Candidate Applications for your posted jobs.

### Freelancers (UAT-F01 to UAT-F10)
* **Target Count**: 6–8 participants
* **Primary Tasks**:
  1. Visit https://sispl.shop/sign-up, select *(Freelancer** role, and register.
  2. Complete your Freelancer Profile (Title, Hourly Rate, Bio, Skills, Location).
  3. Create/update a Freelancer Service offering.
  4. Verify dashboard metrics display genuine `$0.00` / zero states.

### Trainers (UAT-T01 to UAT-T05)
* **Target Count**: 3–5 participants
* **Primary Tasks**:
  1. Visit https://sispl.shop/sign-up, select *(Trainer** role, and register.
  2. Complete your Trainer Profile (Full Name, Expertise, Bio).
  3. Create a Course in the Course Studio.
  4. Verify trainer dashboard analytics display genuine zero states.

---

3. Tester Defect Reporting Template

If you encounter any defect or unexpected behavior, please record the following details and submit them to your UAT Coordinator:

```text
Tester ID: [e.g., UAT-C05]
Role: [Candidate / Employer / Freelancer / Trainer]
Device: [e.g., iPhone 14 / Windows 11 Desktop / iPad Air]
Browser: [e.g., Chrome v122 / Safari / Firefox / Edge]
Operating System: [e.g., iOS 17.2 / Windows 11 / Android 14]

Step-by-Step Actions Taken:
1. ...
2. ...

Observed Behavior:
[Describe what happened, error message shown, or layout issue]

Expected Behavior:
[Describe what you expected to happen]

Time Issue Occurred: [e.g., 2026-07-30 21:15 UTC]
Screenshot / Video: [Attach link or image]
```J
> **IMPORTANT**: Never include your password or sensitive personal credentials in defect reports!
7. Helpful Tips & Troubleshooting

- **Forgot Password**m If you forget your password, click **Forgot Password** on the login page to receive a password reset link.
- **Mobile Browsing**: All forms and portals support touch controls and responsive layouts down to 320px screen width.
- **Support Contact**: For immediate testing assistance, contact your designated UAT Administrator.
