const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCount() {
  const email = process.env.E2E_CANDIDATE_EMAIL;
  if (!email) return 0;
  const candidateUser = await prisma.user.findUnique({ where: { email } });
  const candidateProfile = await prisma.candidateProfile.findUnique({ where: { userId: candidateUser.id } });
  
  const count = await prisma.resume.count({
    where: {
      candidateId: candidateProfile.id
    }
  });
  console.log(count);
}

checkCount()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
