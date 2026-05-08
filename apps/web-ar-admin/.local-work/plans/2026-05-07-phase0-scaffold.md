# Phase 0 脚手架 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从 `apps/web-naive` 复制创建 `apps/web-ar-admin`，外科手术式修改后 `pnpm dev:ar-admin` 启动，浏览器看到 vben 登录页，无编译错误。

**Architecture:** 以 web-naive 为模板直接复制，保留 adapter/router/\_core/locales 骨架，清空业务示例路由文件，改造 App.vue（4语言 locale + NDialogProvider + NModalProvider + componentOptions）、bootstrap.ts（追加 setupNaive/Directives/DiscreteApi 占位函数）、vite.config.ts（双 proxy 按 VITE_APP_TYPE 切换）、env 文件（三环境）。

**Tech Stack:** Vue 3 + Vite + Naive UI + Pinia + vue-router + Turborepo + pnpm workspace

---

## 文件结构

| 文件 | 操作 | 执行方 |
| --- | --- | --- |
| `apps/web-ar-admin/` | 整体复制自 web-naive | Codex |
| `src/app.vue` | 修改（4语言 + providers） | Claude Code |
| `src/bootstrap.ts` | 修改（追加 3 个 plugin 调用） | Claude Code |
| `src/preferences.ts` | 修改 app name | Codex |
| `src/plugins/index.ts` | 新建（空函数占位） | Claude Code |
| `vite.config.ts` | 修改（双 proxy） | Claude Code |
| `.env` | 新建 | Codex |
| `.env.dev` | 新建 | Codex |
| `.env.sit` | 新建 | Codex |
| `.env.prod` | 新建 | Codex |
| `package.json` | 修改 name + scripts | Codex |
| `src/router/routes/modules/` | 删除业务路由（dashboard/demos/vben） | Codex |
| `src/api/` 示例文件 | 删除（保留 request.ts 骨架） | Codex |
| `src/store/` | 清空（只保留 index.ts 导出壳） | Codex |
| 根 `package.json` | 追加 dev:ar-admin / build:ar-admin | Codex |

---

## Task 1: 复制 web-naive 为 web-ar-admin

→ **Codex**

**Files:**

- Create: `apps/web-ar-admin/` (copy of apps/web-naive)

- [ ] **Step 1: 复制整个 web-naive 目录**

```bash
cp -r apps/web-naive apps/web-ar-admin
```

- [ ] **Step 2: 验证目录结构**

```bash
ls apps/web-ar-admin/src/
```

Expected output includes: `adapter  api  app.vue  bootstrap.ts  layouts  locales  main.ts  preferences.ts  router  store  views`

- [ ] **Step 3: 删除 web-naive 残余（不属于新项目的构建产物）**

```bash
rm -rf apps/web-ar-admin/node_modules
rm -rf apps/web-ar-admin/dist
```

---

## Task 2: 清空业务示例内容

→ **Codex**

**Files:**

- Delete: `apps/web-ar-admin/src/router/routes/modules/dashboard.ts`
- Delete: `apps/web-ar-admin/src/router/routes/modules/demos.ts`
- Delete: `apps/web-ar-admin/src/router/routes/modules/vben.ts`
- Delete: `apps/web-ar-admin/src/views/dashboard/` (整个目录)
- Delete: `apps/web-ar-admin/src/views/demos/` (整个目录)
- Delete business api files (keep request.ts)
- Modify: `apps/web-ar-admin/src/store/index.ts`

- [ ] **Step 1: 删除业务路由模块文件**

```bash
rm apps/web-ar-admin/src/router/routes/modules/dashboard.ts
rm apps/web-ar-admin/src/router/routes/modules/demos.ts
rm apps/web-ar-admin/src/router/routes/modules/vben.ts
```

- [ ] **Step 2: 验证模块目录已清空（只有 modules/ 子目录本身存在）**

```bash
ls apps/web-ar-admin/src/router/routes/modules/
```

Expected: empty or no files (exit 0 with empty output)

- [ ] **Step 3: 删除业务 views（保留 \_core）**

```bash
rm -rf apps/web-ar-admin/src/views/dashboard
rm -rf apps/web-ar-admin/src/views/demos
```

- [ ] **Step 4: 验证 views 只剩 \_core**

```bash
ls apps/web-ar-admin/src/views/
```

