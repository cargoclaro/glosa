import { vercel } from "@t3-oss/env-core/presets-zod";
import { createEnv } from '@t3-oss/env-nextjs';
import { config } from 'dotenv';
import { z } from 'zod';

config();

export const env = createEnv({
  server: {
    ANTHROPIC_API_KEY: z.string(),
    BANXICO_TOKEN: z.string(),
    CLERK_SECRET_KEY: z.string(),
    DATABASE_URL: z.string().url(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
    LANGFUSE_BASEURL: z.string().url(),
    LANGFUSE_PUBLIC_KEY: z.string(),
    LANGFUSE_SECRET_KEY: z.string(),
    OPENAI_API_KEY: z.string(),
    TAXFINDER_API_KEY: z.string(),
    UPLOADTHING_TOKEN: z.string(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  extends: [vercel()],
});
