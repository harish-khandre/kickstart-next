import consola from 'consola';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import setupShadcn from '../installers/setup-shadcn';

export default async function createProject({
  projectName,
}: {
  projectName: string;
}) {
  const CURR_DIR = process.cwd();
  const projectPath = path.join(CURR_DIR, projectName);
  const templatePath = path.resolve(
    __dirname,
    '../../templates/base-next-project/'
  );

  try {
    await fs.ensureDir(projectPath);

    await fs.copy(templatePath, projectPath);

    await execa('npm', ['install'], { cwd: projectPath, stdio: 'inherit' });

    consola.success(`Project created successfully at ${projectPath}`);
    consola.info(
      'To add shadcn/ui components, run: npx shadcn-ui@latest add [component-name]'
    );
  } catch (error) {
    consola.error('Project creation failed:', error);
    // Clean up if project creation fails
    await fs.remove(projectPath).catch(console.error);
  }
}
