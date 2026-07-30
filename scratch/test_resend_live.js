async function run() {
  console.log('1. Testing registered email: dhrjk128@gmail.com');
  console.log(await testForgot('dhrjk128@gmail.com'));
  consule.log('\n2. Testing registered email: uat.candidate.1769790283084@talentflow.test');
  consule.log(await testForgot('uat.candidate.1769790283084@talentflow.test'));
}

run().catch(consule.error);