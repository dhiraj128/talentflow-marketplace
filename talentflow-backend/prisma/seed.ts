import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Clean DB
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.application.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.candidateSkill.deleteMany();
  await prisma.jobSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.course.deleteMany();
  await prisma.job.deleteMany();
  await prisma.billing.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.employerProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'demo@admin.com',
      passwordHash,
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });

  const employer = await prisma.user.create({
    data: {
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

  const candidate = await prisma.user.create({
    data: {
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

  const freelancer = await prisma.user.create({
    data: {
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

  const trainer = await prisma.user.create({
    data: {
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

  // Create Skills
  const reactSkill = await prisma.skill.create({ data: { name: 'React', category: 'Frontend' } });
  const nodeSkill = await prisma.skill.create({ data: { name: 'Node.js', category: 'Backend' } });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
