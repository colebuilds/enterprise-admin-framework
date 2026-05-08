import { test } from '@playwright/test';

test('debug system/user loading', async ({ page }) => {
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  
  page.on('pageerror', err => consoleErrors.push(`PAGE ERROR: ${err.message}`));
  
  page.on('response', resp => {
    if (resp.status() >= 400) {
      networkErrors.push(`${resp.status()} ${resp.url()}`);
    }
  });
  
  await page.goto('/system/user');
  await page.waitForTimeout(15000);
  
  console.log('URL after 15s:', page.url());
  console.log('Console errors:', consoleErrors);
  console.log('Network errors:', networkErrors);
  
  await page.screenshot({ path: '/tmp/debug-screenshot.png' });
});
