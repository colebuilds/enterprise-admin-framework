# Permission System Migration Setup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 补全权限体系中两处缺失代码（`hasEveryPermission` hook 方法 + system/user 路由 `meta.authority`），使 vben 新项目的权限链路与老项目完全对等。

**Architecture:** 权限码已在登录时通过 `app-user.ts → getPermissionCodes → accessStore.setAccessCodes` 写入全局，`v-permission` 指令已就绪。本计划只补齐消费侧：hook 缺失的 AND 逻辑方法，以及 system 模块路由尚未设置的 `meta.authority` 字段。

**Tech Stack:** Vue 3, TypeScript, vben `@vben/stores` (accessStore), Vue Router

---

## 文件清单

| 操作   | 文件                                                    |
| ------ | ------------------------------------------------------- |
| Modify | `apps/web-ar-admin/src/hooks/web/usePermission.ts`      |
| Create | `apps/web-ar-admin/src/router/routes/modules/system.ts` |

---

## Task 1：补 `hasEveryPermission` 到 usePermission hook

**Files:**

- Modify: `apps/web-ar-admin/src/hooks/web/usePermission.ts`

**当前文件内容（完整）：**

```typescript
import { useAccessStore } from '@vben/stores';

export function usePermission() {
  const accessStore = useAccessStore();

  function hasPermission(code: string | string[]): boolean {
    const codes = Array.isArray(code) ? code : [code];
    return codes.some((c) => accessStore.accessCodes.includes(c.toLowerCase()));
  }

  return { hasPermission };
}
```

- [ ] **Step 1: 修改文件，追加 `hasEveryPermission`**

将文件替换为以下内容：

```typescript
import { useAccessStore } from '@vben/stores';

export function usePermission() {
  const accessStore = useAccessStore();

  function hasPermission(code: string | string[]): boolean {
    const codes = Array.isArray(code) ? code : [code];
    return codes.some((c) => accessStore.accessCodes.includes(c.toLowerCase()));
  }

  function hasEveryPermission(codes: string[]): boolean {
    return codes.every((c) =>
      accessStore.accessCodes.includes(c.toLowerCase()),
    );
  }

  return { hasEveryPermission, hasPermission };
}
```

- [ ] **Step 2: 验证 TypeScript 编译通过**

```bash
pnpm --filter @vben/web-ar-admin exec vue-tsc --noEmit 2>&1 | grep -E "usePermission|hasEvery" || echo "no errors related to usePermission"
```

预期：无 usePermission 相关报错。

- [ ] **Step 3: Commit**

```bash
git add apps/web-ar-admin/src/hooks/web/usePermission.ts
git commit -m "feat(@vben/web-ar-admin): add hasEveryPermission to usePermission hook"
```

---

## Task 2：新建 system 路由模块，设置 `meta.authority`

**Files:**

- Create: `apps/web-ar-admin/src/router/routes/modules/system.ts`

路由文件放在 `modules/` 目录下会被 `index.ts` 通过 `import.meta.glob('./modules/**/*.ts')` 自动加载，无需手动注册。

**老项目权限码对应关系（来源：`feat1-ar_platform_admin/src/router/modules/system.ts`）：**

| 页面            | 老项目 `meta.permissions`  | 新项目 `meta.authority`    |
| --------------- | -------------------------- | -------------------------- |
| /system（父级） | `['SystemManage']`         | `['SystemManage']`         |
| /system/user    | `['SystemManage:SysUser']` | `['SystemManage:SysUser']` |

- [ ] **Step 1: 创建 `apps/web-ar-admin/src/router/routes/modules/system.ts`**

```typescript
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/user',
    meta: {
      authority: ['SystemManage'],
      icon: 'lucide:settings',
      order: 10,
      title: 'menu.system',
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('#/views/system/user/index.vue'),
        meta: {
          authority: ['SystemManage:SysUser'],
          icon: 'lucide:users',
          keepAlive: false,
          title: 'menu.user',
        },
      },
    ],
  },
];

export default routes;
```

**注意：** `component` 指向的视图文件 `#/views/system/user/index.vue` 在 system/user 模块迁移时创建，目前可以先指向占位页（见 Step 2）。

- [ ] **Step 2: 创建占位视图 `apps/web-ar-admin/src/views/system/user/index.vue`**

迁移实际代码前，先建占位页确保路由不报错：

```vue
<template>
  <div>System User — 待迁移</div>
</template>
```

- [ ] **Step 3: 验证路由文件被正确识别**

```bash
pnpm --filter @vben/web-ar-admin exec vue-tsc --noEmit 2>&1 | grep -E "system\.ts|SystemUser" || echo "no errors in system routes"
```

预期：无报错。

- [ ] **Step 4: Commit**

```bash
git add apps/web-ar-admin/src/router/routes/modules/system.ts \
        apps/web-ar-admin/src/views/system/user/index.vue
git commit -m "feat(@vben/web-ar-admin): add system route module with meta.authority (placeholder view)"
```

---

## Task 3：端到端权限链路验证（人工）

**无代码变更，纯验证 checklist。**

- [ ] **Step 1: 启动开发服务器**

```bash
pnpm --filter @vben/web-ar-admin dev
```

- [ ] **Step 2: 本地开发账号验证（localhost sentinel）**

本地访问时 `accessCodes` 自动包含 `'localhost'`。

1. 登录任意账号
2. 检查左侧菜单是否出现"系统管理 > 用户管理"菜单项
3. 点击进入，应显示占位页内容"System User — 待迁移"

预期：菜单显示，页面正常渲染。

- [ ] **Step 3: 验证 403 跳转行为**

> 此步骤需要一个**不带 `SystemManage:SysUser` 权限**的账号。如无此类账号，可临时在 `auth.ts` 的 `fetchUserInfo` 中注释掉 `codes.push('localhost')` 行来模拟无权限状态。

1. 用无 system 权限的账号登录（或临时移除 localhost sentinel）
2. 左侧菜单不应显示"系统管理"
3. 手动访问 `/system/user`
4. 应跳转至 403 页面

预期：无权限时菜单隐藏，强制访问跳 403。

- [ ] **Step 4: 还原 localhost sentinel（如果 Step 3 中临时注释了）**

确认 `apps/web-ar-admin/src/store/auth.ts` 中 localhost sentinel 代码未被修改。

---

## 完成标志

- [ ] `usePermission` 导出 `hasEveryPermission`，TypeScript 无报错
- [ ] `src/router/routes/modules/system.ts` 存在，`/system/user` 路由有 `meta.authority: ['SystemManage:SysUser']`
- [ ] 本地启动后菜单出现"系统管理 > 用户管理"
- [ ] 无权限时手动访问 `/system/user` 跳转 403
