import { expect, test } from '@playwright/test';

// Static dict sources (common/v1/group/platform) load at login.
// Dynamic dict is lazy — only loaded when a module calls useDictOptions on a dynamic key.
test('static dict sources load after login', async ({ page }) => {
  const dictCalls: string[] = [];

  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('/Common/GetDictionary') && !url.includes('/v1/'))
      dictCalls.push('common');
    if (url.includes('/v1/Common/GetDictionary')) dictCalls.push('v1');
    if (url.includes('/SysDictionary/GetGroupData')) dictCalls.push('group');
    if (url.includes('/Common/GetPlatformDic')) dictCalls.push('platform');
  });

  await page.goto('/dashboard/welcome');
  await expect(page.getByText('Welcome', { exact: true })).toBeVisible();

  await page.waitForTimeout(3000);

  expect(dictCalls).toContain('common');
  expect(dictCalls).toContain('v1');
  expect(dictCalls).toContain('group');
  expect(dictCalls).toContain('platform');
});
