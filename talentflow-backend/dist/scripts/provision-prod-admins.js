"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
async function provisionAdmins() {
    const prisma = new client_1.PrismaClient({
        datasources: {
            db: {
                url: 'postgresql://talentflow_user:m7UeBCX7ps4q7UoyHcwkYXJPl2PytKBY@dpg-d9btq1b7uimc73c6g4eg-a.virginia-postgres.render.com/talentflow_751x?ssl=true'
            }
        }
    });
    const devEmail = 'demo@admin.com';
    const clientEmail = 'shreekant@shieldinfrasolutions.in';
    const devPassword = process.env.DEV_ADMIN_PASS || process.argv[2];
    const clientPassword = process.env.CLIENT_ADMIN_PASS || process.argv[3];
    if (!devPassword || !clientPassword) {
        console.error('ERROR: Both developer and client admin passwords must be supplied.');
        process.exit(1);
    }
    try {
        console.log('--- PROVISIONING CANONICAL PRODUCTION ADMIN ACCOUNTS ---');
        const devHash = await bcrypt.hash(devPassword, 10);
        const existingDev = await prisma.user.findUnique({ where: { email: devEmail } });
        let devUser;
        if (existingDev) {
            devUser = await prisma.user.update({
                where: { id: existingDev.id },
                data: {
                    role: client_1.Role.ADMIN,
                    passwordHash: devHash,
                    isEmailVerified: true,
                    status: 'ACTIVE',
                }
            });
            console.log(`[Developer Admin] Updated user "${devUser.email}" (ID: ${devUser.id}, Role: ${devUser.role}).`);
        }
        else {
            devUser = await prisma.user.create({
                data: {
                    email: devEmail,
                    passwordHash: devHash,
                    role: client_1.Role.ADMIN,
                    isEmailVerified: true,
                    status: 'ACTIVE',
                }
            });
            console.log(`[Developer Admin] Created user "${devUser.email}" (ID: ${devUser.id}, Role: ${devUser.role}).`);
        }
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
                    role: client_1.Role.ADMIN,
                    passwordHash: clientHash,
                    isEmailVerified: true,
                    status: 'ACTIVE',
                }
            });
            console.log(`[Client Admin] Updated user "${clientUser.email}" (ID: ${clientUser.id}, Role: ${clientUser.role}).`);
        }
        else {
            clientUser = await prisma.user.create({
                data: {
                    email: clientEmail,
                    passwordHash: clientHash,
                    role: client_1.Role.ADMIN,
                    isEmailVerified: true,
                    status: 'ACTIVE',
                }
            });
            console.log(`[Client Admin] Created user "${clientUser.email}" (ID: ${clientUser.id}, Role: ${clientUser.role}).`);
        }
        const allAdmins = await prisma.user.findMany({
            where: { role: client_1.Role.ADMIN },
            select: { id: true, email: true, role: true, status: true }
        });
        console.log('--- FINAL PRODUCTION ADMIN USERS IN POSTGRESQL ---');
        console.log(JSON.stringify(allAdmins, null, 2));
    }
    catch (err) {
        console.error('PROVISIONING ERROR:', err.message);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
provisionAdmins();
//# sourceMappingURL=provision-prod-admins.js.map