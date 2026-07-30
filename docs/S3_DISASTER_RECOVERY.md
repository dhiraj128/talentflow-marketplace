# TALENTFLOW MARKETPLACE — AWS S3 DISASTER RECOVERY & OBJECT RECOVERY RUNBOOK (V1.1)

**Document Status**: Operational Guide  
**Target Bucket**: AWS S3 Private Resume Storage (`talentflow-private-resumes-dk2026`)  
**Security Level**: Private Storage (`Block Public Access: Enabled`, `AES256/KMS Encryption: Enabled`, `Pre-Signed Access: 15-Minute Expiration`)  

---

## 1. Storage Architecture Overview

Candidate resumes, verification documents, and profile avatars are uploaded to a private AWS S3 bucket.

```
Client (Browser) ──> NestJS FileUploadController ──> S3StorageService (AWS SDK v3) ──> Private AWS S3 Bucket
                           │
                           ▼
                  PostgreSQL Resume Table (storageKey, fileUrl, bucket, mimeType)
```

- **Object Key Structure**: `resumes/<candidateProfileId>/<uuid>.<ext>`
- **Pre-Signed Delivery**: Pre-signed URLs are generated dynamically with a 15-minute expiration period after verifying user authorization.

---

## 2. S3 Versioning & Delete Marker Mechanics

- **Versioning Concept**: When S3 Bucket Versioning is enabled, modifying or deleting an object key retains all previous revisions under unique `VersionId` strings.
- **Delete Marker**: Issuing a standard `s3:DeleteObject` command on a versioned bucket does **not** physically erase data. Instead, AWS S3 creates a 0-byte `Delete Marker` as the active head version.
- **Permanent Deletion**: A version is physically and permanently deleted **only** when a delete command includes a specific `VersionId` (`s3:DeleteObject(Key, VersionId)`).

---

## 3. Step-by-Step Disaster Recovery Workflows

### Scenario A: Accidental Object Overwrite Recovery
*Scenario: A user or automated script overwrites a candidate's resume object with invalid content.*

1. **List Object Versions**:
   ```bash
   node scripts/s3-list-versions.js --key "resumes/<candidateId>/<uuid>.pdf"
   ```
2. **Identify Target Version**: Find the prior valid `VersionId` from the version history log.
3. **Dry-Run Recovery Check**:
   ```bash
   node scripts/s3-recover-object.js --key "resumes/<candidateId>/<uuid>.pdf" --restore-version "<valid-version-id>"
   ```
4. **Execute Restoration**:
   ```bash
   node scripts/s3-recover-object.js --key "resumes/<candidateId>/<uuid>.pdf" --restore-version "<valid-version-id>" --execute
   ```

---

### Scenario B: Accidental Object Deletion Recovery
*Scenario: An object key is deleted, resulting in HTTP 404 access errors.*

1. **Inspect Delete Markers**:
   ```bash
   node scripts/s3-list-versions.js --key "resumes/<candidateId>/<uuid>.pdf"
   ```
2. **Identify Active Delete Marker ID**: Note the `VersionId` of the Delete Marker.
3. **Dry-Run Check**:
   ```bash
   node scripts/s3-recover-object.js --key "resumes/<candidateId>/<uuid>.pdf" --delete-marker "<delete-marker-version-id>"
   ```
4. **Execute Delete Marker Removal**:
   ```bash
   node scripts/s3-recover-object.js --key "resumes/<candidateId>/<uuid>.pdf" --delete-marker "<delete-marker-version-id>" --execute
   ```
5. **Verify Access**: Confirm pre-signed URL download returns HTTP 200 OK with expected content.

---

## 4. Operator IAM Least-Privilege Roles

| Role Category | IAM Permissions Required | Usage Scope |
|---|---|---|
| **Application Role** | `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` | Standard backend API upload/download operations. |
| **DR Operator Role** | `s3:ListBucketVersions`, `s3:GetObjectVersion`, `s3:DeleteObjectVersion` | Administrative disaster recovery & version inspection. |

---

## 5. Noncurrent Version Lifecycle & Cost Management

- **Proposed Retention Policy**: Retain noncurrent object versions for **30 days** after replacement/deletion.
- **Storage Lifecycle Rule**:
  - Days after noncurrent: 30 days $\rightarrow$ Transition noncurrent versions to S3 Standard-IA or expire expired Delete Markers.
- **Cost Impact**: Monthly storage cost increases proportionally to the total size of retained noncurrent revisions (`Current Size + Retained Noncurrent Revisions`).
