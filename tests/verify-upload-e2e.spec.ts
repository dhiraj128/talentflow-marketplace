import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../.auth/candidate.json') });

test.skip('Full End-to-End Upload Pipeline Verification', async ({ page, request }) => {
  console.log('--- STARTING VERIFICATION ---');

  // Go to My Resume page
  await page.goto('/job-seeker/resume-center/my-resume');
  await page.waitForLoadState('networkidle');

  // Create a unique file name to track it easily
  const uniqueName = `test-resume-${Date.now()}.pdf`;
  const fs = require('fs');
  const filePath = path.join(__dirname, 'fixtures', uniqueName);
  
  // Copy valid-resume to unique name
  fs.copyFileSync(path.join(__dirname, 'fixtures', 'valid-resume.pdf'), filePath);

  // Monitor network request
  const uploadRequestPromise = page.waitForRequest(
    request => request.url().includes('/api/v1/file-upload/resume') && request.method() === 'POST'
  );
  
  const uploadResponsePromise = page.waitForResponse(
    response => response.url().includes('/api/v1/file-upload/resume') && response.request().method() === 'POST'
  );

  console.log('Triggering file upload in UI...');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);

  // Await Network Request
  console.log('Waiting for network request...');
  const uploadRequest = await uploadRequestPromise;
  expect(uploadRequest.method()).toBe('POST');
  expect(uploadRequest.headers()['authorization']).toContain('Bearer ');
  console.log('✅ Browser successfully sent POST request with Authorization header');

  // Await Network Response
  console.log('Waiting for network response...');
  const uploadResponse = await uploadResponsePromise;
  const responseStatus = uploadResponse.status();
  const responseBody = await uploadResponse.json();
  
  expect(responseStatus).toBe(201);
  expect(responseBody.success).toBe(true);
  console.log('✅ API returned success (201) with Resume entity:', responseBody.data?.id || responseBody.resumeId);

  // Verify UI
  console.log('Waiting for UI to update...');
  await expect(page.getByText('Upload complete')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(uniqueName).first()).toBeVisible();
  console.log('✅ Resume appeared in UI');

  // Save the key for backend verification
  fs.writeFileSync(path.join(__dirname, 'last_upload_key.txt'), responseBody.key);

  // Verify UI after reload
  console.log('Reloading page to verify persistence...');
  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.getByText(uniqueName).first()).toBeVisible();
  console.log('✅ Resume remains visible in UI after page reload (No mock data)');

  // Clean up fixture
  fs.unlinkSync(filePath);
  
  console.log('--- UI VERIFICATION COMPLETE ---');
});
