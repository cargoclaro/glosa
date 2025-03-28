import { expect } from 'vitest';

// https://github.com/vitest-dev/vitest/issues/2883#issuecomment-1897897016
export function expectToBeDefined<T>(value: T | undefined): asserts value is T {
  // biome-ignore lint/suspicious/noMisplacedAssertion: This is a helper function to narrow the type
  expect(value).toBeDefined();
}
