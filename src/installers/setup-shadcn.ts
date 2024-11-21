import { execa } from 'execa';
import consola from 'consola';

export default async function setupShadcn() {
  try {
    consola.info('Setting up shadcn/ui');

    const { stderr } = await execa('npx', [
      'shadcn@latest',
      'init',
      '-d',
      '-f',
      '-y',
    ]);

    if (stderr) {
      consola.error(stderr);
      process.exit(1);
    }

    consola.success('shadcn/ui setup completed');
    process.exit(0);
  } catch (error) {
    consola.error('Error setting up shadcn/ui:', error);
    process.exit(1);
  }
}
