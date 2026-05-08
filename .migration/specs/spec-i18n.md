# 技术方案 D — 多语言（i18n）

## 背景与问题

### 老项目现状

- vue-i18n，按模块 namespace 分文件（finance/member/tenant 等）
- 路由守卫里按路径自动推导 namespace 并懒加载（`PATH_NAMESPACE_MAP`）
- 四套语言：en / zh / vi / id
- 切换语言后重新拉取字典数据（common/group/v1）
- Naive UI locale 单独处理（`src/i18n/naive-ui.ts`）

### 已知风险

- **naive-ui 官方内置 zh-CN / en-US / vi-VN / id-ID** 四套 locale，直接使用，无需自建
- vben `@vben/locales` 只有 en/zh，其他语言需要在 app 层自建

## After：新实现

### 文件结构

```
src/locales/
├── index.ts          ← 初始化 + loadNamespaces + 语言切换
├── naive-ui.ts       ← naive-ui locale 映射
└── langs/
    ├── en/
    │   ├── common.ts
    │   ├── finance.ts
    │   ├── member.ts
    │   ├── tenant.ts
    │   ├── system.ts
    │   ├── operations.ts
    │   ├── game.ts
    │   ├── report.ts
    │   ├── analytics.ts
    │   ├── dashboard.ts
    │   └── account.ts
    ├── zh/           ← 同结构
    ├── vi/           ← 同结构
    └── id/           ← 同结构
```

老项目 `src/i18n/locales/` 整块搬入 `src/locales/langs/`，文件内容不变。

### index.ts

```ts
import { createI18n } from 'vue-i18n';
import type { RouteLocationNormalized } from 'vue-router';

export type Namespace =
  | 'common'
  | 'finance'
  | 'member'
  | 'tenant'
  | 'system'
  | 'operations'
  | 'game'
  | 'report'
  | 'analytics'
  | 'dashboard'
  | 'account'
  | 'hubConfig'
  | 'productNav'
  | 'erde'
  | 'agent';

export type SupportedLocale = 'en' | 'zh' | 'vi' | 'id';

export const SUPPORT_LOCALES: SupportedLocale[] = ['en', 'zh', 'vi', 'id'];
export const DEFAULT_LOCALE: SupportedLocale = 'en';

// namespace 懒加载模块映射
const moduleLoaders: Record<
  SupportedLocale,
  Record<Namespace, () => Promise<any>>
> = {
  en: {
    common: () => import('./langs/en/common'),
    finance: () => import('./langs/en/finance'),
    member: () => import('./langs/en/member'),
    tenant: () => import('./langs/en/tenant'),
    system: () => import('./langs/en/system'),
    operations: () => import('./langs/en/operations'),
    game: () => import('./langs/en/game'),
    report: () => import('./langs/en/report'),
    analytics: () => import('./langs/en/analytics'),
    dashboard: () => import('./langs/en/dashboard'),
    account: () => import('./langs/en/account'),
    hubConfig: () => import('./langs/en/hubConfig'),
    productNav: () => import('./langs/en/productNav'),
    erde: () => import('./langs/en/erde'),
    agent: () => import('./langs/en/agent'),
  },
  zh: {
    /* 同结构 */
  } as any,
  vi: {
    /* 同结构 */
  } as any,
  id: {
    /* 同结构 */
  } as any,
};

const loadedNamespaces = new Set<string>();

export let i18n: ReturnType<typeof createI18n>;

export async function setupI18n(
  app: App,
  locale: SupportedLocale = DEFAULT_LOCALE,
) {
  i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    missingWarn: import.meta.env.DEV,
    fallbackWarn: import.meta.env.DEV,
  });

  // 预加载 common namespace
  await loadNamespaces(['common'], locale);

  app.use(i18n);
}

export async function loadNamespaces(
  namespaces: Namespace[],
  locale?: SupportedLocale,
) {
  const currentLocale = (locale ?? i18n.global.locale.value) as SupportedLocale;
  const toLoad = namespaces.filter(
    (ns) => !loadedNamespaces.has(`${currentLocale}:${ns}`),
  );

  if (!toLoad.length) return;

  await Promise.all(
    toLoad.map(async (ns) => {
      try {
        const loader = moduleLoaders[currentLocale]?.[ns];
        if (!loader) return;
        const mod = await loader();
        i18n.global.mergeLocaleMessage(currentLocale, {
          [ns]: mod.default ?? mod,
        });
        loadedNamespaces.add(`${currentLocale}:${ns}`);
      } catch (e) {
        console.warn(`[i18n] failed to load namespace: ${currentLocale}:${ns}`);
      }
    }),
  );
}

export async function setI18nLanguage(locale: SupportedLocale) {
  // 加载新语言的 common namespace
  await loadNamespaces(['common'], locale);
  i18n.global.locale.value = locale;

  // 重新加载字典（切语言后字典 label 要刷新）
  const { useAppUserStore } = await import('#/store/app-user');
  const appUserStore = useAppUserStore();
  await Promise.allSettled([
    appUserStore.getDictionaryDetail(),
    appUserStore.getDictionary(),
    appUserStore.loadV1Dictionary(),
  ]);
}
```

