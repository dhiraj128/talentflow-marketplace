const { execSync } = require('child_process');
try {
  console.log('Attempting to resolve failed Prisma migration...');
  execSync('npx prisma migrate resolve --rolled-back 20260718211239_course_trainer_updates', { stdio: 'inherit' });
  console.log('Migration successfully marked as rolled-back.');
} catch (error) {
  console.log('Resolve command failed or was already resolved, continuing safely...');
}
