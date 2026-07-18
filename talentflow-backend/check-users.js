const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all([
    'talentflow.candidate.test@yourdomain.com',
    'talentflow.employer.a.test@yourdomain.com',
    'talentflow.employer.b.test@yourdomain.com'
  ].map(e => prisma.user.findUnique({where:{email:e}, select:{email:true, role:true}})));
  console.log('Users:', users);
}
main().finally(()=>prisma.$disconnect());
