import '@/db/control/reset';
import '@/db/control/seed';

import path from 'node:path';
import { clerk, clerkSetup } from '@clerk/testing/playwright';
import { env } from '../env/server';
import { test as setup } from './fixture';

const authFile = path.join(process.cwd(), '/playwright/.clerk/user.json');

setup('global setup', async ({ page }) => {
  await clerkSetup();
  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: env.TESTING_EMAIL,
      password: env.TESTING_PASSWORD,
    },
  });
  await page.context().storageState({ path: authFile });
});
