import { execa } from 'execa';
import consola from 'consola';

export default async function setupShadcn(projectPath: string) {
  try {
    consola.info('Setting up shadcn/ui');
    await execa(
      'npx',
      [
        'shadcn@latest',
        'init',
        '-y', // Skip confirmation prompts
      ],
      {
        cwd: projectPath,
        //      stdio: 'inherit'  // Show the CLI output to user
      }
    );

    consola.success('shadcn/ui setup completed');
  } catch (error) {
    consola.error('Error setting up shadcn/ui:', error);
    throw error;
  }
}
