# 技术方案 C — 权限与路由系统

## 背景与问题

### 老项目现状

- 权限判断：`userStore.getPermissions`（数组，含 `{ value: 'code' }` 对象）
- 路由过滤：`generateDynamicRoutes(permissionsList, permissionsCodes)` 在前端静态路由表过滤
- 路由守卫：自写 `createRouterGuards`，含 token 检查、动态路由注册、i18n namespace 懒加载
- 权限指令：`v-permission="['Xxx:Yyy:Zzz']"`，44 处用法

### vben 现状

- `accessStore.accessCodes: string[]` — 权限码列表
- `accessStore.accessToken` — token
- `generateAccessible('frontend', options)` — 前端模式路由过滤（和老项目逻辑等价）
- `v-access:code="['xxx']"` — vben 权限指令（语法不同，不能直接用）
- 内置 guard：token 检查、loginExpired 重定向、progress bar

## 设计决策

| 决策项 | 选择 | 理由 |
| --- | --- | --- |
| accessMode | `frontend` | 老项目是前端路由表+权限码过滤，逻辑一致 |
| v-permission | **保留指令名，重写实现** | 44处用法不动，内部换数据源 |
| asyncRoutes | **整体迁入** | 格式兼容，改 meta 字段即可 |
| 自写 guard | **删除，用 vben 内置** | 只保留 i18n namespace 懒加载追加逻辑 |

## After：新实现

### 文件结构

```
src/
├── router/
│   ├── index.ts          ← 创建 router 实例
│   ├── guard.ts          ← vben guard + i18n namespace 懒加载追加
│   ├── access.ts         ← generateAccess 实现
│   └── routes/
│       ├── index.ts      ← 聚合所有路由
│       ├── core.ts       ← login/403/404 等基础路由
│       └── modules/      ← 从老项目迁入（格式基本不变）
│           ├── system.ts
│           ├── tenant.ts
│           ├── finance.ts
│           └── ...
├── store/
│   └── auth.ts           ← 登录/登出 action
└── directives/
    └── permission.ts     ← v-permission 新实现
```

### access.ts

```ts
import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';
import { generateAccessible } from '@vben/access';
import { BasicLayout, IFrameView } from '#/layouts';

export async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');
  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return generateAccessible('frontend', {
    ...options,
    forbiddenComponent: () => import('#/views/_core/fallback/forbidden.vue'),
    layoutMap,
    pageMap,
  });
}
```

### asyncRoutes 格式迁移

老项目路由 meta 格式 → 新项目对应字段：

```ts
// 老格式
meta: {
  title: 'menu.system.user',
  icon: renderIcon(UserOutlined),
  permissions: ['System:User:UserPage'],
  sort: 1,
  keepAlive: true,
}

// 新格式（vben frontend 模式识别 permissions 字段）
meta: {
  title: 'menu.system.user',   // 保持不变，i18n key
  icon: 'ant-design:user-outlined',  // 改为 vben icon 格式
  authority: ['System:User:UserPage'],  // vben 用 authority 而非 permissions
  order: 1,                   // vben 用 order 而非 sort
  keepAlive: true,            // 保持不变
}
```

**注意**：vben `generateAccessible` frontend 模式用 `meta.authority` 字段做权限过滤，老项目用 `meta.permissions`。迁移路由文件时需要批量重命名这个字段。

### auth.ts（登录/登出）

```ts
import { useAccessStore, useUserStore } from '@vben/stores';
import { useAppUserStore } from '#/store/app-user';
import { api } from '#/api';
import { generateAccess } from '#/router/access';
import { accessRoutes } from '#/router/routes';
import { router } from '#/router';

export const useAuthStore = defineStore('auth', {
  actions: {
    async login(params: { username: string; password: string }) {
      const accessStore = useAccessStore();
      const vbenUserStore = useUserStore();
      const appUserStore = useAppUserStore();

      // 1. 登录获取 token
      const data = await api.admin.login(params);
      accessStore.setAccessToken(data.token);

      // 2. 拉取完整用户信息（含 permissionCodes）
      await appUserStore.fetchUserInfo();

      // 3. 同步基础信息到 vben userStore（供 layout 用）
      vbenUserStore.setUserInfo({
        userId: String(appUserStore.info.id),
        username: appUserStore.info.loginName,
        realName: appUserStore.info.nickname,
        avatar: appUserStore.info.avatar,
        roles: [],
      });

      // 4. 同步权限码到 accessStore
      accessStore.setAccessCodes(appUserStore.getPermissionCodes);

      // 5. 初始化字典
      await appUserStore.loadBaseDicts();

      // 6. 生成可访问路由
      await generateAccess({
        router,
        routes: accessRoutes,
        roles: [],
      });
    },

    async logout() {
      await api.admin.loginOff().catch(() => {});
      useAccessStore().setAccessToken(null);
      useAppUserStore().$reset();
      router.push('/login');
    },
  },
});
```

