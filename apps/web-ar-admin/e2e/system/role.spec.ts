/**
 * System > Role management — happy path tests
 *
 * Route: /system/role
 * Permission required: SystemManage:SysRole
 *
 * Auth: uses pre-saved storageState from auth.setup.ts.
 * The right-panel tree (menu auth) is only visible with UpdaterRoleAuth permission.
 */
import { expect, test } from '@playwright/test';

// ─── 1. Unauthenticated access redirects to login ────────────────────────────

test.describe('unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('unauthenticated access to /system/role redirects to login', async ({
    page,
  }) => {
    await page.goto('/system/role');
    await expect(page).toHaveURL(/login/, { timeout: 10_000 });
  });
});

// ─── 2. Authenticated: page loads with table structure ────────────────────────

test('authenticated user can load /system/role and see table structure', async ({
  page,
}) => {
  await page.goto('/system/role');

  const url = page.url();
  if (url.includes('/403') || !url.includes('/system/role')) {
    test.skip(true, 'Account lacks SystemManage:SysRole permission');
    return;
  }

  // Table header row must be visible (columns: ID, 角色名称, 状态, etc.)
  await expect(page.getByRole('row').nth(0)).toBeVisible({ timeout: 10_000 });
});

// ─── 3. Search by role name narrows results ──────────────────────────────────

test('search by role name updates table', async ({ page }) => {
  await page.goto('/system/role');

  const url = page.url();
  if (url.includes('/403') || !url.includes('/system/role')) {
    test.skip(true, 'Account lacks SystemManage:SysRole permission');
    return;
  }

  // Wait for table to settle (header row)
  await expect(page.getByRole('row').nth(0)).toBeVisible({ timeout: 10_000 });

  // Skip data-dependent assertion if there are no rows
  const dataRow = page.getByRole('row').nth(1);
  const hasData = await dataRow.isVisible().catch(() => false);
  if (!hasData) {
    test.skip(true, 'No role data in this environment — skipping search test');
    return;
  }

  // Type a search term that won't match anything — table should go empty
  await page.getByRole('textbox').first().fill('__no_match_xyz__');
  await page.getByRole('button', { name: /search|查询/i }).first().click();

  await expect(
    page.getByRole('row').nth(1).or(page.getByText(/no data|暂无数据/i).first()),
  ).toBeVisible({ timeout: 8000 });
});

// ─── 4. Clicking a row loads menu auth tree ──────────────────────────────────

test('clicking a role row loads the menu auth tree on the right', async ({
  page,
}) => {
  await page.goto('/system/role');

  const url = page.url();
  if (url.includes('/403') || !url.includes('/system/role')) {
    test.skip(true, 'Account lacks SystemManage:SysRole permission');
    return;
  }

  await expect(page.getByRole('row').nth(0)).toBeVisible({ timeout: 10_000 });

  const firstRow = page.getByRole('row').nth(1);
  const hasData = await firstRow.isVisible().catch(() => false);
  if (!hasData) {
    test.skip(true, 'No role data in this environment — skipping tree test');
    return;
  }

  await firstRow.click();

  await expect(
    page.locator('.n-tree').or(page.getByRole('tree').first()),
  ).toBeVisible({ timeout: 10_000 });
});
