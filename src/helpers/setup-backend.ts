import consola from 'consola';
import type { BackendType } from '../types';
import fs from 'fs-extra';
import { $, execa } from 'execa';
import { match } from 'ts-pattern';

export default async function setupBackend(backend: BackendType) {
  // $({ cwd: '/app' });

  await match(backend)
    .with('rest', async () => {
      setupRest();
    })
    .with('trpc', async () => {
      setupTrpc();
    })
    .with('graphql', async () => {
      setupGraphQl();
    })
    .otherwise(() => { });

  consola.info('Setting up backend', backend);
}

async function setupRest() {
  try {
    await fs.ensureDir('app/api');
    await fs.ensureFile('/api/route.ts');
    consola.log('success!');
  } catch (err) {
    consola.error(err);
  }
}

async function setupTrpc() {
  try {
    execa('bun', [
      'add',
      '@tanstack/react-query',
      '@trpc/client',
      '@trpc/react-query',
      '@trpc/server',
      '@trpc/next',
      'zod',
    ]);
    await fs.ensureDir('app/api/trpc/[trpc]');
    await fs.ensureFile('app/api/trpc/[trpc]/route.ts');
    await fs.writeFile(
      'app/api/trpc/[trpc]/route.ts',
      `
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/api/router'
import { createTRPCContext } from '@/server/api/context'

function handler(req: Request) {
return fetchRequestHandler({
req,
endpoint: '/api/trpc',
router: appRouter,
createContext: createTRPCContext,
})
}

export { handler as GET, handler as POST }
`
    );

    await fs.ensureDir('app/server/api/router');

    await fs.writeFile(
      'app/server/api/trpc.ts',
      `
import { initTRPC, TRPCError } from '@trpc/server'
import { ZodError } from 'zod'
import SuperJSON from 'superjson'
import { createTRPCContext } from './context'

const t = initTRPC.context<typeof createTRPCContext>().create({
transformer: SuperJSON,
errorFormatter({ shape, error }) {
return {
...shape,
data: {
...shape.data,
zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
},
}
},
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure
`
    );

    await fs.writeFile(
      'app/server/api/router/index.ts',
      `
/* example 
import { router } from '../trpc'
import { contactRouter } from './contact/contact.router'
import { otpRouter } from './otp/otp.router'
import { userRouter } from './user/user.router'

export const appRouter = router({
user: userRouter,
contact: contactRouter,
otp: otpRouter,
})

export type AppRouter = typeof appRouter
*/
`
    );
    consola.success('successfully set up trpc!');
  } catch (err) {
    consola.error(err);
  }
}

async function setupGraphQl() {
  try {
    consola.log('work in progress, for now implementing REST API');
    await setupRest();
  } catch (err) {
    consola.error(err);
  }
}
