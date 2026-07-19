
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const user = await prisma.user.findFirst({ where: { role: 'CANDIDATE' }, include: { candidateProfile: true } });
  if (user) {
    console.log('Candidate found:', user.id);
    const docs = await prisma.identityVerificationDocument.findMany({ where: { userId: user.id } });
    console.log('User documents:', docs.length);
  } else {
    console.log('No candidate found');
  }
}
run();
