/**
 * System > User management — happy path tests
 *
 * Route: /system/user
 * Permission required: SystemManage:SysUser
 *
 * Auth: uses pre-saved storageState from auth.setup.ts.
 * If the saved account lacks SystemManage:SysUser the router redirects to /403;
 * those tests are skipped gracefully.
 */
import { expect, test } from '@playwright/test';

// ─── 1. Unauthenticated access redirects to login ────────────────────────────

test.describe('unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('unauthenticated access to /system/user redirects to login', async ({
    page,
  }) => {
    await page.goto('/system/user');
    await expect(page).toHaveURL(/login/, { timeout: 10_000 });
  });
});

// ─── 2. Authenticated: page loads with table data ────────────────────────────

test('authenticated user can load /system/user and see table rows', async ({
  page,
}) => {
  await page.goto('/system/user');

  // If the account lacks SystemManage:SysUser the router redirects to /403
  const url = page.url();
  if (url.includes('/403') || !url.includes('/system/user')) {
    test.skip(
      true,
      'Account lacks SystemManage:SysUser permission — router redirected away',
    );
    return;
  }

  await expect(page.getByRole('row').nth(1)).toBeVisible({ timeout: 10_000 });
});

// ─── 3. Search input triggers a query ────────────────────────────────────────

test('search box accepts input and table stays populated after query', async ({
  page,
}) => {
  await page.goto('/system/user');

  const url = page.url();
  if (url.includes('/403') || !url.includes('/system/user')) {
    test.skip(
      true,
      'Account lacks SystemManage:SysUser permission — router redirected away',
    );
    return;
  }

  await expect(page.getByRole('row').nth(1)).toBeVisible({ timeout: 10_000 });

  const searchInput = page
    .getByRole('textbox', { name: /账号|用户名/ })
    .first();
  await searchInput.fill('a');

  await page.getByRole('button', { name: /查询|搜索|Search/i }).click();

  await expect(
    page
      .getByRole('row')
      .nth(1)
      .or(page.getByText(/暂无数据|No Data/i).first()),
  ).toBeVisible({ timeout: 10_000 });
});

// ─── 4. Page title / breadcrumb identifies the module ────────────────────────

test('user management page shows a recognisable heading or breadcrumb', async ({
  page,
}) => {
  await page.goto('/system/user');

  const url = page.url();
  if (url.includes('/403') || !url.includes('/system/user')) {
    test.skip(
      true,
      'Account lacks SystemManage:SysUser permission — router redirected away',
    );
    return;
  }

  await expect(page.getByRole('row').nth(1)).toBeVisible({ timeout: 10_000 });

  const userText = page.getByText(/系统用户|用户管理|用户列表/i).first();
  await expect(userText).toBeVisible({ timeout: 5000 });
});
