import { PrismaClient } from '@prisma/client';

async function checkAdmins() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://talentflow_user:m7UeBCX7ps4q7UoyHcwkYXJPl2PytKBY@dpg-d9btq1b7uimc73c6g4eg-a.virginia-postgres.render.com/talentflow_751x?ssl=true'
      }
    }
  });

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
  } catch (err: any) {
    console.error('Error querying database:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmins();
