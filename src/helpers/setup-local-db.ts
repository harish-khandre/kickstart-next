import consola from 'consola';
import type { DatabaseType } from '../types';

export default async function setupLocalDB(db: DatabaseType) {
  consola.info('Local DB initialized!');
}
