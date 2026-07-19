const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function seedE2E() {
  const passwordHash = await bcrypt.hash('password', 10);
  
  // 1. Candidate
  const candidate = await prisma.user.upsert({
    where: { email: 'candidate@e2e.com' },
    update: { passwordHash: passwordHash },
    create: {
      email: 'candidate@e2e.com',
      passwordHash: passwordHash,
      role: 'CANDIDATE'
    }
  });
  
  if (!candidate.candidateProfile) {
    await prisma.candidateProfile.upsert({
      where: { userId: candidate.id },
      update: {},
      create: {
        userId: candidate.id,
        fullName: 'E2E Candidate',
        title: 'Software Engineer',
        location: 'New York'
      }
    });
  }

  // 2. Employer A
  const empA = await prisma.user.upsert({
    where: { email: 'employera@e2e.com' },
    update: { passwordHash: passwordHash },
    create: {
      email: 'employera@e2e.com',
      passwordHash: passwordHash,
      role: 'EMPLOYER'
    }
  });

  if (!empA.employerProfile) {
    await prisma.employerProfile.upsert({
      where: { userId: empA.id },
      update: {},
      create: {
        userId: empA.id,
        companyName: 'Tech Corp A',
        industry: 'Technology',
        location: 'San Francisco'
      }
    });
  }

  // 3. Employer B
  const empB = await prisma.user.upsert({
    where: { email: 'employerb@e2e.com' },
    update: { passwordHash: passwordHash },
    create: {
      email: 'employerb@e2e.com',
      passwordHash: passwordHash,
      role: 'EMPLOYER'
    }
  });

  if (!empB.employerProfile) {
    await prisma.employerProfile.upsert({
      where: { userId: empB.id },
      update: {},
      create: {
        userId: empB.id,
        companyName: 'Tech Corp B',
        industry: 'Finance',
        location: 'London'
      }
    });
  }
  
  console.log('E2E users seeded successfully.');
}

seedE2E().catch(console.error).finally(() => prisma.$disconnect());
