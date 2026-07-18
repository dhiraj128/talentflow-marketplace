const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { S3Client, HeadObjectCommand } = require('@aws-sdk/client-s3');

async function main() {
  const prisma = new PrismaClient();
  const bucket = process.env.AWS_S3_BUCKET || 'talentflow-private-resumes-dk2026';

  console.log(`Verifying Backend & AWS for latest uploaded resume...`);

  // PostgreSQL Verification
  const resume = await prisma.resume.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!resume) {
    console.error('❌ Resume not found in PostgreSQL');
    process.exit(1);
  }
  
  console.log(`✅ Resume found in PostgreSQL (ID: ${resume.id}, Candidate: ${resume.candidateId}, Key: ${resume.storageKey})`);
  const key = resume.storageKey;

  if (process.env.STORAGE_PROVIDER === 'local' || !process.env.STORAGE_PROVIDER) {
    const filePath = path.join(__dirname, 'uploads', key);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Resume found on Local Disk: ${filePath}`);
      process.exit(0);
    } else {
      console.error(`❌ Resume not found on Local Disk: ${filePath}`);
      process.exit(1);
    }
  }

  // AWS S3 Verification
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: (process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY_ID || '').trim(),
        secretAccessKey: (process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY || '').trim(),
      }
    });

    const headCommand = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3Client.send(headCommand);
    console.log(`✅ Resume found in AWS S3 Bucket: ${bucket}`);
  } catch (error) {
    console.error(`❌ Failed to find Resume in AWS S3: ${error.name || error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
