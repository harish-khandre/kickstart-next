import { z } from 'zod';

export const Backend = {
  TRPC: 'trpc',
  GRAPHQL: 'graphql',
  REST: 'rest',
  NONE: 'none',
} as const;

export const Database = {
  MONGODB: 'mongoDB',
  POSTGRES: 'postgres',
  MYSQL: 'mySql',
} as const;

export const ORM = {
  PRISMA: 'prisma',
  DRIZZLE: 'drizzle',
} as const;

export const Auth = {
  AUTH_JS: 'auth.js',
  LUCIA: 'lucia',
  NONE: 'none',
} as const;

export const AuthProvider = ['google', 'github', 'apple', 'none'] as const;

export type BackendType = (typeof Backend)[keyof typeof Backend];
export type DatabaseType = (typeof Database)[keyof typeof Database];
export type ORMType = (typeof ORM)[keyof typeof ORM];
export type AuthType = (typeof Auth)[keyof typeof Auth];
export type AuthProviderType = (typeof AuthProvider)[number]; // Extracts the union type

export const ConfigOptionsSchema = z.object({
  name: z.string().min(1),
  shadcn: z.boolean(),
  payload: z.boolean(),
  backend: z.enum([Backend.TRPC, Backend.GRAPHQL, Backend.REST, Backend.NONE]),
  db: z.enum([Database.MONGODB, Database.POSTGRES, Database.MYSQL]).optional(),
  orm: z.enum([ORM.PRISMA, ORM.DRIZZLE]).optional(),
  localDB: z.boolean().optional(),
  auth: z.enum([Auth.AUTH_JS, Auth.LUCIA, Auth.NONE]).optional(),
  authProviders: z.array(z.enum([...AuthProvider])).optional(), // Accepts an array of values
  git: z.boolean(),
  sst: z.boolean(),
});

export type ConfigOptionsType = z.infer<typeof ConfigOptionsSchema>;
