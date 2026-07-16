import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Admin
  await prisma.user.upsert({
    where: { email: 'demo@admin.com' },
    update: {
      passwordHash,
      role: Role.ADMIN,
      isEmailVerified: true,
    },
    create: {
      email: 'demo@admin.com',
      passwordHash,
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });

  // 2. Employer
  await prisma.user.upsert({
    where: { email: 'demo@employer.com' },
    update: {
      passwordHash,
      role: Role.EMPLOYER,
      isEmailVerified: true,
    },
    create: {
      email: 'demo@employer.com',
      passwordHash,
      role: Role.EMPLOYER,
      isEmailVerified: true,
      employerProfile: {
        create: {
          companyName: 'Acme Corp',
          industry: 'Technology',
          subscription: 'PRO',
        },
      },
    },
  });

  // 3. Candidate
  await prisma.user.upsert({
    where: { email: 'demo@candidate.com' },
    update: {
      passwordHash,
      role: Role.CANDIDATE,
      isEmailVerified: true,
    },
    create: {
      email: 'demo@candidate.com',
      passwordHash,
      role: Role.CANDIDATE,
      isEmailVerified: true,
      candidateProfile: {
        create: {
          fullName: 'Alice Developer',
          title: 'Senior Frontend Engineer',
          location: 'San Francisco, CA',
        },
      },
    },
  });

  // 4. Freelancer
  await prisma.user.upsert({
    where: { email: 'demo@freelancer.com' },
    update: {
      passwordHash,
      role: Role.FREELANCER,
      isEmailVerified: true,
    },
    create: {
      email: 'demo@freelancer.com',
      passwordHash,
      role: Role.FREELANCER,
      isEmailVerified: true,
      candidateProfile: {
        create: {
          fullName: 'Frank Freelance',
          title: 'UI/UX Designer',
          location: 'Remote',
        },
      },
    },
  });

  // 5. Trainer
  await prisma.user.upsert({
    where: { email: 'demo@trainer.com' },
    update: {
      passwordHash,
      role: Role.TRAINER,
      isEmailVerified: true,
    },
    create: {
      email: 'demo@trainer.com',
      passwordHash,
      role: Role.TRAINER,
      isEmailVerified: true,
      candidateProfile: {
        create: {
          fullName: 'Tina Trainer',
          title: 'Tech Lead & Mentor',
          location: 'New York, NY',
        },
      },
    },
  });

  // Upsert Skills
  await prisma.skill.upsert({
    where: { name: 'React' },
    update: { category: 'Frontend' },
    create: { name: 'React', category: 'Frontend' },
  });

  await prisma.skill.upsert({
    where: { name: 'Node.js' },
    update: { category: 'Backend' },
    create: { name: 'Node.js', category: 'Backend' },
  });

  console.log('Seeding complete! Upserted all demo users and skills.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