Expected: `_core` (only)

- [ ] **Step 5: 删除业务 api 示例（保留 request.ts 和 core/ 目录）**

```bash
ls apps/web-ar-admin/src/api/
```

检查有哪些文件，删除除了 `request.ts` 和 `core/` 之外的所有文件：

```bash
# 检查 api/ 内容（web-naive 只有 core/ 和 request.ts，如有其他示例文件则删除）
find apps/web-ar-admin/src/api/ -maxdepth 1 -type f ! -name 'request.ts' -delete
```

- [ ] **Step 6: 验证 store 目录内容（无需修改）**

web-naive 的 store 只有 `auth.ts` 和 `index.ts`，复制后无业务 store 需要清除。Phase 1 开始后才会添加业务 store。

```bash
ls apps/web-ar-admin/src/store/
```

Expected: `auth.ts  index.ts`（两个文件，无需改动）

---

## Task 3: 修改 package.json（name + scripts）

→ **Codex**

**Files:**

- Modify: `apps/web-ar-admin/package.json`

- [ ] **Step 1: 更新 package.json**

将 `apps/web-ar-admin/package.json` 内容替换为：

```json
{
  "name": "@vben/web-ar-admin",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --mode dev",
    "dev:tenant": "cross-env VITE_APP_TYPE=TENANT vite --mode dev",
    "build:sit": "vite build --mode sit",
    "build:prod": "vite build --mode prod",
    "preview": "vite preview",
    "typecheck": "vue-tsc --noEmit --skipLibCheck",
    "gen:api": "tsx tools/api.ts"
  },
  "imports": {
    "#/*": "./src/*"
  },
  "dependencies": {
    "@vben-core/shadcn-ui": "workspace:*",
    "@vben/access": "workspace:*",
    "@vben/common-ui": "workspace:*",
    "@vben/constants": "workspace:*",
    "@vben/hooks": "workspace:*",
    "@vben/icons": "workspace:*",
    "@vben/layouts": "workspace:*",
    "@vben/locales": "workspace:*",
    "@vben/plugins": "workspace:*",
    "@vben/preferences": "workspace:*",
    "@vben/request": "workspace:*",
    "@vben/stores": "workspace:*",
    "@vben/styles": "workspace:*",
    "@vben/types": "workspace:*",
    "@vben/utils": "workspace:*",
    "@vueuse/core": "catalog:",
    "cross-env": "catalog:",
    "naive-ui": "catalog:",
    "pinia": "catalog:",
    "vue": "catalog:",
    "vue-router": "catalog:"
  }
}
```

- [ ] **Step 2: 验证 name 字段**

```bash
node -e "const p=require('./apps/web-ar-admin/package.json'); console.log(p.name, p.scripts.dev)"
```

Expected: `@vben/web-ar-admin vite --mode dev`

---

## Task 4: 创建 env 文件

→ **Codex**

**Files:**

- Create: `apps/web-ar-admin/.env`
- Create: `apps/web-ar-admin/.env.dev`
- Create: `apps/web-ar-admin/.env.sit`
- Create: `apps/web-ar-admin/.env.prod`

- [ ] **Step 1: 创建 .env（基础环境变量）**

`apps/web-ar-admin/.env`:

```bash
# 应用标题
VITE_APP_TITLE=AR Admin

# 命名空间（用于 localStorage key 隔离）
VITE_APP_NAMESPACE=vben-web-ar-admin

# Store 加密密钥
VITE_APP_STORE_SECURE_KEY=ar-admin-store-key-change-me

# 默认应用类型
VITE_APP_TYPE=ADMIN
```

- [ ] **Step 2: 创建 .env.dev（开发环境）**

`apps/web-ar-admin/.env.dev`:

```bash
# 端口
VITE_PORT=5900

VITE_BASE=/

# 总控后台 API
VITE_API_BASE_URL=https://dev-adminapi.lottotest6688.com

# 商户后台 API
VITE_TENANT_API_URL=https://dev-tenantadmin.lottotest6688.com

# 关闭 Mock（新项目对接真实后台）
VITE_NITRO_MOCK=false

VITE_DEVTOOLS=true

VITE_INJECT_APP_LOADING=true
```

- [ ] **Step 3: 创建 .env.sit**

`apps/web-ar-admin/.env.sit`:

