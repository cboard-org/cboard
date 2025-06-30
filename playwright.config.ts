import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Cboard E2E Tests
 * 
 * Configuration optimized for fastest execution:
 * - Maximum parallel execution with optimal worker count
 * - Headless mode for faster execution
 * - Essential browser coverage only (Chrome + Firefox)
 * - Minimal media capture for speed
 * - Optimized timeouts
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
const config = defineConfig({
  /* Balanced timeout settings */
  expect: {
    timeout: 10 * 1000,
  },
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Maximum parallel execution */
  fullyParallel: true,
  
  /* Essential browser coverage for fastest execution */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
      },
    },
    /* Single mobile project for mobile coverage */
    {
      name: 'mobile',
      use: { 
        ...devices['Pixel 5'],
      },
    },
  ],
  
  /* Minimal reporter for speed */
  reporter: [['junit', { outputFile: 'test-results/results.xml' }], ['html', { open: 'never' }], ['list']],
  
  /* No retries for faster execution - let failures fail fast */
  retries: 0,
  
  testDir: './tests',
  
  /* Balanced timeout settings */
  timeout: 60 * 1000, // Increased test timeout for slower browsers,
  
  use: {
    /* Balanced timeout settings for reliability vs speed */
    actionTimeout: 15 * 1000,

    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://app.qa.cboard.io',
    
    /* Longer navigation timeout for slow environments */
    navigationTimeout: 60 * 1000,

    /* No traces, videos, or screenshots for maximum speed */
    screenshot: 'off',
    trace: 'off',
    video: 'off',
  },
  
  /* Optimal worker count for cross-browser stability */
  workers: process.env.CI ? 5 : 5, // Reduced for stability

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

export default config;
