const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all([
    'talentflow.candidate.test@yourdomain.com',
    'talentflow.employer.a.prodtest@yourdomain.com',
    'talentflow.employer.b.prodtest@yourdomain.com'
  ].map(e => prisma.user.findUnique({
    where:{email:e}, 
    include: { employerProfile: true, candidateProfile: true }
  })));
  
  users.forEach(u => {
    if (u) {
      console.log(`Email: ${u.email}`);
      console.log(`Role: ${u.role}`);
      console.log(`Has CandidateProfile: ${!!u.candidateProfile}`);
      console.log(`Has EmployerProfile: ${!!u.employerProfile}`);
      console.log('---');
    } else {
      console.log(`User not found.`);
    }
  });
}

main().finally(()=>prisma.$disconnect());
