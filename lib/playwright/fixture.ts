import { test as base } from '@playwright/test';

/**
 * This is needed because Playwright doesn't automatically navigate to baseUrl,
 * even when it's configured - tests would otherwise start with a blank page.
 * (Super fun to debug!)
 * Also, this needs to be a fixture, not a global hook, (super fun to debug too!)
 */
export const test = base.extend({
  page: async ({ page, baseURL }, use) => {
    if (baseURL) {
      // I still can't figure out an elegant solution
      // to navigate and wait for the page to load.
      // Maybe an AI is needed?
      await page.goto(baseURL, { waitUntil: 'networkidle' });
    }
    await use(page);
  },
});

export { expect } from '@playwright/test';
