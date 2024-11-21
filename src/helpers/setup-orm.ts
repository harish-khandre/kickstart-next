//TODO: setup orm and after setting up orm setup db based on the db
import consola from 'consola';
import type { DatabaseType, ORMType } from '../types';
import { match, P } from 'ts-pattern';
import { execa } from 'execa';
import fs from 'fs-extra';

export default async function setupOrm(orm: ORMType, db: DatabaseType) {
  consola.info('orm and db initialized!');

  match(orm)
    .with('prisma', async () => {
      setupPrisma();
    })
    .with('drizzle', async () => {
      setupDrizzle();
    })
    .run();

  match(db)
    .with('mongoDB', async () => {
      setupMongo();
    })
    .with('postgres', async () => {
      setupPostgres(orm);
    })
    .with('mySql', async () => {
      setupMysql(orm);
    })
    .run();
}

async function setupPrisma() {
  try {
    await Promise.all([
      execa('bun', ['add', 'prisma']),
      execa('bunx', ['prisma', 'init']),
    ]);
    process.exit(0);
  } catch (error) {
    consola.error('Error setting up prisma', error);
    process.exit(1);
  }
}

async function setupDrizzle() {
  try {
    await Promise.all([
      execa('bun', ['add', 'drizzle-orm']),
      execa('bun', ['add', '-D', 'drizzle-kit']),
      fs.ensureDir('/db'),
      fs.ensureFile('/db/drizzle.ts'),
      fs.ensureFile('/db/schema.ts'),
    ]);
    process.exit(0);
  } catch (error) {
    consola.error('Error setting up prisma', error);
    process.exit(1);
  }
}

async function setupMongo() {
  try {
    await Promise.all([
      fs.writeFile(
        '/prisma/schema.prisma',
        `
        generator client {
         provider = "prisma-client-js"
        }

        datasource db {
         provider = "mongodb"
         url      = env("DATABASE_URL")
        }
       `
      ),
    ]);

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

async function setupPostgres(orm: ORMType) {
  if (orm === 'prisma') {
    try {
      await fs.writeFile(
        '/prisma/schema.prisma',
        `
        generator client {
         provider = "prisma-client-js"
        }

        datasource db {
         provider = "postgresql"
         url      = env("DATABASE_URL")
        }
       `
      ),
        process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  } else if (orm === 'drizzle') {
    try {
      await Promise.all([
        execa('bun', ['add', 'pg', 'dotenv']),
        execa('bun', ['add', '-D', '@types/pg']),
        fs.ensureFile('/db/index.ts'),
        fs.writeFile(
          '/db/index.ts',
          `
        import 'dotenv/config';
        import { drizzle } from 'drizzle-orm/node-postgres';

        const db = drizzle(process.env.DATABASE_URL!);
        `
        ),
        fs.ensureFile('src/db/schema.ts'),
        fs.writeFile('src/db/schema.ts', `
// Example schema
import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users_table', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  age: int().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

`),
        fs.ensureFile('drizzle.config.ts'),
        fs.writeFile('drizzle.config.ts', `
// Example schema
import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

`),
      ]);
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  }
}

function setupMysql(orm: ORMType) {

  try {

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }


}
