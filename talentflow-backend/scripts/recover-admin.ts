import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@admin.com';
  const plainTextPassword = 'password123';

  console.log(`[Admin Recovery] Initiating recovery for ${email}...`);

  try {
    const passwordHash = await bcrypt.hash(plainTextPassword, 10);

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: Role.ADMIN,
        isEmailVerified: true,
      },
      create: {
        email,
        passwordHash,
        role: Role.ADMIN,
        isEmailVerified: true,
      },
    });

    console.log('[Admin Recovery] SUCCESS');
    console.log(`- User ID: ${admin.id}`);
    console.log(`- Email: ${admin.email}`);
    console.log(`- Role: ${admin.role}`);
    console.log(`- Verified: ${admin.isEmailVerified}`);
  } catch (error) {
    console.error('[Admin Recovery] ERROR: Failed to recover admin account.');
    console.error(error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
