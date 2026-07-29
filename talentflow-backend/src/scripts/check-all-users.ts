import { PrismaClient } from '@prisma/client';

async function checkAll() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://talentflow_user:m7UeBCX7ps4q7UoyHcwkYXJPl2PytKBY@dpg-d9btq1b7uimc73c6g4eg-a.virginia-postgres.render.com/talentflow_751x?ssl=true'
      }
    }
  });

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        isEmailVerified: true
      }
    });

    console.log('--- ALL USERS IN PRODUCTION DATABASE ---');
    console.log(JSON.stringify(users, null, 2));
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAll();
