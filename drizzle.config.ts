import { defineConfig } from 'drizzle-kit';
import { env } from './lib/env/server';

export default defineConfig({
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  casing: 'snake_case',
});