```bash
VITE_BASE=/

VITE_API_BASE_URL=https://sit-adminapi.lottotest6688.com

VITE_TENANT_API_URL=https://sit-tenantadmin.lottotest6688.com

VITE_NITRO_MOCK=false

VITE_INJECT_APP_LOADING=true
```

- [ ] **Step 4: 创建 .env.prod**

`apps/web-ar-admin/.env.prod`:

```bash
VITE_BASE=/

VITE_API_BASE_URL=https://adminapi.lottotest6688.com

VITE_TENANT_API_URL=https://tenantadmin.lottotest6688.com

VITE_NITRO_MOCK=false

VITE_INJECT_APP_LOADING=true
```

- [ ] **Step 5: 验证 env 文件存在**

```bash
ls apps/web-ar-admin/.env*
```

Expected: `.env  .env.dev  .env.prod  .env.sit`

---

## Task 5: 修改 vite.config.ts（双 proxy）

→ **Claude Code**

**Files:**

- Modify: `apps/web-ar-admin/vite.config.ts`

- [ ] **Step 1: 查看当前 vite.config.ts**

```bash
cat apps/web-ar-admin/vite.config.ts
```

- [ ] **Step 2: 替换为双 proxy 版本**

将 `apps/web-ar-admin/vite.config.ts` 替换为：

```ts
import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  const appType = process.env.VITE_APP_TYPE ?? 'ADMIN';
  const isTenant = appType === 'TENANT';

  return {
    application: {},
    vite: {
      define: {
        'import.meta.env.VITE_APP_TYPE': JSON.stringify(appType),
      },
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            target: isTenant
              ? process.env.VITE_TENANT_API_URL
              : process.env.VITE_API_BASE_URL,
          },
        },
      },
    },
  };
});
```

- [ ] **Step 3: 验证文件内容**

```bash
grep -c "VITE_APP_TYPE\|isTenant\|VITE_TENANT_API_URL" apps/web-ar-admin/vite.config.ts
```

Expected: `3` (three matching lines)

---

## Task 6: 创建 src/plugins/index.ts（空函数占位）

→ **Claude Code**

**Files:**

- Create: `apps/web-ar-admin/src/plugins/index.ts`

- [ ] **Step 1: 创建 plugins 目录及 index.ts**

`apps/web-ar-admin/src/plugins/index.ts`:

```ts
import type { App } from 'vue';

// Phase 1 迁入：注册高频 naive-ui 组件
export function setupNaive(_app: App) {}

// Phase 1 迁入：createDiscreteApi（message/dialog/notification 在组件外调用）
export function setupNaiveDiscreteApi() {}

// Phase 1.3 迁入：v-permission 指令
export function setupDirectives(_app: App) {}
```

- [ ] **Step 2: 验证文件存在且可被 TypeScript 解析**

```bash
ls apps/web-ar-admin/src/plugins/index.ts
```

Expected: file path printed without error

---

## Task 7: 修改 src/bootstrap.ts（追加 plugin 调用）

→ **Claude Code**

**Files:**

- Modify: `apps/web-ar-admin/src/bootstrap.ts`

- [ ] **Step 1: 查看当前 bootstrap.ts**

```bash
cat apps/web-ar-admin/src/bootstrap.ts
```

- [ ] **Step 2: 在 registerAccessDirective(app) 之后、app.use(router) 之前追加 3 行**

在 `registerAccessDirective(app);` 行之后插入：

```ts
// 业务插件
const { setupNaive, setupNaiveDiscreteApi, setupDirectives } =
  await import('#/plugins');
setupNaive(app);
setupDirectives(app);
setupNaiveDiscreteApi();
```

完整的 bootstrap.ts 应如下（基于 web-naive 原文）：

