const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  const email = process.env.E2E_CANDIDATE_EMAIL;
  if (!email) {
    console.error('No E2E_CANDIDATE_EMAIL provided.');
    return;
  }
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || !dbUrl.includes('localhost:5433') || !dbUrl.includes('talentflow_e2e')) {
    console.error('Safety Check Failed: DATABASE_URL does not match isolated test conditions. Skipping cleanup.');
    return;
  }

  const candidateUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!candidateUser) return;

  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: { userId: candidateUser.id }
  });

  if (!candidateProfile) return;

  await prisma.application.deleteMany({
    where: {
      jobId: 'test-job-id',
      candidateId: candidateProfile.id
    }
  });
  console.log('Successfully cleaned up existing application.');
}

cleanup()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
