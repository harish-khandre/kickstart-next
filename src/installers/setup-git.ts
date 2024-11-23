import consola from 'consola';
import { $ } from 'execa';

export default async function setupGit() {
  try {
    const { stderr } = await $`git init`;
    if (stderr) {
      consola.error(stderr);
    }
    consola.info('Git initialized!');
  } catch (error) {
    consola.error('Error setting up Git:', error);
  }
}
