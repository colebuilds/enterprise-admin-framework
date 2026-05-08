# 路由与权限 Agent Context

## 路由权限字段

路由权限用 `meta.authority`（vben 字段），对应老项目的 `meta.permissions`：

```typescript
// src/router/routes/modules/system.ts
{
  path: '/system/user',
  name: 'SystemUser',
  component: () => import('#/views/system/user/index.vue'),
  meta: {
    authority: ['SystemManage:SysUser'],  // 老项目 meta.permissions 原样复制
    title: 'menu.user',
    icon: 'lucide:users',
  },
}
```

- `meta.authority` 未设置 = 所有已登录用户可访问
- 多个码是 OR 关系（命中任一即通过）
- 大小写不敏感（内部转小写比较），建议保留原始大小写

## 查老项目权限码

```
老项目路由文件：/Users/cola/Documents/gs/feat1-ar_platform_admin/src/router/modules/<模块>.ts
字段：meta.permissions
直接复制到新项目 meta.authority
```

## 新建路由模块

放在 `src/router/routes/modules/<模块>.ts`，由 `index.ts` 的 `import.meta.glob` 自动加载，无需手动注册。

参考模板：

```typescript
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/<模块>',
    name: '<Module>',
    redirect: '/<模块>/<子页面>',
    meta: {
      authority: ['<父级权限码>'],
      icon: 'lucide:<icon>',
      order: <排序数字>,
      title: 'menu.<模块>',
    },
    children: [
      {
        path: '<子页面>',
        name: '<Module><SubPage>',
        component: () => import('#/views/<模块>/<子页面>/index.vue'),
        meta: {
          authority: ['<子页面权限码>'],
          title: 'menu.<子页面>',
        },
      },
    ],
  },
];

export default routes;
```

## 页面内权限消费

```typescript
import { usePermission } from '#/hooks/web/usePermission';

const { hasPermission, hasEveryPermission } = usePermission();

// OR 逻辑（有任一码即通过）
hasPermission(['SystemManage:SysUser'])

// AND 逻辑（全部具备才通过）
hasEveryPermission(['SystemManage:SysUser', 'SystemManage:SysUser:Add'])
```

```html
<!-- 无权限时移除 DOM（默认） -->
<n-button v-permission="['SystemManage:SysUser:Add']">新增</n-button>

<!-- 无权限时禁用 -->
<n-button v-permission="{ action: ['SystemManage:SysUser:Export'], effect: 'disabled' }">导出</n-button>
```

## 禁止

- ❌ 使用 `meta.permissions`（老项目字段，新项目无效）
- ❌ 使用 `v-access:code`（vben 内置指令，项目统一用 `v-permission`）
- ❌ 直接读 `accessStore.accessCodes` 做权限判断（走 `usePermission` hook）

## 维护说明

本文件是路由权限规则的唯一来源。变更时必须同步检查：

- `documents/design/technical/2026-05-08-权限系统技术方案.md`
- `documents/guides/development/权限接入与模块核对SOP.md`
- 根目录 `CLAUDE.md`（如有权限摘要节）

触发更新时机：新增路由权限模式、字段名变化、hook API 变化
