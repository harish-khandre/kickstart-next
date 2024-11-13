import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['node_modules', 'dist'], // Adjust based on your output directory if needed
  },
  {
    files: ['src/**/*.{js,mjs,cjs,ts}'], // Only lint files inside the `src` folder
    languageOptions: {
      globals: globals.node,
      parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      'prettier/prettier': 'warn',
      'simple-import-sort/imports': 'error',
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn'],
    },
  },
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
];
