import dotenv from 'dotenv';
import ms from 'ms';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// Load environment variables from .env files
dotenv.config();

export default defineConfig({
  test: {
    testTimeout: ms('3m'),
    include: ['**/*.spec.ts'],
    // Pass through all environment variables
    env: process.env,
    watch: false,
  },
  plugins: [tsconfigPaths()],
});
