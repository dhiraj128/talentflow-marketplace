const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql://talentflow_user:m7UeBCX7ps4q7UoyHcwkYXJPl2PytKBY@dpg-d9btq1b7uimc73c6g4eg-a.virginia-postgres.render.com/talentflow_751x' } } });
async function main() {
  const admin = await prisma.user.findUnique({ where: { email: 'demo@admin.com' } });
  if (admin) {
    console.log(JSON.stringify({ id: admin.id, email: admin.email, role: admin.role, status: admin.status, isEmailVerified: admin.isEmailVerified, passwordHashExists: !!admin.password }, null, 2));
  } else {
    console.log('User demo@admin.com not found');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
