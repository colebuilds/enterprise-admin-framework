# Phase 0 脚手架 — 设计文档

> **For agentic workers:** 实现前请先读 `writing-plans` skill。

**Goal:** 从 `apps/web-naive` 复制创建 `apps/web-ar-admin`，外科手术式修改后 `pnpm dev` 启动，浏览器看到 vben 登录页，无编译错误。

**Architecture:** 以 web-naive 为模板直接复制，保留 adapter/router/\_core/locales 骨架，清空业务示例，改造 App.vue（扩展 locale + Provider）、bootstrap.ts（追加 setupNaive/Directives/DiscreteApi）、vite.config.ts（双 proxy）、env 文件（三环境）。

**Tech Stack:** Vue 3 + Vite + Naive UI + Pinia + vue-router + Turborepo + pnpm workspace

---

## 文件变更清单

### 新增（从 web-naive 复制后修改）

| 文件 | 操作 | 说明 |
| --- | --- | --- |
| `apps/web-ar-admin/` | 整体复制自 web-naive | 起点 |
| `src/app.vue` | 修改 | 扩展 locale + 追加 Provider |
| `src/bootstrap.ts` | 修改 | 追加 setupNaive/Directives/DiscreteApi |
| `src/preferences.ts` | 修改 | 设置 app name |
| `src/plugins/index.ts` | 新建 | setupNaive/setupNaiveDiscreteApi/setupDirectives 骨架 |
| `vite.config.ts` | 修改 | 双 proxy（ADMIN/TENANT）+ define |
| `.env` | 新建 | VITE_APP_TITLE + VITE_APP_TYPE=ADMIN |
| `.env.dev` | 新建 | dev 环境两个 API 地址 |
| `.env.sit` | 新建 | sit 环境两个 API 地址 |
| `.env.prod` | 新建 | prod 环境两个 API 地址 |
| `package.json` | 修改 | name + scripts（dev/dev:tenant/build:\*/gen:api） |
| `tools/` | 从老项目复制 | api.ts + 相关文件，修改模板 import 路径 |

### 清空（保留目录结构，删除业务内容）

| 路径 | 操作 |
| --- | --- |
| `src/views/` | 只保留 `_core/`（登录页、403、404），删除 dashboard/demos |
| `src/router/routes/modules/` | 清空业务路由文件，只保留 `_core/` 下静态路由 |
| `src/api/` | 只保留空的 `request.ts` 骨架，删除示例 api |
| `src/store/` | 清空，Phase 1 开始填 |

### 根目录追加

| 文件           | 改动                                            |
| -------------- | ----------------------------------------------- |
| `package.json` | 追加 `dev:ar-admin` / `build:ar-admin` 快捷脚本 |

---

## 详细设计

### App.vue

基于 web-naive `app.vue`，3 处改动：

**1. locale 映射扩展为 4 种语言**

```ts
import {
  zhCN,
  enUS,
  viVN,
  idID,
  dateZhCN,
  dateEnUS,
  dateViVN,
  dateIdID,
} from 'naive-ui';

const NAIVE_LOCALE_MAP = {
  'zh-CN': { locale: zhCN, dateLocale: dateZhCN },
  'en-US': { locale: enUS, dateLocale: dateEnUS },
  'vi-VN': { locale: viVN, dateLocale: dateViVN },
  'id-ID': { locale: idID, dateLocale: dateIdID },
};
const tokenLocale = computed(
  () => NAIVE_LOCALE_MAP[preferences.app.locale]?.locale ?? enUS,
);
const tokenDateLocale = computed(
  () => NAIVE_LOCALE_MAP[preferences.app.locale]?.dateLocale ?? dateEnUS,
);
```

**2. 追加 NDialogProvider + NModalProvider**

```html
<NConfigProvider
  :locale="tokenLocale"
  :date-locale="tokenDateLocale"
  :theme="tokenTheme"
  :theme-overrides="themeOverrides"
  :component-options="componentOptions"
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
```

**3. componentOptions（全局 size:small）**

```ts
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
```

---

### bootstrap.ts

vben 原版为主体，追加 3 行：

```ts
async function bootstrap(namespace: string) {
  await initComponentAdapter();
  await initSetupVbenForm();
  const app = createApp(App);
  registerLoadingDirective(app, { loading: 'loading', spinning: 'spinning' });
  await setupI18n(app);
  await initStores(app, { namespace });
  registerAccessDirective(app);

  // ── 业务追加 ──────────────────
  setupNaive(app); // 全局 naive-ui 组件
  setupDirectives(app); // v-permission（Phase 1.3 实现，此处先注册占位）
  setupNaiveDiscreteApi(); // 组件外 message/dialog/notification
  // ──────────────────────────────

  app.use(router);
  watchEffect(() => {
    /* 动态标题，从 web-naive 原样保留 */
  });
  app.mount('#app');
}
```

---

### src/plugins/index.ts（Phase 0 骨架）

```ts
import type { App } from 'vue';

// Phase 1 迁入：注册高频 naive-ui 组件
export function setupNaive(_app: App) {}

// Phase 1 迁入：createDiscreteApi
export function setupNaiveDiscreteApi() {}

// Phase 1.3 迁入：v-permission 指令
export function setupDirectives(_app: App) {}
```

Phase 0 全部为空函数占位，保证 bootstrap.ts 编译通过。

---

### vite.config.ts

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

---

### env 文件

```bash
# .env
VITE_APP_TITLE=AR Admin
VITE_APP_TYPE=ADMIN

# .env.dev
VITE_API_BASE_URL=https://dev-adminapi.lottotest6688.com
VITE_TENANT_API_URL=https://dev-tenantadmin.lottotest6688.com

# .env.sit
VITE_API_BASE_URL=https://sit-adminapi.lottotest6688.com
VITE_TENANT_API_URL=https://sit-tenantadmin.lottotest6688.com

# .env.prod
VITE_API_BASE_URL=https://adminapi.lottotest6688.com
VITE_TENANT_API_URL=https://tenantadmin.lottotest6688.com
```

---

### package.json（apps/web-ar-admin）

```json
{
  "name": "@vben/web-ar-admin",
  "scripts": {
    "dev": "vite --mode dev",
    "dev:tenant": "cross-env VITE_APP_TYPE=TENANT vite --mode dev",
    "build:sit": "vite build --mode sit",
    "build:prod": "vite build --mode prod",
    "preview": "vite preview",
    "typecheck": "vue-tsc --noEmit --skipLibCheck",
    "gen:api": "tsx tools/api.ts"
  }
}
```

### 根目录 package.json 追加

```json
"dev:ar-admin":   "pnpm -F @vben/web-ar-admin run dev",
"build:ar-admin": "pnpm run build --filter=@vben/web-ar-admin"
```

---

## 验收标准

1. `pnpm dev:ar-admin` 启动，终端无编译错误
2. 浏览器访问 `localhost:{port}` 看到 vben 登录页
3. `pnpm -F @vben/web-ar-admin run typecheck` 无 TS 错误（允许 `TODO: fix type` 注释）
4. `pnpm dev:ar-admin` 和 `pnpm -F @vben/web-ar-admin run dev:tenant` 均可启动（proxy target 不同）

## 不在此阶段做的事

- 接入真实后台 API（Phase 1 做）
- 实现 v-permission 指令（Phase 1.3 做）
- 迁入任何业务页面（Phase 2+ 做）
- gen:api 生成 API 模块（Phase 1.1 做）
