import { PrismaClient, Role, SubscriptionTier, JobStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || !dbUrl.includes('localhost:5433') || !dbUrl.includes('talentflow_e2e')) {
    console.error('CRITICAL SAFETY ERROR: Refusing to seed non-E2E database.');
    console.error('Expected localhost:5433 and talentflow_e2e. Found:', dbUrl);
    process.exit(1);
  }

  console.log('Safe environment detected. Proceeding with E2E Seed...');

  const candEmail = process.env.E2E_CANDIDATE_EMAIL || 'candidate_e2e@talentflow.test';
  const candPass = process.env.E2E_CANDIDATE_PASSWORD || 'e2e_secure_cand_123';

  const empAEmail = process.env.E2E_EMPLOYER_A_EMAIL || 'employer_a_e2e@talentflow.test';
  const empAPass = process.env.E2E_EMPLOYER_A_PASSWORD || 'e2e_secure_empA_123';

  const empBEmail = process.env.E2E_EMPLOYER_B_EMAIL || 'employer_b_e2e@talentflow.test';
  const empBPass = process.env.E2E_EMPLOYER_B_PASSWORD || 'e2e_secure_empB_123';

  const hashPassword = async (pass: string) => bcrypt.hash(pass, 10);

  // Clean existing (idempotent, only targeting specific emails to be safe)
  await prisma.user.deleteMany({
    where: { email: { in: [candEmail, empAEmail, empBEmail] } }
  });

  // Create Candidate
  const candidateUser = await prisma.user.create({
    data: {
      email: candEmail,
      passwordHash: await hashPassword(candPass),
      role: Role.CANDIDATE,
      isEmailVerified: true,
      candidateProfile: {
        create: {
          fullName: 'Test Candidate',
          title: 'Software Engineer'
        }
      }
    },
    include: { candidateProfile: true }
  });

  // Create Employer A
  const empAUser = await prisma.user.create({
    data: {
      email: empAEmail,
      passwordHash: await hashPassword(empAPass),
      role: Role.EMPLOYER,
      isEmailVerified: true,
      employerProfile: {
        create: {
          companyName: 'Test Employer A',
          subscription: SubscriptionTier.PRO
        }
      }
    },
    include: { employerProfile: true }
  });

  // Create Employer B
  const empBUser = await prisma.user.create({
    data: {
      email: empBEmail,
      passwordHash: await hashPassword(empBPass),
      role: Role.EMPLOYER,
      isEmailVerified: true,
      employerProfile: {
        create: {
          companyName: 'Test Employer B',
          subscription: SubscriptionTier.FREE
        }
      }
    }
  });

  // Create Test Job 1 for Employer A (Used by Job Application flow)
  await prisma.job.create({
    data: {
      id: 'test-job-id', // Deterministic ID for tests
      employerId: empAUser.employerProfile!.id,
      title: 'Senior E2E Tester',
      description: 'Test job description',
      status: JobStatus.PUBLISHED,
      type: 'Full-time'
    }
  });

  // Create Test Job 2 for Employer A (Used by Employer Resume Access flow)
  await prisma.job.create({
    data: {
      id: 'test-job-id-2', // Deterministic ID for employer-resume-access test
      employerId: empAUser.employerProfile!.id,
      title: 'Lead E2E Engineer',
      description: 'Test job description 2',
      status: JobStatus.PUBLISHED,
      type: 'Full-time'
    }
  });

  // Seed a valid resume for Candidate (Required for applications)
  const resume = await prisma.resume.create({
    data: {
      candidateId: candidateUser.candidateProfile!.id,
      title: 'valid-resume.pdf',
      fileUrl: 'http://localhost/dummy.pdf',
      storageKey: 'dummy-key',
      bucket: 'dummy-bucket',
      fileName: 'valid-resume.pdf',
      mimeType: 'application/pdf',
      size: 1024,
      type: 'ORIGINAL',
      version: 1,
      isDefault: true
    }
  });

  // Seed Application for test-job-id-2 so Employer A can access it safely
  await prisma.application.create({
    data: {
      jobId: 'test-job-id-2',
      candidateId: candidateUser.candidateProfile!.id,
      resumeId: resume.id,
      status: 'PENDING'
    }
  });

  console.log('E2E Seed Completed Successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
