const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        role: true,
        isEmailVerified: true,
        status: true,
        createdAt: true,
      }
    });

    console.log('--- PRODUCTION ADMIN USERS ---');
    console.log(JSON.stringify(admins, null, 2));

    const allUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: 'dhiraj' } },
          { email: { contains: 'shreekant' } },
          { email: { contains: 'sispl' } },
          { email: { contains: 'admin' } }
        ]
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true
      }
    });
    console.log('--- MATCHING KEYWORD USERS ---');
    console.log(JSON.stringify(allUsers, null, 2));
  } catch (err) {
    console.error('Error querying database:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmins();
