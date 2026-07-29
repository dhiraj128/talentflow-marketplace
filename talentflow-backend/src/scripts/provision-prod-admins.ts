import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function provisionAdmins() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://talentflow_user:m7UeBCX7ps4q7UoyHcwkYXJPl2PytKBY@dpg-d9btq1b7uimc73c6g4eg-a.virginia-postgres.render.com/talentflow_751x?ssl=true'
      }
    }
  });

  const devEmail = 'demo@admin.com';
  const clientEmail = 'shreekant@shieldinfrasolutions.in';

  // Read passwords from process args or environment (never committed)
  const devPassword = process.env.DEV_ADMIN_PASS || process.argv[2];
  const clientPassword = process.env.CLIENT_ADMIN_PASS || process.argv[3];

  if (!devPassword || !clientPassword) {
    console.error('ERROR: Both developer and client admin passwords must be supplied.');
    process.exit(1);
  }

  try {
    console.log('--- PROVISIONING CANONICAL PRODUCTION ADMIN ACCOUNTS ---');

    // 1. Provision Developer Admin (Dhiraj Kumar)
    const devHash = await bcrypt.hash(devPassword, 10);
    const existingDev = await prisma.user.findUnique({ where: { email: devEmail } });

    let devUser;
    if (existingDev) {
      devUser = await prisma.user.update({
        where: { id: existingDev.id },
        data: {
          role: Role.ADMIN,
          passwordHash: devHash,
          isEmailVerified: true,
          status: 'ACTIVE',
        }
      });
      console.log(`[Developer Admin] Updated user "${devUser.email}" (ID: ${devUser.id}, Role: ${devUser.role}).`);
    } else {
      devUser = await prisma.user.create({
        data: {
          email: devEmail,
          passwordHash: devHash,
          role: Role.ADMIN,
          isEmailVerified: true,
          status: 'ACTIVE',
        }
      });
      console.log(`[Developer Admin] Created user "${devUser.email}" (ID: ${devUser.id}, Role: ${devUser.role}).`);
    }

    // 2. Reconcile & Provision Client Admin (Shreekant Sharma)
    const legacyAliases = ['shreekant.sharma@sispl.shop', 'client.admin@sispl.shop'];
    for (const alias of legacyAliases) {
      const aliasUser = await prisma.user.findUnique({ where: { email: alias } });
      if (aliasUser) {
        console.log(`[Client Admin Cleanup] Deleting legacy alias "${alias}" (ID: ${aliasUser.id})...`);
        await prisma.user.delete({ where: { id: aliasUser.id } });
      }
    }

    const clientHash = await bcrypt.hash(clientPassword, 10);
    const existingClient = await prisma.user.findUnique({ where: { email: clientEmail } });

    let clientUser;
    if (existingClient) {
      clientUser = await prisma.user.update({
        where: { id: existingClient.id },
        data: {
          role: Role.ADMIN,
          passwordHash: clientHash,
          isEmailVerified: true,
          status: 'ACTIVE',
        }
      });
      console.log(`[Client Admin] Updated user "${clientUser.email}" (ID: ${clientUser.id}, Role: ${clientUser.role}).`);
    } else {
      clientUser = await prisma.user.create({
        data: {
          email: clientEmail,
          passwordHash: clientHash,
          role: Role.ADMIN,
          isEmailVerified: true,
          status: 'ACTIVE',
        }
      });
      console.log(`[Client Admin] Created user "${clientUser.email}" (ID: ${clientUser.id}, Role: ${clientUser.role}).`);
    }

    // 3. Final Verification of Admin Table Count & Uniqueness
    const allAdmins = await prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true, email: true, role: true, status: true }
    });

    console.log('--- FINAL PRODUCTION ADMIN USERS IN POSTGRESQL ---');
    console.log(JSON.stringify(allAdmins, null, 2));

  } catch (err: any) {
    console.error('PROVISIONING ERROR:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

provisionAdmins();
