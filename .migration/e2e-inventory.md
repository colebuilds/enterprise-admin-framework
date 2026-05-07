# E2E 用例清单

> 状态：⬜ 未写 / ✅ 通过 / ❌ 失败 / 🔄 编写中

## Smoke 套件（阶段 1 结束前必须全绿）

| spec 文件 | 覆盖场景 | 老项目 | 新项目 |
|-----------|---------|-------|-------|
| smoke/auth.spec.ts | 登录成功/失败/登出/未授权重定向 | ✅ 部分已有 | ⬜ |
| smoke/app-shell.spec.ts | layout 渲染/侧边栏/面包屑 | ✅ 已有 | ⬜ |
| smoke/dict-loading.spec.ts | 登录后字典数据加载验证 | ⬜ | ⬜ |

## 模块 Happy Path

| spec 文件 | 覆盖场景 | 老项目 | 新项目 |
|-----------|---------|-------|-------|
| system/user.spec.ts | 列表加载/搜索 | ⬜ | ⬜ |
| system/role.spec.ts | 列表加载 | ⬜ | ⬜ |
| tenant/organization.spec.ts | 列表加载/新增入口可见 | ⬜ | ⬜ |
| tenant/tenantList.spec.ts | 列表加载 | ⬜ | ⬜ |
| member/user.spec.ts | 列表加载/搜索 | ⬜ | ⬜ |
| finance/withdraw-dispatch.spec.ts | 列表加载/操作按钮 | ✅ 已有 | ⬜ |
| finance/recharge-order.spec.ts | 列表加载 | ⬜ | ⬜ |

## 写作规范（强制遵守）

```ts
// ✅ 语义选择器
page.getByRole('button', { name: '新增' })
page.getByRole('row').nth(1)
page.getByText('操作').first()
page.getByRole('textbox', { name: '用户名' })

// ❌ 禁止 class/结构选择器
page.locator('.n-data-table-td')
page.locator('.layout-sider .menu-item')

// ✅ URL 直达
await page.goto('/system/user')

// ❌ 禁止点击侧边栏
await page.click('text=系统管理')
```

## 标准 helper（所有 spec 共用）

```ts
// tests/helpers/auth.ts
import { expect, type Page, test } from '@playwright/test';

const adminUsername = process.env.E2E_ADMIN_USERNAME?.trim();
const adminPassword = process.env.E2E_ADMIN_PASSWORD?.trim();

export async function loginAsAdmin(page: Page) {
  if (!adminUsername || !adminPassword) {
    test.skip(true, 'requires E2E_ADMIN_USERNAME and E2E_ADMIN_PASSWORD');
  }
  await page.goto('/login');
  await page.getByRole('textbox', { name: '用户名' }).fill(adminUsername!);
  await page.getByRole('textbox', { name: '密码' }).fill(adminPassword!);

  const loginResponsePromise = page.waitForResponse(
    res => res.url().includes('/api/Login/Login') && res.request().method() === 'POST',
    { timeout: 30_000 },
  );
  await page.getByRole('button', { name: /登录|login/i }).click();

  const loginResponse = await loginResponsePromise;
  const result = await loginResponse.json();
  expect(result.code, result.msg).toBe(0);

  await expect.poll(
    () => page.evaluate(() => Boolean(localStorage.getItem('ACCESS-TOKEN'))),
    { timeout: 15_000 }
  ).toBe(true);
}
```

## 环境变量（playwright.config.ts）

```ts
// 新项目 playwright.config.ts
// E2E_ADMIN_USERNAME 和 E2E_ADMIN_PASSWORD 通过 .env.test.local 或 CI secrets 注入
// 不要 hardcode 账号密码
```