```ts
import { createApp, watchEffect } from 'vue';

import { registerAccessDirective } from '@vben/access';
import { registerLoadingDirective } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { initStores } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/naive';

import { useTitle } from '@vueuse/core';

import { $t, setupI18n } from '#/locales';

import { initComponentAdapter } from './adapter/component';
import { initSetupVbenForm } from './adapter/form';
import App from './app.vue';
import { router } from './router';

async function bootstrap(namespace: string) {
  await initComponentAdapter();
  await initSetupVbenForm();

  const app = createApp(App);

  registerLoadingDirective(app, {
    loading: 'loading',
    spinning: 'spinning',
  });

  await setupI18n(app);
  await initStores(app, { namespace });
  registerAccessDirective(app);

  // 业务插件（Phase 0 为空函数占位，Phase 1 填充实现）
  const { setupNaive, setupNaiveDiscreteApi, setupDirectives } =
    await import('#/plugins');
  setupNaive(app);
  setupDirectives(app);
  setupNaiveDiscreteApi();

  const { initTippy } = await import('@vben/common-ui/es/tippy');
  initTippy(app);

  app.use(router);

  const { MotionPlugin } = await import('@vben/plugins/motion');
  app.use(MotionPlugin);

  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      const routeTitle = router.currentRoute.value.meta?.title;
      const pageTitle =
        (routeTitle ? `${$t(routeTitle)} - ` : '') + preferences.app.name;
      useTitle(pageTitle);
    }
  });

  app.mount('#app');
}

export { bootstrap };
```

- [ ] **Step 3: 验证 plugins 导入存在**

```bash
grep -c "setupNaive\|setupDirectives\|setupNaiveDiscreteApi" apps/web-ar-admin/src/bootstrap.ts
```

Expected: `4` (import line + 3 calls)

---

## Task 8: 修改 src/app.vue（4语言 locale + providers + componentOptions）

→ **Claude Code**

**Files:**

- Modify: `apps/web-ar-admin/src/app.vue`

- [ ] **Step 1: 替换 app.vue 为完整版本**

`apps/web-ar-admin/src/app.vue`:

```vue
<script lang="ts" setup>
import type { GlobalThemeOverrides } from 'naive-ui';

import { computed } from 'vue';

import { useNaiveDesignTokens } from '@vben/hooks';
import { preferences } from '@vben/preferences';

import {
  darkTheme,
  dateEnUS,
  dateIdID,
  dateViVN,
  dateZhCN,
  enUS,
  idID,
  lightTheme,
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  NModalProvider,
  NNotificationProvider,
  viVN,
  zhCN,
} from 'naive-ui';

defineOptions({ name: 'App' });

const { commonTokens } = useNaiveDesignTokens();

const NAIVE_LOCALE_MAP = {
  'zh-CN': { locale: zhCN, dateLocale: dateZhCN },
  'en-US': { locale: enUS, dateLocale: dateEnUS },
  'vi-VN': { locale: viVN, dateLocale: dateViVN },
  'id-ID': { locale: idID, dateLocale: dateIdID },
};

const tokenLocale = computed(
  () =>
    NAIVE_LOCALE_MAP[preferences.app.locale as keyof typeof NAIVE_LOCALE_MAP]
      ?.locale ?? enUS,
);
const tokenDateLocale = computed(
  () =>
    NAIVE_LOCALE_MAP[preferences.app.locale as keyof typeof NAIVE_LOCALE_MAP]
      ?.dateLocale ?? dateEnUS,
);
const tokenTheme = computed(() =>
  preferences.theme.mode === 'dark' ? darkTheme : lightTheme,
);

const themeOverrides = computed(
  (): GlobalThemeOverrides => ({
    common: commonTokens,
  }),
);

const componentOptions = {
  AutoComplete: { size: 'small' },
  Cascader: { size: 'small' },
  Button: { size: 'small' },
  DatePicker: { size: 'small' },
  Input: { size: 'small' },
  InputNumber: { size: 'small' },
  Select: { size: 'small' },
  TimePicker: { size: 'small' },
};
</script>

<template>
  <NConfigProvider
    :component-options="componentOptions"
    :date-locale="tokenDateLocale"
    :locale="tokenLocale"
    :theme="tokenTheme"
    :theme-overrides="themeOverrides"
    class="h-full"
    inline-theme-disabled
  >
    <NDialogProvider>
      <NModalProvider>
        <NNotificationProvider>
          <NMessageProvider>
            <RouterView />
          </NMessageProvider>
        </NNotificationProvider>
      </NModalProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
```

- [ ] **Step 2: 验证关键导入存在**

```bash
grep -c "viVN\|idID\|NDialogProvider\|NModalProvider\|componentOptions" apps/web-ar-admin/src/app.vue
```

Expected: `5`

---

## Task 9: 修改 src/preferences.ts

→ **Codex**

**Files:**

