import consola from 'consola';
import { execa } from 'execa';

export default async function setupGit() {
  try {
    const { stderr } = await execa('git', ['init']);
    if (stderr) {
      consola.error(stderr);
      process.exit(1);
    }
    consola.info('Git initialized!');
  } catch (error) {
    consola.error('Error setting up Git:', error);
    process.exit(1);
  }
}
