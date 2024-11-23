import consola from 'consola';
import type { AuthType } from '../types';
import { match } from 'ts-pattern';
import fs from 'fs-extra';
import { $ } from 'execa';

export default async function setupAuth(auth: AuthType) {
  await match(auth)
    .with('auth.js', () => setupAuthJs())
    .with('lucia', () => setupLucia())
    .with('none', () => {
      consola.info('no authentication serivce is being selected');
    })
    .exhaustive();

  consola.info('Auth setup successfull!');
}

async function setupAuthJs() {
  try {
    //TODO: Copy auth.js files and folders in this
  } catch (error) {
    consola.error('Error setting up Auth:', error);
    throw error;
  }
}
async function setupLucia() {
  try {
    await Promise.all([
      $`bun add lucia`
    ]);
  } catch (error) {
    throw new Error('Function not implemented.');
  }
}
