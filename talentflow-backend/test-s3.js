const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

async function run() {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'eu-north-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy'
    }
  });

  const command = new PutObjectCommand({
    Bucket: 'talentflow-private-resumes-dk2026',
    Key: 'test/resume.pdf',
    Body: Buffer.from('hello world'),
    ContentType: 'application/pdf',
  });

  try {
    console.log('Sending command...');
    await s3Client.send(command);
    console.log('Success!');
  } catch (error) {
    console.error('Error:', error);
  }
}
run();
