/**
 * TalentFlow Marketplace S3 Version Inspection Tool
 * Safely lists object versions and Delete Markers for a specified S3 object key.
 * Usage: node scripts/s3-list-versions.js --key "resumes/candidate-123/uuid.pdf"
 */

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../talentflow-backend/.env') });

let S3Client, ListObjectVersionsCommand;
try {
  const awsSdk = require(path.resolve(__dirname, '../talentflow-backend/node_modules/@aws-sdk/client-s3'));
  S3Client = awsSdk.S3Client;
  ListObjectVersionsCommand = awsSdk.ListObjectVersionsCommand;
} catch (e) {
  console.error('AWS SDK module loading error:', e.message);
}

const args = process.argv.slice(2);
const keyArgIndex = args.indexOf('--key');
const targetKey = keyArgIndex !== -1 ? args[keyArgIndex + 1] : null;

if (!targetKey) {
  console.log('================================================================');
  console.log('TALENTFLOW S3 LIST VERSIONS TOOL');
  console.log('Usage: node scripts/s3-list-versions.js --key "<object-key>"');
  console.log('Example: node scripts/s3-list-versions.js --key "resumes/c-101/resume.pdf"');
  console.log('================================================================');
  process.exit(0);
}

const region = process.env.AWS_REGION || 'ap-south-1';
const bucket = process.env.AWS_S3_BUCKET || 'talentflow-private-resumes-dk2026';
const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY_ID || '').trim();
const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY || '').trim();

if (!accessKeyId || !secretAccessKey) {
  console.log(`[DRY-RUN / READ-ONLY] S3 Version List requested for key: ${targetKey}`);
  console.log(`Target Bucket: ${bucket}`);
  console.log('No AWS credentials provided in current environment.');
  process.exit(0);
}

async function listVersions() {
  const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
  console.log(`Listing S3 Object Versions for Key: "${targetKey}" in Bucket: "${bucket}"...`);

  const res = await s3.send(new ListObjectVersionsCommand({
    Bucket: bucket,
    Prefix: targetKey,
  }));

  console.log('\n--- Object Versions ---');
  if (res.Versions && res.Versions.length > 0) {
    for (const v of res.Versions) {
      console.log(`VersionId: ${v.VersionId} | IsLatest: ${v.IsLatest} | LastModified: ${v.LastModified} | Size: ${v.Size} bytes`);
    }
  } else {
    console.log('No object versions found.');
  }

  console.log('\n--- Delete Markers ---');
  if (res.DeleteMarkers && res.DeleteMarkers.length > 0) {
    for (const dm of res.DeleteMarkers) {
      console.log(`DeleteMarker VersionId: ${dm.VersionId} | IsLatest: ${dm.IsLatest} | LastModified: ${dm.LastModified}`);
    }
  } else {
    console.log('No Delete Markers found.');
  }
}

listVersions().catch((err) => {
  console.error('List Versions Error:', err.message);
});
