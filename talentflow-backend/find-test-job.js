const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'talentflow.employer.a.test@yourdomain.com' },
    include: { employerProfile: true }
  });

  if (!user || !user.employerProfile) {
    console.log('NO_EMPLOYER_PROFILE');
    return;
  }

  const job = await prisma.job.findFirst({
    where: { employerId: user.employerProfile.id },
    orderBy: { createdAt: 'desc' }
  });

  if (job) {
    console.log(`FOUND_JOB: ${job.id}`);
  } else {
    console.log('NO_JOB_FOUND');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
