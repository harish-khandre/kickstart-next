import * as p from '@clack/prompts';
import color from 'picocolors';
import { validateAppName } from '../utils/validate-app-name';

export default async function initializeCli() {
  p.intro(color.bgCyan(color.black(' initialize-next-app ')));

  const project = await p.group(
    {
      name: () => {
        return p.text({
          message: 'What will your project be called?',
          placeholder: 'my-app',
          initialValue: 'my-app',
          validate: validateAppName,
        });
      },
      shadcn: () => {
        return p.confirm({
          message: 'Would you like to use shadcn?',
          initialValue: true,
        });
      },
      payload: () => {
        return p.confirm({
          message: 'Would you like to use Payload CMS?',
          initialValue: true,
        });
      },
      backend: ({ results }) => {
        if (results.payload === true) return undefined;
        return p.select({
          message: `Pick your backend choice`,
          initialValue: 'trpc',
          options: [
            { value: 'trpc', label: 'tRPC' },
            { value: 'rest', label: 'REST' },
            { value: 'graphQL', label: 'GraphQL', hint: 'oh no' },
            { value: 'none', label: 'None' },
          ],
        });
      },
      db: async ({ results }) => {
        if (results.backend === 'none' || results.payload === true)
          return undefined;
        return await p.select({
          message: `Pick a Database`,
          initialValue: 'mongoDB',
          options: [
            { value: 'mongoDB', label: 'MongoDB' },
            { value: 'postgres', label: 'Postgres' },
            { value: 'mySql', label: 'MySQL' },
            // add more options here like sqlite, etc
          ],
        });
      },
      orm: async ({ results }) => {
        if (results.backend === 'none' || results.payload === true) {
          return undefined;
        }
        const options =
          results.db === 'mongodb'
            ? [{ value: 'prisma', label: 'Prisma' }]
            : [
                { value: 'prisma', label: 'Prisma' },
                { value: 'drizzle', label: 'Drizzle' },
              ]; // Include both options otherwise

        return await p.select({
          message: `Pick an ORM`,
          initialValue: 'prisma',
          options,
        });
      },
      localDB: ({ results }) => {
        if (results.backend === 'none' || results.payload === true)
          return undefined;
        return p.confirm({
          message: 'Would you like a local Database?',
          initialValue: true,
        });
      },
      auth: async ({ results }) => {
        if (results.backend === 'none' || results.payload === true)
          return undefined;
        return await p.select({
          message: `Pick your Auth service`,
          initialValue: 'auth.js',
          options: [
            { value: 'auth.js', label: 'Auth.js' },
            { value: 'lucia', label: 'Lucia' },
            { value: 'none', label: 'None' },
          ],
        });
      },
      authProviders: async ({ results }) => {
        if (results.backend === 'none' || results.payload === true)
          return undefined;
        return await p.multiselect({
          message: 'Pick Auth Providers',
          options: [
            { value: 'google', label: 'Google' },
            { value: 'discord', label: 'Discord' },
            { value: 'apple', label: 'Apple' },
            { value: 'github', label: 'Github' },
            { value: 'none', label: 'None' },
          ],
        });
      },
      git: () => {
        return p.confirm({
          message: 'Should we initialize Git?',
          initialValue: true,
        });
      },
      sst: () => {
        return p.confirm({
          message: 'Should we initialize SST?',
          initialValue: true,
        });
      },
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.');
        process.exit(0);
      },
    }
  );

  return project;
}
