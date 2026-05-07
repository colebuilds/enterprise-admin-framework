import { expect, test } from '@playwright/test';

// After setup login, dashboard should load directly
test('dashboard loads after login', async ({ page }) => {
  await page.goto('/dashboard/welcome');
  await expect(page).toHaveURL(/dashboard\/welcome/, { timeout: 8000 });
  await expect(page.getByText('Welcome', { exact: true })).toBeVisible();
});

// Unauthenticated: clear state inside describe so test.use applies at block level
test.describe('unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('redirect to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard/welcome');
    await expect(page).toHaveURL(/login/, { timeout: 8000 });
  });
});
