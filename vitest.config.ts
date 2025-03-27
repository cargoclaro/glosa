import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import dotenv from 'dotenv'
import ms from 'ms'

// Load environment variables from .env files
dotenv.config()

export default defineConfig({
  test: {
    testTimeout: ms('30s'),
    include: ['**/*.spec.ts'],
    // Pass through all environment variables
    env: process.env,
  },
  plugins: [tsconfigPaths()],
})