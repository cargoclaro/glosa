import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env['CI']),
  use: {
    baseURL: process.env['NEXT_PUBLIC_VERCEL_URL']
      ? `https://${process.env['NEXT_PUBLIC_VERCEL_URL']}`
      : 'http://localhost:3000',
    bypassCSP: true,
  },
  projects: [
    {
      name: 'setup auth',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.clerk/user.json',
      },
      dependencies: ['setup auth'],
    },
  ],
});
