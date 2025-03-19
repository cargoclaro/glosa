import { auth } from '@clerk/nextjs/server';
import { initTRPC } from '@trpc/server';
import { experimental_nextAppDirCaller as nextAppDirCaller } from '@trpc/server/adapters/next-app-dir';
import { forbidden } from 'next/navigation';

interface Meta {
  roles: string[];
  permissions: string[];
}

const trpc = initTRPC.meta<Meta>().create();

export const api = trpc.procedure
  .experimental_caller(nextAppDirCaller({}))
  .use(async (opts) => {
    const { userId, orgId, has } = await auth.protect();
    if (!orgId) {
      throw new Error('Organization ID not found');
    }
    const roles = opts.meta?.roles ?? [];
    const permissions = opts.meta?.permissions ?? [];
    for (const role of roles) {
      if (!has({ role })) {
        forbidden();
      }
    }
    for (const permission of permissions) {
      if (!has({ permission })) {
        forbidden();
      }
    }
    return opts.next({
      ctx: {
        userId,
      },
    });
  });
