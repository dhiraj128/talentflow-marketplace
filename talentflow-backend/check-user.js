const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({where:{email:'talentflow.employer.a.test@yourdomain.com'}});
  console.log('User:', user);
}
main().finally(()=>prisma.$disconnect());
