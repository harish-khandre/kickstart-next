import consola from 'consola';
import { execa } from 'execa';
import fs from 'fs-extra';

export default async function setupPayload(projectPath: string) {
  try {
    consola.info('Setting up payload');
    Promise.all([
      await fs.remove(`${projectPath}/app/layout.tsx`),
      await execa`npx create-payload-app@beta`
    ])
    consola.success('Payload');
  } catch (error) {
    consola.error('Error setting up payload');
  }
}
