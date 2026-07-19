import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables for local execution if needed
dotenv.config();
dotenv.config({ path: '.env.production' }); // Prefer production env if available

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  
  const password = 'Talent@123';
  const saltOrRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltOrRounds);

  const demoAccounts = [
    { email: 'candidate@demo.com', role: Role.CANDIDATE },
    { email: 'employer@demo.com', role: Role.EMPLOYER },
    { email: 'freelancer@demo.com', role: Role.FREELANCER },
    { email: 'trainer@demo.com', role: Role.TRAINER },
  ];

  for (const account of demoAccounts) {
    console.log(`Processing demo account: ${account.email} (${account.role})...`);
    
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        passwordHash,
        role: account.role,
        isEmailVerified: true,
      },
      create: {
        email: account.email,
        passwordHash,
        role: account.role,
        isEmailVerified: true,
        status: 'ACTIVE',
      },
    });

    console.log(`✅ Verified account: ${user.email} (ID: ${user.id}, Role: ${user.role})`);
  }

  console.log('All demo accounts created/updated successfully.');
}

main()
  .catch((e) => {
    console.error('Error creating demo accounts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
