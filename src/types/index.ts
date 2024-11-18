import { z } from 'zod';

// Define strict enums for better type safety
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

export const AuthProvider = {
  GOOGLE: 'google',
  GITHUB: 'github',
  APPLE: 'apple',
  NONE: 'none',
} as const;

// Define types using the enums
export type BackendType = (typeof Backend)[keyof typeof Backend];
export type DatabaseType = (typeof Database)[keyof typeof Database];
export type ORMType = (typeof ORM)[keyof typeof ORM];
export type AuthType = (typeof Auth)[keyof typeof Auth];
export type AuthProviderType = (typeof AuthProvider)[keyof typeof AuthProvider];

// Zod schema for runtime validation
export const ConfigOptionsSchema = z.object({
  name: z.string().min(1),
  shadcn: z.boolean(),
  payload: z.boolean(),
  backend: z.enum([Backend.TRPC, Backend.GRAPHQL, Backend.REST, Backend.NONE]),
  db: z.enum([Database.MONGODB, Database.POSTGRES, Database.MYSQL]).optional(),
  orm: z.enum([ORM.PRISMA, ORM.DRIZZLE]).optional(),
  localDB: z.boolean().optional(),
  auth: z.enum([Auth.AUTH_JS, Auth.LUCIA, Auth.NONE]).optional(),
  authProviders: z
    .enum([
      AuthProvider.GOOGLE,
      AuthProvider.GITHUB,
      AuthProvider.APPLE,
      AuthProvider.NONE,
    ])
    .optional(),
  git: z.boolean(),
  sst: z.boolean(),
});

export type ConfigOptionsType = z.infer<typeof ConfigOptionsSchema>;