### v-permission 指令（新实现，名称不变）

```ts
// src/directives/permission.ts
import type { DirectiveBinding, ObjectDirective } from 'vue';
import { useAccessStore } from '@vben/stores';

interface PermissionBinding {
  action: string[];
  effect?: 'disabled' | 'remove';
}

export const permission: ObjectDirective = {
  mounted(
    el: HTMLElement,
    binding: DirectiveBinding<string[] | PermissionBinding>,
  ) {
    const { accessCodes } = useAccessStore();

    // 兼容两种调用方式：
    // v-permission="['Xxx:Yyy']"
    // v-permission="{ action: ['Xxx:Yyy'], effect: 'disabled' }"
    let actions: string[];
    let effect: string | undefined;

    if (Array.isArray(binding.value)) {
      actions = binding.value;
    } else {
      actions = binding.value?.action ?? [];
      effect = binding.value?.effect;
    }

    const hasPermission =
      actions.length === 0 ||
      actions.some((code) => accessCodes.includes(code.toLowerCase()));

    if (!hasPermission) {
      if (effect === 'disabled') {
        (el as HTMLButtonElement).disabled = true;
        el.classList.add('n-button--disabled');
      } else {
        el.remove();
      }
    }
  },
};
```

### usePermission hook（供 createActionColumn 等组件用）

```ts
// src/hooks/usePermission.ts
import { useAccessStore } from '@vben/stores';

export function usePermission() {
  const { accessCodes } = useAccessStore();

  function hasPermission(accesses: string[]): boolean {
    if (!accesses?.length) return true;
    return accesses.some((code) => accessCodes.includes(code.toLowerCase()));
  }

  return { hasPermission };
}
```

### guard.ts（vben 内置 guard + i18n 追加）

```ts
// 不替换 vben guard，在其基础上追加 i18n namespace 懒加载
import { createRouterGuard } from '@vben/layouts'; // vben 内置
import { collectRouteNamespaces, loadNamespaces } from '#/locales';
import type { Router } from 'vue-router';

export function setupGuard(router: Router) {
  // 1. 注册 vben 内置 guard（token/loginExpired/progress）
  createRouterGuard(router);

  // 2. 追加 i18n namespace 懒加载（从老项目迁入）
  router.beforeEach(async (to) => {
    const namespaces = collectRouteNamespaces(to);
    if (namespaces.size > 0) {
      await loadNamespaces([...namespaces]);
    }
  });
}
```

## 调用方兼容清单

| 老项目调用 | 新项目对应 | 是否需要改调用方 |
| --- | --- | --- |
| `v-permission="[...]"` | `v-permission="[...]"` | **不需要改** |
| `usePermission().hasPermission(codes)` | `usePermission().hasPermission(codes)` | **不需要改** |
| `userStore.getPermissions` | `useAppUserStore().getPermissionCodes` | 需改（仅 5 处） |
| `asyncRouteStore.getMenus` | `accessStore.accessMenus` | 需改 |
| `asyncRouteStore.isDynamicRouteAdded` | `accessStore.isAccessChecked` | 需改 |

## 验证方法

1. 用有部分权限的账号登录，侧边栏只显示有权限的菜单项
2. 访问无权限路由 → 跳转 `/403`
3. 页面中带 `v-permission` 的按钮，无权限时不渲染
4. 清除 token 后访问任意页面 → 跳转 `/login?redirect=...`
5. e2e: `smoke/auth.spec.ts` 全绿
