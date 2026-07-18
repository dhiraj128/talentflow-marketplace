import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.E2E_FRONTEND_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers and specific viewports */
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'Mobile Chrome (320x568)',
      use: { ...devices['Pixel 5'], viewport: { width: 320, height: 568 } },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Chrome (360x800)',
      use: { ...devices['Pixel 5'], viewport: { width: 360, height: 800 } },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari (375x812)',
      use: { ...devices['iPhone 12'], viewport: { width: 375, height: 812 } },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari (390x844)',
      use: { ...devices['iPhone 12 Pro'], viewport: { width: 390, height: 844 } },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari (414x896)',
      use: { ...devices['iPhone 11 Pro Max'], viewport: { width: 414, height: 896 } },
      dependencies: ['setup'],
    },
    {
      name: 'Tablet Chrome (480x900)',
      use: { ...devices['Pixel 5'], viewport: { width: 480, height: 900 } },
      dependencies: ['setup'],
    },
    {
      name: 'Tablet Safari (768x1024)',
      use: { ...devices['iPad Mini'], viewport: { width: 768, height: 1024 } },
      dependencies: ['setup'],
    },
    {
      name: 'Tablet Landscape (1024x768)',
      use: { ...devices['iPad Mini landscape'], viewport: { width: 1024, height: 768 } },
      dependencies: ['setup'],
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
