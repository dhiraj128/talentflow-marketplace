import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function seedAdditionalAdmin() {
  const prisma = new PrismaClient();

  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];

  if (!email || !password) {
    console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD environment variables (or CLI args) are required.');
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const passwordHash = await bcrypt.hash(password, 10);

    if (existingUser) {
      console.log(`User with email "${normalizedEmail}" already exists. Ensuring ADMIN role and updating credentials...`);
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: Role.ADMIN,
          passwordHash: passwordHash,
          isEmailVerified: true,
          status: 'ACTIVE',
        },
      });
      console.log(`SUCCESS: User "${updatedUser.email}" updated to Role ADMIN (ID: ${updatedUser.id}).`);
    } else {
      console.log(`Creating new additional ADMIN user with email "${normalizedEmail}"...`);
      const newUser = await prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash: passwordHash,
          role: Role.ADMIN,
          isEmailVerified: true,
          status: 'ACTIVE',
        },
      });
      console.log(`SUCCESS: Additional ADMIN user created cleanly with email "${newUser.email}" (ID: ${newUser.id}).`);
    }
  } catch (error: any) {
    console.error('FAILED to provision additional ADMIN:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdditionalAdmin();
