import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

import { env } from '~/lib/env/server';
import * as schema from './schema';

export const db = drizzle({
  connection: env.DATABASE_URL,
  ws,
  casing: 'snake_case',
  schema,
});
