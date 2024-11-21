import consola from 'consola';
import { execa } from 'execa';

export default async function setupSst() {
  try {
    await execa`npx sst@latest init --yes`;
    consola.success('SST setup completed');
    process.exit(0);
  } catch (error) {
    consola.error('Error setting up SST:', error);
    process.exit(1);
  }
}
