import consola from 'consola';
import type { AuthProviderType } from '../types';

export default async function setupAuthProviders(provider: AuthProviderType) {
  consola.info('auth provider setup completed!');
}
