import consola from 'consola';
import type { DatabaseType } from '../types';

export default async function setupDb(db: DatabaseType) {
  consola.info('Db initialized!');
}
