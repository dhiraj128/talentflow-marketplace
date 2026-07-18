const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedApp() {
  const email = process.env.E2E_CANDIDATE_EMAIL;
  if (!email) return;

  const candidateUser = await prisma.user.findUnique({ where: { email } });
  if (!candidateUser) return;

  const candidateProfile = await prisma.candidateProfile.findUnique({ where: { userId: candidateUser.id } });
  if (!candidateProfile) return;
  
  const empAEmail = process.env.E2E_EMPLOYER_A_EMAIL;
  const empAUser = await prisma.user.findUnique({ where: { email: empAEmail } });
  const empAProfile = await prisma.employerProfile.findUnique({ where: { userId: empAUser.id } });
  
  const job = await prisma.job.findUnique({ where: { id: 'test-job-id' } });

  // First ensure there is at least one resume for the candidate
  let resume = await prisma.resume.findFirst({ where: { candidateId: candidateProfile.id } });
  if (!resume) {
    resume = await prisma.resume.create({
      data: {
        candidateId: candidateProfile.id,
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
  }

  // Create application if it doesn't exist
  const existing = await prisma.application.findFirst({
    where: { jobId: 'test-job-id', candidateId: candidateProfile.id }
  });

  if (!existing) {
    await prisma.application.create({
      data: {
        jobId: 'test-job-id',
        candidateId: candidateProfile.id,
        resumeId: resume.id,
        status: 'PENDING',
        employerId: empAProfile.id
      }
    });
    console.log('Successfully created test application for employer-resume-access test.');
  }
}

seedApp().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
