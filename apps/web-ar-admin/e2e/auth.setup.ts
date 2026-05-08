import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { test } from '@playwright/test';

import { TENANT_AUTH_FILE } from './constants';

const USERNAME = process.env.E2E_TENANT_USERNAME ?? 'org_milo';
const PASSWORD = process.env.E2E_TENANT_PASSWORD ?? '12345678';

const AUTH_MAX_AGE_MS = 4 * 60 * 60 * 1000; // 4 hours (SIT JWT TTL ~4h)

function isAuthFresh(): boolean {
  if (!fs.existsSync(TENANT_AUTH_FILE)) return false;
  return Date.now() - fs.statSync(TENANT_AUTH_FILE).mtimeMs < AUTH_MAX_AGE_MS;
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
  // Wait for any non-login URL (homepage may vary by account/config)
  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: 20_000,
  });

  fs.mkdirSync(path.dirname(TENANT_AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: TENANT_AUTH_FILE });
  console.warn('[auth.setup] saved new auth state');
});
