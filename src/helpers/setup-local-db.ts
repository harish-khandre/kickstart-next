import consola from 'consola';
import type { DatabaseType } from '../types';
import { match } from 'ts-pattern';
import { $ } from 'execa';
import fs from 'fs-extra';

export default async function setupLocalDB(db: DatabaseType) {
  await match(db)
    .with('postgres', () => setupPostgres())
    .with('mySql', () => setupMySql())
    .with('mongoDB', () => setupMongodb)
    .exhaustive();

  consola.info('Local DB initialized!');
}

async function setupPostgres() {
  try {
    await Promise.all([
      $`docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`,
      fs.writeFile(
        '.env',
        'DATABASE_URL=postgres://postgres:mypassword@localhost:5432/postgres'
      ),
    ]);
  } catch (error) {
    consola.error('Postgres setup uncomplete', error);
  }
}

async function setupMySql() {
  try {
    await Promise.all([
      $`docker run --name mysql -e MYSQL_ROOT_PASSWORD=mysql -p 3306:3306 -d mysql`,

      fs.writeFile(
        '.env',
        'DATABASE_URL=mysql://root:mysql@localhost:3306/mysql'
      ),
    ]);
  } catch (error) {
    consola.error('Postgres setup uncomplete', error);
  }
}

async function setupMongodb() {
  try {
    await Promise.all([
      $`docker run --name mongo -e MONGO_INITDB_ROOT_USERNAME=username -e MONGO_INITDB_ROOT_PASSWORD=password -p 27017:27017 -d prismagraphql/mongo-single-replica:5.0.3`,

      fs.writeFile(
        '.env',
        'DATABASE_URL=mongodb://username:password@localhost:27017/db_name?authSource=admin&directConnection=true'
      ),
    ]);
  } catch (error) {
    consola.error('Postgres setup uncomplete', error);
  }
}
