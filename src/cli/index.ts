import figlet from "figlet";
import chalk from "chalk";
import consola from "consola";
import { intro, outro, select, text, confirm, isCancel, cancel, multiselect } from '@clack/prompts';

console.clear();
console.log("\n");
consola.box(chalk.red(figlet.textSync("Kickstart Next", { font: "ANSI Shadow" })));

export default async function runCli() {
  intro(chalk.dim('Create Next App With Ease'));

  const handleCancel = (value: any) => {
    if (isCancel(value)) {
      cancel('Operation cancelled');
      process.exit(0);  // Consider returning for testing flexibility
    }
    return value;
  };

  const promptText = async (message: string, placeholder: string = 'my-app') => {
    const value = await text({
      message,
      placeholder,
      initialValue: placeholder,
      validate: (value) => value.length > 0 ? undefined : 'Value is required!'
    });
    return handleCancel(value);
  };

  const promptConfirm = async (message: string) => handleCancel(await confirm({ message }));
  const promptSelect = async (message: string, options: { value: string, label: string, hint?: string }[]) =>
    handleCancel(await select({ message, options }));

  const projectName = await promptText('What is the name of your project', 'my-app');
  const isShadcn = await promptConfirm('Do you want Shadcn UI?');
  const isPayloadCms = await promptConfirm('Do you want Payload CMS?');

  const backend = await promptSelect('Pick your backend.', [
    { value: 'trpc', label: 'tRPC' },
    { value: 'graphql', label: 'GraphQL', hint: 'oh no' },
    { value: 'rest', label: 'REST' },
    { value: 'none', label: 'None' },
  ]);

  if (backend !== 'none') {
    const orm = await promptSelect('Pick an ORM.', [
      { value: 'prisma', label: 'Prisma' },
      { value: 'drizzle', label: 'Drizzle' },
    ]);

    const database = await promptSelect('Pick a Database.', [
      { value: 'mongoDB', label: 'MongoDB' },
      { value: 'postgres', label: 'Postgres' },
      { value: 'mySql', label: 'MySQL' },
    ]);

    const isLocalDB = await promptConfirm('Do you want to use a local database?');
    // Handle Docker setup if local DB is selected
  }

  const auth = await promptSelect("Pick an Auth service.", [
    { value: 'auth.js', label: 'Auth.js' },
    { value: 'lucia', label: 'Lucia' },
    { value: 'clerk', label: 'Clerk' },
    { value: 'none', label: 'None' },
  ]);

  if (auth !== 'none') {
    const authProviders = await handleCancel(await multiselect({
      message: "Pick an Auth service.",
      options: [
        { value: 'google', label: 'Google' },
        { value: 'github', label: 'GitHub' },
        { value: 'discord', label: 'Discord' },
        { value: 'apple', label: 'Apple' },
      ]
    }));
  }

  const isGit = await promptConfirm('Do you want to initialize a Git repository?');
  const isSST = await promptConfirm('Do you want to initialize SST?');

  outro(`You're all set!`);
}

