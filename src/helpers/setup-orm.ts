import consola from 'consola';
import type { DatabaseType, ORMType } from '../types';
import { match } from 'ts-pattern';
import { $ } from 'execa';
import fs from 'fs-extra';
import path from 'path';

export default async function setupOrm(orm: ORMType, db: DatabaseType) {
  consola.info('Initializing ORM and database setup...');

  // Execute ORM setup first and await its completion
  await match(orm)
    .with('prisma', () => setupPrisma())
    .with('drizzle', () => setupDrizzle())
    .exhaustive();

  // Then execute database setup
  await match(db)
    .with('mongoDB', () => setupMongo())
    .with('postgres', () => setupPostgres(orm))
    .with('mySql', () => setupMysql(orm))
    .exhaustive();

  consola.success('ORM and database setup completed successfully!');
}

async function setupPrisma() {
  try {
    await Promise.all([
      $`bun add -D prisma`,
      $`bun add @prisma/client`,
      $`bunx prisma init`,
    ]);
  } catch (error) {
    consola.error('Error setting up Prisma:', error);
    throw error; // Let the main function handle the error
  }
}

async function setupDrizzle() {
  try {
    await Promise.all([
      $`bun add drizzle-orm`,
      $`bun add -D drizzle-kit`,
      fs.ensureDir('src/db'),
      fs.writeFile('src/db/drizzle.ts', ''),
      fs.writeFile('src/db/schema.ts', ''),
    ]);
  } catch (error) {
    consola.error('Error setting up Drizzle:', error);
    throw error;
  }
}

async function setupMongo() {
  try {
    const schemaContent = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
`;

    await fs.ensureDir('prisma');
    await fs.writeFile(
      path.join('prisma', 'schema.prisma'),
      schemaContent.trim()
    );
    consola.success('Prisma with MongoDB setup completed');
  } catch (error) {
    consola.error('Error setting up MongoDB with Prisma:', error);
    throw error;
  }
}

async function setupPostgres(orm: ORMType) {
  if (orm === 'prisma') {
    try {
      const schemaContent = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;
      await fs.ensureDir('prisma');
      await fs.writeFile(
        path.join('prisma', 'schema.prisma'),
        schemaContent.trim()
      );
      consola.success('Prisma with PostgreSQL setup completed');
    } catch (error) {
      consola.error('Error setting up PostgreSQL with Prisma:', error);
      throw error;
    }
  } else if (orm === 'drizzle') {
    try {
      const dbIndexContent = `
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool);
`;

      const schemaContent = `
import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  age: integer('age').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});
`;

      const drizzleConfigContent = `
import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  out: './drizzle',
  schema: './src/db/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
`;

      await Promise.all([
        $`bun add pg dotenv`,
        $`bun add -D @types/pg`,
        fs.ensureDir('src/db'),
        fs.writeFile('src/db/index.ts', dbIndexContent.trim()),
        fs.writeFile('src/db/schema.ts', schemaContent.trim()),
        fs.writeFile('drizzle.config.ts', drizzleConfigContent.trim()),
      ]);
      consola.success('Drizzle with PostgreSQL setup completed');
    } catch (error) {
      consola.error('Error setting up PostgreSQL with Drizzle:', error);
      throw error;
    }
  }
}

async function setupMysql(orm: ORMType) {
  try {
    if (orm === 'prisma') {
      const schemaContent = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
`;
      await fs.ensureDir('prisma');
      await fs.writeFile(
        path.join('prisma', 'schema.prisma'),
        schemaContent.trim()
      );
      consola.success('Prisma with MySQL setup completed');
    } else if (orm === 'drizzle') {
      const dbIndexContent = `
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
export const db = drizzle(connection);
`;

      const schemaContent = `
import { mysqlTable, serial, varchar, int } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users_table', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  age: int('age').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});
`;

      const drizzleConfigContent = `
import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  out: './drizzle',
  schema: './src/db/schema.ts',
  driver: 'mysql2',
  dbCredentials: {
    uri: process.env.DATABASE_URL!,
  },
} satisfies Config;
`;

      await Promise.all([
        $`bun add mysql2`,
        fs.ensureDir('src/db'),
        fs.writeFile('src/db/index.ts', dbIndexContent.trim()),
        fs.writeFile('src/db/schema.ts', schemaContent.trim()),
        fs.writeFile('drizzle.config.ts', drizzleConfigContent.trim()),
      ]);
      consola.success('Drizzle with MySQL setup completed');
    }
  } catch (error) {
    consola.error('Error setting up MySQL:', error);
    throw error;
  }
}