### PATH_NAMESPACE_MAP（从老项目直接迁入）

```ts
// src/locales/index.ts 里（或单独文件）
const PATH_NAMESPACE_MAP: Array<[RegExp, Namespace[]]> = [
  [/^\/finance(\/|$)/, ['finance']],
  [/^\/member(\/|$)/, ['member']],
  [/^\/operations(\/|$)/, ['operations']],
  [/^\/game(\/|$)/, ['game']],
  [/^\/system(\/|$)/, ['system']],
  [/^\/tenant(\/|$)/, ['tenant']],
  [/^\/report(\/|$)/, ['report']],
  [/^\/analytics(\/|$)/, ['analytics']],
  [/^\/account(\/|$)/, ['account']],
  [/^\/agent(\/|$)/, ['agent']],
  [/^\/dashboard(\/|$)/, ['dashboard']],
  [/^\/hubConfig(\/|$)/, ['hubConfig']],
  [/^\/productNav(\/|$)/, ['productNav']],
  [/^\/erde(\/|$)/, ['erde']],
];

export function collectRouteNamespaces(
  to: RouteLocationNormalized,
): Set<Namespace> {
  const namespaces = new Set<Namespace>();

  for (const record of to.matched) {
    const declared = record.meta?.i18nNamespace as
      | Namespace[]
      | Namespace
      | undefined;
    if (Array.isArray(declared)) {
      declared.forEach((ns) => namespaces.add(ns));
    } else if (typeof declared === 'string') {
      namespaces.add(declared);
    }
  }

  if (namespaces.size === 0) {
    for (const [pattern, nsList] of PATH_NAMESPACE_MAP) {
      if (pattern.test(to.path)) {
        nsList.forEach((ns) => namespaces.add(ns));
        break;
      }
    }
  }

  return namespaces;
}
```

### naive-ui.ts（Naive UI locale 映射）

```ts
// naive-ui 官方内置 zh-CN / en-US / vi-VN / id-ID 四套 locale
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
import type { SupportedLocale } from './index';

export const NAIVE_LOCALE_MAP = {
  zh: { locale: zhCN, dateLocale: dateZhCN },
  en: { locale: enUS, dateLocale: dateEnUS },
  vi: { locale: viVN, dateLocale: dateViVN },
  id: { locale: idID, dateLocale: dateIdID },
};

export function getNaiveLocale(lang: SupportedLocale) {
  return NAIVE_LOCALE_MAP[lang] ?? NAIVE_LOCALE_MAP.en;
}
```

> 老项目已验证：vi/id 切换时 Naive UI 组件（DatePicker、Pagination 等）均显示正确语言，无需 fallback。

## 调用方兼容清单

| 老项目调用 | 新项目对应 | 是否需要改调用方 |
| --- | --- | --- |
| `const { t } = useI18n()` | 保持不变 | **不需要改** |
| `import { i18n } from '@/i18n'` | `import { i18n } from '#/locales'` | 改 import 路径 |
| `loadNamespaces(ns)` | `loadNamespaces(ns)` | 同名，改 import 路径 |
| `setI18nLanguage(lang)` | `setI18nLanguage(lang)` | 同名，改 import 路径 |

## 验证方法

1. 登录后页面文字显示正确语言
2. 切换语言后：页面文字更新 + naive-ui 组件语言同步 + 字典重新加载
3. 进入 `/finance/` 路由，`finance` namespace 被懒加载（Network 面板或 vue-devtools 确认）
4. 进入未覆盖路由，`common` namespace 正常加载
5. vi/id 语言下 DatePicker、Pagination 等组件显示越南语/印尼语（官方 locale，非 fallback）
