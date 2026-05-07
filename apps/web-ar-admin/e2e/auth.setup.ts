import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { test } from '@playwright/test';

import { AUTH_FILE } from './constants';

const USERNAME = process.env.E2E_USERNAME ?? 'milogly01';
const PASSWORD = process.env.E2E_PASSWORD ?? '12345678';

const AUTH_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours

function isAuthFresh(): boolean {
  if (!fs.existsSync(AUTH_FILE)) return false;
  return Date.now() - fs.statSync(AUTH_FILE).mtimeMs < AUTH_MAX_AGE_MS;
}

test('login and save auth state', async ({ page }) => {
  if (isAuthFresh()) {
    console.warn('[auth.setup] reusing cached state');
    return;
  }

  await page.goto('/auth/login');
  await page.getByPlaceholder('请输入用户名').fill(USERNAME);
  await page.getByPlaceholder('密码').fill(PASSWORD);
  await page.getByRole('button', { name: 'login', exact: true }).click();
  await page.waitForURL(/dashboard\/welcome/, { timeout: 20_000 });

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
  console.warn('[auth.setup] saved new auth state');
});
