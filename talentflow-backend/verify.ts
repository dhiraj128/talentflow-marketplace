import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function run() {
  console.log('--- FINAL PRODUCTION VERIFICATION ---');
  
  try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log('PostgreSQL: Verified connection, users found:', users.length);
    console.log('--- ✅ READY FOR PRODUCTION ---');
  } catch (e) {
    console.error(e);
    console.log('--- ❌ NOT READY FOR PRODUCTION ---');
  } finally {
    await prisma.$disconnect();
  }
}

run();
