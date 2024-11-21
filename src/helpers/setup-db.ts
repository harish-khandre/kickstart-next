import consola from 'consola';
import type { DatabaseType } from '../types';
import fs from 'fs-extra';
import { match } from 'ts-pattern';

export default async function setupDb(db: DatabaseType) {
  await match(db)
    .with('mongoDB', async () => {
      setupMongo();
    })
    .run();

  consola.info('Db initialized!');
}

async function setupMongo() {
  try {
    await fs.ensureDir('app/db');
    await fs.ensureFile('/db/mongo.ts');
    consola.log('success!');
  } catch (err) {
    consola.error(err);
  }
}
