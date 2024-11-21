#!/usr/bin/env node
import { match, P } from 'ts-pattern';
import { z } from 'zod';
import initializeCli from './cli';
import createProject from './helpers/create-project';
import showBanner from './utils/show-banner';
import setupShadcn from './installers/setup-shadcn';
import setupPayload from './helpers/setup-payload';
import setupBackend from './helpers/setup-backend';
import {
  Auth,
  AuthProvider,
  Backend,
  ConfigOptionsSchema,
  type BackendType,
  type ConfigOptionsType,
} from './types';
import consola from 'consola';
import setupSst from './helpers/setup-sst';
import setupGit from './installers/setup-git';
import setupAuthProviders from './helpers/setup-auth-providers';
import setupAuth from './helpers/setup-auth';
import setupLocalDB from './helpers/setup-local-db';
import setupOrm from './helpers/setup-orm';
import setupDb from './helpers/setup-db';

let projectPath: string | undefined;

export default async function main() {
  try {
    showBanner();

    const configOptions = await initializeCli();
    const validatedConfig = ConfigOptionsSchema.parse(configOptions);

    await match(validatedConfig)
      .with({ name: P.string }, async (config) => {
        await setupHandlers.createProject(config.name);
      })
      .run();

    await match(validatedConfig)
      .with({ payload: true }, async () => {
        await setupHandlers.setupPayload();
      })
      .with({ shadcn: true }, async () => {
        await setupHandlers.setupShadcn();
      })
      .with({ backend: P.not(Backend.NONE) }, async (config) => {
        if (!validatedConfig.payload) {
          await setupHandlers.setupBackend(config.backend, config);
        }
      })
      .with({ git: true }, async () => {
        await setupHandlers.setupGit();
      })
      .with({ sst: true }, async () => {
        await setupHandlers.setupSst();
      })
      .run();

    consola.success('✨ Project setup completed successfully!');
  } catch (error) {
    if (error instanceof z.ZodError) {
      consola.error(
        'Invalid configuration:',
        JSON.stringify(error.errors, null, 2)
      );
    } else {
      consola.error('An unexpected error occurred:', error);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  consola.error('Fatal error:', error);
  process.exit(1);
});

// Setup handlers with error handling
const setupHandlers = {
  async createProject(name: string) {
    try {
      projectPath = await createProject({ projectName: name });
    } catch (error) {
      consola.error('Failed to create project:', error);
      process.exit(1);
    }
  },

  async setupShadcn() {
    try {
      await setupShadcn();
    } catch (error) {
      consola.error('Failed to setup Shadcn:', error);
      process.exit(1);
    }
  },

  async setupPayload() {
    try {
      await setupPayload(projectPath);
    } catch (error) {
      consola.error('Failed to setup Payload:', error);
      process.exit(1);
    }
  },

  async setupBackend(backend: BackendType, config: ConfigOptionsType) {
    try {
      await match(backend)
        .with(Backend.NONE, () => Promise.resolve())
        .otherwise(async () => {
          await setupBackend(backend);

          if (config.orm && config.db) {
            await setupOrm(config.orm, config.db);
          }

          if (config.localDB && config.db) {
            await setupLocalDB(config.db);
          }

          if (config.auth && config.auth !== Auth.NONE) {
            await setupAuth(config.auth);
          }

          if (config.authProviders && !config.authProviders.includes('none')) {
            for (const provider of config.authProviders) {
              await setupAuthProviders(provider);
            }
          }
        });
    } catch (error) {
      consola.error('Failed to setup backend:', error);
      process.exit(1);
    }
  },

  async setupGit() {
    try {
      await setupGit();
    } catch (error) {
      consola.error('Failed to setup Git:', error);
      process.exit(1);
    }
  },

  async setupSst() {
    try {
      await setupSst();
    } catch (error) {
      consola.error('Failed to setup SST:', error);
      process.exit(1);
    }
  },
};
