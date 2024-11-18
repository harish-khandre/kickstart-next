import consola from 'consola';
import type { AuthType } from '../types';

export default async function setupAuth(auth: AuthType) {
  consola.info('Auth initialized!');
}