- Modify: `apps/web-ar-admin/src/preferences.ts`

- [ ] **Step 1: 修改 preferences.ts 设置 app name**

`apps/web-ar-admin/src/preferences.ts` 内容保持不变（已通过 `.env` 的 `VITE_APP_TITLE=AR Admin` 注入，preferences.ts 里已有 `name: import.meta.env.VITE_APP_TITLE`）。

验证当前内容正确：

```bash
cat apps/web-ar-admin/src/preferences.ts
```

Expected output contains: `name: import.meta.env.VITE_APP_TITLE`

---

## Task 10: 根目录 package.json 追加快捷脚本

→ **Codex**

**Files:**

- Modify: `package.json` (root)

- [ ] **Step 1: 查看当前根 package.json scripts**

```bash
node -e "const p=require('./package.json'); console.log(JSON.stringify(Object.keys(p.scripts), null, 2))"
```

- [ ] **Step 2: 追加 dev:ar-admin 和 build:ar-admin**

在根 `package.json` 的 `scripts` 对象中，在 `"dev:naive"` 行附近追加：

```json
"dev:ar-admin": "pnpm -F @vben/web-ar-admin run dev",
"build:ar-admin": "pnpm run build --filter=@vben/web-ar-admin"
```

- [ ] **Step 3: 验证脚本存在**

```bash
node -e "const p=require('./package.json'); console.log(p.scripts['dev:ar-admin'], p.scripts['build:ar-admin'])"
```

Expected: `pnpm -F @vben/web-ar-admin run dev  pnpm run build --filter=@vben/web-ar-admin`

---

## Task 11: 验证 store 结构完整

→ **Claude Code**（验证，无代码修改）

**Files:** 无修改

- [ ] **Step 1: 确认 store/index.ts 导出 useAuthStore**

```bash
cat apps/web-ar-admin/src/store/index.ts
```

Expected: `export * from './auth';`

- [ ] **Step 2: 确认 auth.ts 存在且导出 useAuthStore**

```bash
grep "useAuthStore" apps/web-ar-admin/src/store/auth.ts | head -3
```

Expected: line found containing `useAuthStore`

---

## Task 12: 首次启动验证

→ **Claude Code**（执行 + 判断）

**Files:** 无修改

- [ ] **Step 1: 安装依赖（如 cross-env 未在 workspace catalog）**

```bash
grep "cross-env" pnpm-workspace.yaml 2>/dev/null || grep "cross-env" package.json | head -5
```

确认 `cross-env` 在 workspace catalog 中。如不在，改用 `dotenv-cli` 或直接用 `vite --mode dev`（dev 脚本不需要 cross-env，只有 `dev:tenant` 需要）。

- [ ] **Step 2: 启动开发服务器**

```bash
pnpm dev:ar-admin
```

观察终端输出，预期：

- 无红色报错
- 显示 `Local: http://localhost:5900/`

- [ ] **Step 3: 检查浏览器（手动）**

访问 `http://localhost:5900`，预期：

- 看到 vben 登录页（背景 + 登录表单）
- 页面 title 为 "AR Admin"
- 无 console 错误

- [ ] **Step 4: TypeScript 检查**

```bash
pnpm -F @vben/web-ar-admin run typecheck
```

预期：无错误，或只有 `TODO: fix type` 注释允许的错误。

- [ ] **Step 5: dev:tenant 启动验证**

新开终端：

```bash
pnpm -F @vben/web-ar-admin run dev:tenant
```

预期：正常启动（proxy target 指向 VITE_TENANT_API_URL）

---

## 验收标准（对照设计文档）

| 标准                               | 验证方式               |
| ---------------------------------- | ---------------------- |
| `pnpm dev:ar-admin` 启动无编译错误 | Task 12 Step 2         |
| 浏览器看到 vben 登录页             | Task 12 Step 3（手动） |
| typecheck 无 TS 错误               | Task 12 Step 4         |
| `dev:tenant` 也可启动              | Task 12 Step 5         |

## 不在此阶段做的事

- 接入真实后台 API（Phase 1）
- 实现 v-permission 指令（Phase 1.3）
- 迁入任何业务页面（Phase 2+）
- gen:api 生成 API 模块（Phase 1.1）
- setupNaive / setupNaiveDiscreteApi 填充实现（Phase 1）
