import consola from 'consola';
import fs from 'fs-extra';

export default async function setupPayload(projectPath: string | undefined) {
  if (!projectPath) {
    consola.error('Project path is not defined');
    process.exit(1);
  }
  try {
    consola.info('Setting up payload');
    Promise.all([
      await fs.remove(`${projectPath}/app/layout.tsx`),
      // await $({ timeout: 5000 })`npx create-payload-app@beta`,
      // copy pase the folders and files
    ]);
    consola.success('Payload');
    process.exit(0);
  } catch (error) {
    consola.error('Error setting up payload');
    process.exit(1);
  }
}
