import consola from 'consola';
import fs from 'fs-extra';
import path from 'path';
import { $ } from 'execa';

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

    consola.success(`Project created successfully at ${projectPath}`);

    $({ cwd: projectPath });

    return projectPath;
  } catch (error) {
    consola.error('Project creation failed:', error);
    // Clean up if project creation fails
    await fs.remove(projectPath).catch(console.error);
  }
}
