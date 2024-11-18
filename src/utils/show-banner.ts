import consola from 'consola';
import figlet from 'figlet';
import color from 'picocolors';

export default async function showBanner() {
  console.clear();
  console.log('\n');
  consola.box(
    color.red(figlet.textSync('Kickstart Next', { font: 'ANSI Shadow' }))
  );
}
