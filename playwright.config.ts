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
export default defineConfig({
  testDir: './tests',
  
  /* Maximum parallel execution */
  fullyParallel: true,
  
  /* Optimal worker count for parallel execution */
  workers: process.env.CI ? 2 : '75%',
    /* Fast timeout settings */
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* No retries for faster execution - let failures fail fast */
  retries: 0,
  
  /* Minimal reporter for speed */
  reporter: process.env.CI ? 'github' : 'line',  /* Optimized settings for fastest execution */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://app.qa.cboard.io',

    /* Faster action timeout */
    actionTimeout: 10 * 1000,
    
    /* Faster navigation timeout */
    navigationTimeout: 15 * 1000,

    /* No traces, videos, or screenshots for maximum speed */
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },  /* Essential browser coverage for fastest execution */
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

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
