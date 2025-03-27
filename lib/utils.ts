import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { expect } from 'vitest';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// https://github.com/vitest-dev/vitest/issues/2883#issuecomment-1897897016
export function expectToBeDefined<T>(
  value: T | undefined
): asserts value is T {
  // biome-ignore lint/suspicious/noMisplacedAssertion: This is a helper function to narrow the type
  expect(value).toBeDefined();
}
