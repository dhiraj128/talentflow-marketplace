/**
 * TalentFlow Marketplace Safe S3 Object Recovery Tool
 * Safely recovers deleted or overwritten S3 object versions.
 * 
 * Safety Features:
 * - DRY RUN by default (must pass --execute to apply mutations)
 * - Requires explicit object key (no wildcards or bucket-wide deletions)
 * - Supports Delete Marker removal or specific VersionId restoration
 * - Never modifies object ACLs (remains strictly private)
 * 
 * Usage:
 *   Dry-run mode: node scripts/s3-recover-object.js --key "resumes/c-101/file.pdf" --delete-marker "dm_version_id"
 *   Execute mode: node scripts/s3-recover-object.js --key "resumes/c-101/file.pdf" --delete-marker "dm_version_id" --execute
 */

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../talentflow-backend/.env') });

let S3Client, DeleteObjectCommand, GetObjectCommand, CopyObjectCommand;
try {
  const awsSdk = require(path.resolve(__dirname, '../talentflow-backend/node_modules/@aws-sdk/client-s3'));
  S3Client = awsSdk.S3Client;
  DeleteObjectCommand = awsSdk.DeleteObjectCommand;
  GetObjectCommand = awsSdk.GetObjectCommand;
  CopyObjectCommand = awsSdk.CopyObjectCommand;
} catch (e) {
  console.error('AWS SDK module loading error:', e.message);
}

const args = process.argv.slice(2);
const isExecute = args.includes('--execute');

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
}

const key = getArg('--key');
const deleteMarkerId = getArg('--delete-marker');
const restoreVersionId = getArg('--restore-version');

console.log('================================================================');
console.log('TALENTFLOW SAFE S3 OBJECT RECOVERY TOOL');
console.log(`Execution Mode: ${isExecute ? 'EXECUTE (MUTATION ACTIVE)' : 'DRY RUN (READ ONLY)'}`);
console.log('================================================================');

if (!key) {
  console.log('\nError: Missing required parameter --key "<object-key>"');
  console.log('Examples:');
  console.log('  1. Remove Delete Marker (Delete Recovery):');
  console.log('     node scripts/s3-recover-object.js --key "resumes/c-1/file.pdf" --delete-marker "<marker-id>" --execute');
  console.log('  2. Restore Specific Version (Overwrite Recovery):');
  console.log('     node scripts/s3-recover-object.js --key "resumes/c-1/file.pdf" --restore-version "<version-id>" --execute');
  process.exit(0);
}

const region = process.env.AWS_REGION || 'ap-south-1';
const bucket = process.env.AWS_S3_BUCKET || 'talentflow-private-resumes-dk2026';
const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY_ID || '').trim();
const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY || '').trim();

if (!isExecute) {
  console.log(`\n[DRY RUN SUMMARY]`);
  console.log(`- Target Key:             "${key}"`);
  console.log(`- Delete Marker ID:       "${deleteMarkerId || 'None'}"`);
  console.log(`- Restore Version ID:     "${restoreVersionId || 'None'}"`);
  console.log(`- Target Bucket:          "${bucket}"`);
  console.log(`\nAction to be performed when executed:`);
  if (deleteMarkerId) {
    console.log(`  Will remove Delete Marker "${deleteMarkerId}" to restore object to active status.`);
  } else if (restoreVersionId) {
    console.log(`  Will copy Version ID "${restoreVersionId}" to head of key "${key}" to restore state.`);
  } else {
    console.log(`  No recovery mode specified (--delete-marker or --restore-version).`);
  }
  console.log(`\nTo execute real recovery, append --execute to the command line.`);
  process.exit(0);
}

async function recover() {
  if (!accessKeyId || !secretAccessKey) {
    console.error('Error: AWS credentials missing in environment.');
    process.exit(1);
  }

  const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });

  if (deleteMarkerId) {
    console.log(`Removing Delete Marker "${deleteMarkerId}" for key "${key}"...`);
    await s3.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
      VersionId: deleteMarkerId,
    }));
    console.log('[SUCCESS] Delete Marker removed. Object restored to active head state.');
  } else if (restoreVersionId) {
    console.log(`Restoring Version ID "${restoreVersionId}" to active head of key "${key}"...`);
    await s3.send(new CopyObjectCommand({
      Bucket: bucket,
      CopySource: encodeURIComponent(`${bucket}/${key}?versionId=${restoreVersionId}`),
      Key: key,
    }));
    console.log('[SUCCESS] Object restored from Version ID to active head state.');
  } else {
    console.log('Error: Must specify either --delete-marker or --restore-version for recovery.');
  }
}

recover().catch((err) => {
  console.error('Recovery Error:', err.message);
  process.exit(1);
});
