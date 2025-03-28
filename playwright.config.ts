import { defineConfig, devices } from '@playwright/test';
import ms from 'ms';

export default defineConfig({
  fullyParallel: false,
  timeout: ms('5m'),
  testMatch: '**/*.test.ts',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env['CI']),
  use: {
    baseURL: 'http://localhost:3000',
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
