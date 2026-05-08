# Dynamic Mock Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `apps/backend-mock` from static JSON responses to a two-tier parameter-aware mock that supports pagination, keyword filtering, and ID lookup for all admin + tenant read endpoints.

**Architecture:** A thin `[...ar].ts` catch-all delegates to `dispatchArHandler()`, which first checks a typed handler registry (Tier 1: custom per-module filter logic), then falls back to a generic handler (Tier 2: auto-paginate any `data.list` fixture). Write ops and missing fixtures return `{code:0,data:null,msg:'ok'}`.

**Tech Stack:** Nitro (h3), TypeScript, Node.js `fs` (existing fixture loading)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `apps/backend-mock/utils/ar-mock-utils.ts` | Create | `paginate`, `filterByFields`, `findById`, `wrapOk` |
| `apps/backend-mock/utils/ar-handlers/_generic.ts` | Create | Generic auto-paginate / passthrough handler |
| `apps/backend-mock/utils/ar-handlers/admin/sys-users.ts` | Create | SysUsers filter by userName/keyword |
| `apps/backend-mock/utils/ar-handlers/admin/role.ts` | Create | Role filter by keyword→name |
| `apps/backend-mock/utils/ar-handlers/admin/org-tenant.ts` | Create | Organization + Tenant filter by name |
| `apps/backend-mock/utils/ar-handlers/admin/common.ts` | Create | IpWhitelist filter by ip; SysLog filter by keyword; SysDictionary pagination |
| `apps/backend-mock/utils/ar-handlers/admin/menu-tree.ts` | Create | Menu tree + GetMenuTreeByRoleId passthrough |
| `apps/backend-mock/utils/ar-handlers/tenant/withdraw.ts` | Create | WithdrawOrder/Record/Category/Channel/ConfigGroup |
| `apps/backend-mock/utils/ar-handlers/tenant/recharge.ts` | Create | RechargeCategory/Channel/Local* |
| `apps/backend-mock/utils/ar-handlers/tenant/payment.ts` | Create | ThirdPayMerchant + PaymentReport |
| `apps/backend-mock/utils/ar-handlers/tenant/v1-users.ts` | Create | v1/Users/* filter by userName/userId |
| `apps/backend-mock/utils/ar-handlers/tenant/v1-system.ts` | Create | v1/System/* logs pagination |
| `apps/backend-mock/utils/ar-handlers/index.ts` | Create | Registry + `dispatchArHandler()` |
| `apps/backend-mock/api/[...ar].ts` | Modify | Async, readBody, call dispatchArHandler |
| `apps/web-ar-admin/tools/endpoints/tenant-read.ts` | Modify | Fix params for broken code=14/7 fixtures |

---

## Task 1: ar-mock-utils.ts — shared utility functions

**Files:**
- Create: `apps/backend-mock/utils/ar-mock-utils.ts`

- [ ] **Step 1: Create the file**

```ts
// apps/backend-mock/utils/ar-mock-utils.ts

export interface PaginatedResult {
  list: any[];
  pageNo: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
}

export function paginate(
  list: any[],
  pageNo: number,
  pageSize: number,
): PaginatedResult {
  const page = Math.max(1, pageNo);
  const size = Math.max(1, pageSize);
  const start = (page - 1) * size;
  return {
    list: list.slice(start, start + size),
    pageNo: page,
    pageSize: size,
    totalCount: list.length,
    totalPage: Math.ceil(list.length / size) || 1,
  };
}

export function filterByFields(
  list: any[],
  keyword: string | undefined,
  fields: string[],
): any[] {
  if (!keyword || !keyword.trim()) return list;
  const kw = keyword.trim().toLowerCase();
  return list.filter((item) =>
    fields.some((f) => String(item[f] ?? '').toLowerCase().includes(kw)),
  );
}

export function findById(
  list: any[],
  id: any,
  idField: string,
): any | null {
  if (id == null) return list[0] ?? null;
  return list.find((item) => String(item[idField]) === String(id)) ?? list[0] ?? null;
}

export function wrapOk(data: any): { code: 0; data: any; msg: string } {
  return { code: 0, data, msg: '' };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd apps/backend-mock && npx tsc --noEmit --skipLibCheck 2>&1 | grep "ar-mock-utils" | head -5
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add apps/backend-mock/utils/ar-mock-utils.ts
git commit -m "feat(mock): add ar-mock-utils — paginate/filterByFields/findById/wrapOk"
```

---

## Task 2: _generic.ts — generic fallback handler

**Files:**
- Create: `apps/backend-mock/utils/ar-handlers/_generic.ts`

- [ ] **Step 1: Create the file**

```ts
// apps/backend-mock/utils/ar-handlers/_generic.ts
import { paginate, wrapOk } from '../ar-mock-utils';

export function genericHandler(ctx: {
  body: Record<string, any>;
  fixture: any;
}): any {
  const { body, fixture } = ctx;

  // No fixture → caller returns write stub
  if (fixture === null || fixture === undefined) return null;

  // Non-zero code → return error fixture as-is
  if (fixture.code !== 0) return fixture;

  const data = fixture.data;

  // List fixture + pageNo in request → auto-paginate
  if (
    data &&
    typeof data === 'object' &&
    Array.isArray(data.list) &&
    body.pageNo != null
  ) {
    return wrapOk(paginate(data.list, body.pageNo, body.pageSize ?? 20));
  }

  // Everything else (trees, dicts, single objects) → passthrough
  return fixture;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd apps/backend-mock && npx tsc --noEmit --skipLibCheck 2>&1 | grep "_generic" | head -5
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add apps/backend-mock/utils/ar-handlers/_generic.ts
git commit -m "feat(mock): add generic fallback handler — auto-paginate list fixtures"
```

---

## Task 3: Admin handler — sys-users, role, org-tenant

**Files:**
- Create: `apps/backend-mock/utils/ar-handlers/admin/sys-users.ts`
- Create: `apps/backend-mock/utils/ar-handlers/admin/role.ts`
- Create: `apps/backend-mock/utils/ar-handlers/admin/org-tenant.ts`

The `ArHandler` type and `ArHandlerMap` will be defined in `index.ts` (Task 8). For now, use inline type annotation.

- [ ] **Step 1: Create sys-users.ts**

Filter fields confirmed from old project `src/views/system/user/PlatformUserPage.vue`: `userName` → searches `userName` + `nickName`.

```ts
// apps/backend-mock/utils/ar-handlers/admin/sys-users.ts
import { filterByFields, findById, paginate, wrapOk } from '../../ar-mock-utils';
import type { ArHandlerMap } from '../index';

export const adminSysUsersHandlers: ArHandlerMap = {
  '/SysUsers/GetAdminPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    const filtered = filterByFields(
      fixture.data.list,
      body.userName,
      ['userName', 'nickName'],
    );
    return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/SysUsers/GetTenantPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    const filtered = filterByFields(
      fixture.data.list,
      body.userName,
      ['userName', 'nickName'],
    );
    return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/SysUsers/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    const filtered = filterByFields(
      fixture.data.list,
      body.userName,
      ['userName', 'nickName'],
    );
    return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/SysUsers/GetInfo': ({ body, loadFixture }) => {
    const listFixture = loadFixture('/SysUsers/GetAdminPageList');
    const list = listFixture?.data?.list ?? [];
    return wrapOk(findById(list, body.userId, 'userId'));
  },

  '/SysUsers/GetSuperAuthUser': ({ fixture }) => fixture ?? wrapOk(null),
};
```

- [ ] **Step 2: Create role.ts**

Filter fields confirmed from `src/views/system/role/role.vue`: `keyword` → searches `name` field.

```ts
// apps/backend-mock/utils/ar-handlers/admin/role.ts
import { filterByFields, paginate, wrapOk } from '../../ar-mock-utils';
import type { ArHandlerMap } from '../index';

export const adminRoleHandlers: ArHandlerMap = {
  '/Role/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    const filtered = filterByFields(
      fixture.data.list,
      body.keyword,
      ['name'],
    );
    return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 20));
  },
};
```

- [ ] **Step 3: Create org-tenant.ts**

Filter fields: Organization from `src/views/tenant/organization/index.vue` → `name`; Tenant from `src/views/tenant/tenantList/index.vue` → `name`, `state`, `orgId` (equality filters).

```ts
// apps/backend-mock/utils/ar-handlers/admin/org-tenant.ts
import { filterByFields, paginate, wrapOk } from '../../ar-mock-utils';
import type { ArHandlerMap } from '../index';

export const adminOrgTenantHandlers: ArHandlerMap = {
  '/Organization/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    const filtered = filterByFields(fixture.data.list, body.name, ['name']);
    return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/Tenant/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data.list;
    if (body.name) {
      list = filterByFields(list, body.name, ['name']);
    }
    if (body.state != null) {
      list = list.filter((i) => i.state === body.state);
    }
    if (body.orgId != null) {
      list = list.filter((i) => i.orgId === body.orgId);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 10));
  },
};
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd apps/backend-mock && npx tsc --noEmit --skipLibCheck 2>&1 | grep "admin/" | head -10
```

Expected: errors only about missing `ArHandlerMap` import from `../index` (which doesn't exist yet). That's OK for now — we'll fix when index.ts is created in Task 8.

- [ ] **Step 5: Commit**

```bash
git add apps/backend-mock/utils/ar-handlers/admin/
git commit -m "feat(mock): admin handlers — sys-users, role, org-tenant"
```

---

## Task 4: Admin handler — common + menu-tree

**Files:**
- Create: `apps/backend-mock/utils/ar-handlers/admin/common.ts`
- Create: `apps/backend-mock/utils/ar-handlers/admin/menu-tree.ts`

- [ ] **Step 1: Create common.ts**

IpWhitelist from `src/views/system/whiteIp/index.vue`: passes `ip` through directly. SysLog from `src/views/system/log/index.vue`: `keyword` → `userName`, `operationDesc`.

```ts
// apps/backend-mock/utils/ar-handlers/admin/common.ts
import { filterByFields, paginate, wrapOk } from '../../ar-mock-utils';
import type { ArHandlerMap } from '../index';

export const adminCommonHandlers: ArHandlerMap = {
  '/IpWhitelist/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data.list;
    if (body.ip) {
      list = filterByFields(list, body.ip, ['ip']);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/SysLog/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data.list;
    if (body.keyword) {
      list = filterByFields(list, body.keyword, ['userName', 'operationDesc']);
    }
    if (body.logState != null) {
      list = list.filter((i) => i.logState === body.logState);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/SysDictionary/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list, body.pageNo ?? 1, body.pageSize ?? 20));
  },
};
```

- [ ] **Step 2: Create menu-tree.ts**

Menu tree endpoints return the full tree regardless of parameters (mock has no per-role fixture data).

```ts
// apps/backend-mock/utils/ar-handlers/admin/menu-tree.ts
import type { ArHandlerMap } from '../index';

export const adminMenuTreeHandlers: ArHandlerMap = {
  // Return full tree regardless of roleId — no per-role data in fixtures
  '/Menu/GetMenuTreeByRoleId': ({ fixture }) => fixture ?? { code: 0, data: [], msg: '' },

  '/Menu/GetMenuTreeByOrgId': ({ fixture }) => fixture ?? { code: 0, data: [], msg: '' },

  '/Menu/GetAdminMenuTree': ({ fixture }) => fixture ?? { code: 0, data: [], msg: '' },

  '/Menu/GetMenuTree': ({ fixture }) => fixture ?? { code: 0, data: [], msg: '' },

  '/Menu/GetOrgMenuTree': ({ fixture }) => fixture ?? { code: 0, data: [], msg: '' },

  '/Menu/GetMenuTreeByCurrentSysUser': ({ fixture }) => fixture ?? { code: 0, data: [], msg: '' },
};
```

- [ ] **Step 3: Commit**

```bash
git add apps/backend-mock/utils/ar-handlers/admin/common.ts \
        apps/backend-mock/utils/ar-handlers/admin/menu-tree.ts
git commit -m "feat(mock): admin handlers — common (IpWhitelist/SysLog/SysDict) + menu-tree"
```

---

## Task 5: Tenant handler — withdraw

**Files:**
- Create: `apps/backend-mock/utils/ar-handlers/tenant/withdraw.ts`

Filter fields confirmed from:
- `src/views/finance/withdrawOrder/records/useRecordsPage.ts`: `tenantId`, `userId`, `orderNo`, `withdrawCategoryId`, `withdrawChannelId`, `withdrawState`
- `src/views/finance/withdrawType/withdrawCategory/index.vue` (via type): `customName`, `state`, `tenantId`

- [ ] **Step 1: Create withdraw.ts**

```ts
// apps/backend-mock/utils/ar-handlers/tenant/withdraw.ts
import { filterByFields, paginate, wrapOk } from '../../ar-mock-utils';
import type { ArHandlerMap } from '../index';

export const tenantWithdrawHandlers: ArHandlerMap = {
  '/WithdrawOrder/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data.list;
    if (body.tenantId != null) {
      list = list.filter((i) => i.tenantId === body.tenantId);
    }
    if (Array.isArray(body.withdrawStates) && body.withdrawStates.length > 0) {
      list = list.filter((i) => body.withdrawStates.includes(i.withdrawState));
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/WithdrawOrder/GetAuditPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data.list;
    if (body.tenantId != null) {
      list = list.filter((i) => i.tenantId === body.tenantId);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/WithdrawRecord/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data.list;
    if (body.tenantId != null) {
      list = list.filter((i) => i.tenantId === body.tenantId);
    }
    if (body.userId != null) {
      list = list.filter((i) => String(i.userId) === String(body.userId));
    }
    if (body.orderNo) {
      list = list.filter((i) =>
        String(i.orderNo ?? '').includes(body.orderNo.trim()),
      );
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/WithdrawCategory/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data.list;
    if (body.customName) {
      list = filterByFields(list, body.customName, ['customName', 'name']);
    }
    if (body.state != null) {
      list = list.filter((i) => i.state === body.state);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/WithdrawChannel/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data.list;
    if (body.channelId != null) {
      list = list.filter((i) => i.channelId === body.channelId);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/WithdrawConfigGroup/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/WithdrawStaticDay/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list, body.pageNo ?? 1, body.pageSize ?? 20));
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/backend-mock/utils/ar-handlers/tenant/withdraw.ts
git commit -m "feat(mock): tenant withdraw handler — WithdrawOrder/Record/Category/Channel"
```

---

## Task 6: Tenant handler — recharge + payment

**Files:**
- Create: `apps/backend-mock/utils/ar-handlers/tenant/recharge.ts`
- Create: `apps/backend-mock/utils/ar-handlers/tenant/payment.ts`

Filter fields from `src/api/recharge/types.ts`: `customName`, `state`, `tenantId`, `channelId`.

- [ ] **Step 1: Create recharge.ts**

```ts
// apps/backend-mock/utils/ar-handlers/tenant/recharge.ts
import { filterByFields, paginate, wrapOk } from '../../ar-mock-utils';
import type { ArHandlerMap } from '../index';

export const tenantRechargeHandlers: ArHandlerMap = {
  '/RechargeCategory/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data.list;
    if (body.customName) {
      list = filterByFields(list, body.customName, ['customName', 'name']);
    }
    if (body.state != null) {
      list = list.filter((i) => i.state === body.state);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/RechargeChannel/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data.list;
    if (body.channelId != null) {
      list = list.filter((i) => i.channelId === body.channelId);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/RechargeLocalBank/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/RechargeLocalEWallet/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/RechargeLocalUpi/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/RechargeLocalUsdt/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list, body.pageNo ?? 1, body.pageSize ?? 20));
  },
};
```

- [ ] **Step 2: Create payment.ts**

```ts
// apps/backend-mock/utils/ar-handlers/tenant/payment.ts
import { paginate, wrapOk } from '../../ar-mock-utils';
import type { ArHandlerMap } from '../index';

export const tenantPaymentHandlers: ArHandlerMap = {
  '/ThirdPayMerchant/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/PaymentReport/GetChannelPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/PaymentReport/GetTenantPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list, body.pageNo ?? 1, body.pageSize ?? 20));
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add apps/backend-mock/utils/ar-handlers/tenant/recharge.ts \
        apps/backend-mock/utils/ar-handlers/tenant/payment.ts
git commit -m "feat(mock): tenant recharge + payment handlers"
```

---

## Task 7: Tenant handler — v1-users + v1-system

**Files:**
- Create: `apps/backend-mock/utils/ar-handlers/tenant/v1-users.ts`
- Create: `apps/backend-mock/utils/ar-handlers/tenant/v1-system.ts`

Filter fields confirmed from `src/views/member/user/useUserPage.ts`: `tenantId`, `userId`, `userName`, `userState`, `agentType`, `blockStates`.

- [ ] **Step 1: Create v1-users.ts**

```ts
// apps/backend-mock/utils/ar-handlers/tenant/v1-users.ts
import { filterByFields, findById, paginate, wrapOk } from '../../ar-mock-utils';
import type { ArHandlerMap } from '../index';

export const tenantV1UsersHandlers: ArHandlerMap = {
  '/v1/Users/GetUserPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data.list ?? [];
    if (body.userName) {
      list = filterByFields(list, body.userName, ['userName', 'nickName']);
    }
    if (body.userId != null) {
      list = list.filter((i) => String(i.userId) === String(body.userId));
    }
    if (body.userState != null) {
      list = list.filter((i) => i.userState === body.userState);
    }
    return wrapOk({ ...paginate(list, body.pageNo ?? 1, body.pageSize ?? 10) });
  },

  '/v1/Users/GetOnlineUserPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/v1/Users/GetUserDetail': ({ body, loadFixture }) => {
    const listFixture = loadFixture('/v1/Users/GetUserPageList');
    const list = listFixture?.data?.list ?? [];
    return wrapOk(findById(list, body.userId, 'userId'));
  },

  '/v1/Users/GetUserBankCardPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/v1/Users/GetUPIPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/v1/Users/GetUserCpfPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/v1/Users/GetUserRealNamePageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/v1/Users/GetUserUsdtPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/v1/Users/GetUserWalletPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/v1/Users/GetSubsetUserPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/v1/Users/GetUserRelativePageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },

  // Type lists — return as-is (no pagination, just arrays)
  '/v1/Users/GetBankTypeList': ({ fixture }) => fixture,
  '/v1/Users/GetCpfTypeList': ({ fixture }) => fixture,
  '/v1/Users/GetUsdtTypeList': ({ fixture }) => fixture,
  '/v1/Users/GetWalletTypeList': ({ fixture }) => fixture,

  '/v1/Users/GetUserBetTotal': ({ fixture }) => fixture,
};
```

- [ ] **Step 2: Create v1-system.ts**

```ts
// apps/backend-mock/utils/ar-handlers/tenant/v1-system.ts
import { paginate, wrapOk } from '../../ar-mock-utils';
import type { ArHandlerMap } from '../index';

export const tenantV1SystemHandlers: ArHandlerMap = {
  '/v1/System/GetPlatformLogPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/v1/System/GetWebLogPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/v1/Finance/GetTabBanksPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(paginate(fixture.data.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10));
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add apps/backend-mock/utils/ar-handlers/tenant/v1-users.ts \
        apps/backend-mock/utils/ar-handlers/tenant/v1-system.ts
git commit -m "feat(mock): tenant v1/Users + v1/System handlers"
```

---

## Task 8: Registry — ar-handlers/index.ts

**Files:**
- Create: `apps/backend-mock/utils/ar-handlers/index.ts`

This task defines `ArHandler`, `ArHandlerMap`, and `dispatchArHandler`. All module files import `ArHandlerMap` from here, so TypeScript errors from previous tasks will resolve after this task.

- [ ] **Step 1: Create index.ts**

```ts
// apps/backend-mock/utils/ar-handlers/index.ts
import { loadArFixture, resolveMode } from '../ar-fixtures';
import { genericHandler } from './_generic';
import { adminCommonHandlers } from './admin/common';
import { adminMenuTreeHandlers } from './admin/menu-tree';
import { adminOrgTenantHandlers } from './admin/org-tenant';
import { adminRoleHandlers } from './admin/role';
import { adminSysUsersHandlers } from './admin/sys-users';
import { tenantPaymentHandlers } from './tenant/payment';
import { tenantRechargeHandlers } from './tenant/recharge';
import { tenantV1SystemHandlers } from './tenant/v1-system';
import { tenantV1UsersHandlers } from './tenant/v1-users';
import { tenantWithdrawHandlers } from './tenant/withdraw';

export type ArHandler = (ctx: {
  body: Record<string, any>;
  fixture: any;
  loadFixture: (path: string) => any;
}) => any;

export type ArHandlerMap = Record<string, ArHandler>;

const registry: Record<'admin' | 'tenant', ArHandlerMap> = {
  admin: {
    ...adminSysUsersHandlers,
    ...adminRoleHandlers,
    ...adminOrgTenantHandlers,
    ...adminCommonHandlers,
    ...adminMenuTreeHandlers,
  },
  tenant: {
    ...tenantWithdrawHandlers,
    ...tenantRechargeHandlers,
    ...tenantPaymentHandlers,
    ...tenantV1UsersHandlers,
    ...tenantV1SystemHandlers,
  },
};

export function dispatchArHandler(
  domainUrl: string,
  apiPath: string,
  body: Record<string, any>,
): unknown {
  const mode = resolveMode(domainUrl);
  const fixture = loadArFixture(domainUrl, apiPath);

  const makeLoadFixture = (m: 'admin' | 'tenant') => (path: string) =>
    loadArFixture(m === 'admin' ? 'https://sit-adminapi.lottotest6688.com' : 'https://sit-tenantadmin.lottotest6688.com', path);

  const handler = registry[mode]?.[apiPath];
  if (handler) {
    return handler({ body, fixture, loadFixture: makeLoadFixture(mode) });
  }

  // Tier 2: generic fallback
  const result = genericHandler({ body, fixture });
  if (result !== null) return result;

  // Write-op stub
  return { code: 0, data: null, msg: 'ok' };
}
```

- [ ] **Step 2: Export `resolveMode` from ar-fixtures.ts**

Check if `resolveMode` is currently exported:

```bash
grep "export.*resolveMode" apps/backend-mock/utils/ar-fixtures.ts
```

If not exported (likely since it's currently a module-private function), add `export`:

```ts
// In apps/backend-mock/utils/ar-fixtures.ts, change:
function resolveMode(domainUrl = ''): 'admin' | 'tenant' {
// to:
export function resolveMode(domainUrl = ''): 'admin' | 'tenant' {
```

- [ ] **Step 3: Verify TypeScript compiles with no errors in ar-handlers/**

```bash
cd apps/backend-mock && npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "ar-handlers|ar-mock-utils|ar-fixtures" | head -20
```

Expected: no output (no errors).

- [ ] **Step 4: Commit**

```bash
git add apps/backend-mock/utils/ar-handlers/index.ts \
        apps/backend-mock/utils/ar-fixtures.ts
git commit -m "feat(mock): ar-handlers registry — dispatchArHandler with two-tier resolution"
```

---

## Task 9: Update [...ar].ts — wire in dispatchArHandler

**Files:**
- Modify: `apps/backend-mock/api/[...ar].ts`

- [ ] **Step 1: Replace the file contents**

Current content:
```ts
// apps/backend-mock/api/[...ar].ts
import { defineEventHandler, getHeader, getRequestURL } from 'h3';
import { loadArFixture } from '~/utils/ar-fixtures';

export default defineEventHandler((event) => {
  const domainUrl = getHeader(event, 'domainUrl') ?? '';
  const apiPath = getRequestURL(event).pathname.replace(/^\/api/, '') || '/';

  const fixture = loadArFixture(domainUrl, apiPath);
  if (fixture !== null) {
    return fixture;
  }

  return { code: 0, data: null, msg: 'ok (mock stub)' };
});
```

Replace with:
```ts
// apps/backend-mock/api/[...ar].ts
import { defineEventHandler, getHeader, getRequestURL, readBody } from 'h3';
import { dispatchArHandler } from '~/utils/ar-handlers/index';

export default defineEventHandler(async (event) => {
  const domainUrl = getHeader(event, 'domainUrl') ?? '';
  const apiPath = getRequestURL(event).pathname.replace(/^\/api/, '') || '/';
  const body = await readBody(event).catch(() => ({})) as Record<string, any>;

  return dispatchArHandler(domainUrl, apiPath, body ?? {});
});
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd apps/backend-mock && npx tsc --noEmit --skipLibCheck 2>&1 | grep "\[\.\.\.ar\]" | head -5
```

Expected: no output.

- [ ] **Step 3: Start mock server and do a quick smoke test**

```bash
pnpm --filter @vben/backend-mock dev &
sleep 3
# Test admin list endpoint with pageNo
curl -s -X POST http://localhost:5320/api/Organization/GetPageList \
  -H 'Content-Type: application/json' \
  -H 'domainUrl: https://sit-adminapi.lottotest6688.com' \
  -d '{"pageNo":1,"pageSize":2,"orderBy":"Desc"}' | python3 -m json.tool
```

Expected: `{ "code": 0, "data": { "list": [...2 items...], "totalCount": 5, "pageNo": 1 }, "msg": "" }`

- [ ] **Step 4: Test page 2**

```bash
curl -s -X POST http://localhost:5320/api/Organization/GetPageList \
  -H 'Content-Type: application/json' \
  -H 'domainUrl: https://sit-adminapi.lottotest6688.com' \
  -d '{"pageNo":2,"pageSize":2,"orderBy":"Desc"}' | python3 -m json.tool
```

Expected: `list` contains items 3-4 (different from page 1), `totalCount` still 5.

- [ ] **Step 5: Test keyword filter**

```bash
curl -s -X POST http://localhost:5320/api/Organization/GetPageList \
  -H 'Content-Type: application/json' \
  -H 'domainUrl: https://sit-adminapi.lottotest6688.com' \
  -d '{"pageNo":1,"pageSize":20,"name":"nonexistentxyz","orderBy":"Desc"}' | python3 -m json.tool
```

Expected: `{ "data": { "list": [], "totalCount": 0 } }`.

- [ ] **Step 6: Test write-op stub**

```bash
curl -s -X POST http://localhost:5320/api/Role/Add \
  -H 'Content-Type: application/json' \
  -H 'domainUrl: https://sit-adminapi.lottotest6688.com' \
  -d '{"name":"test"}' | python3 -m json.tool
```

Expected: `{ "code": 0, "data": null, "msg": "ok" }`.

- [ ] **Step 7: Kill mock server and commit**

```bash
kill %1 2>/dev/null || true
git add apps/backend-mock/api/[...ar].ts
git commit -m "feat(mock): wire dispatchArHandler into [...ar].ts — dynamic mock active"
```

---

## Task 10: Re-capture broken tenant fixtures

Many tenant fixtures have error codes from the original capture (auth expiry, wrong params). This task fixes `tenant-read.ts` based on old project page code, then re-runs the capture script.

**Files:**
- Modify: `apps/web-ar-admin/tools/endpoints/tenant-read.ts`

- [ ] **Step 1: Identify which fixtures are broken**

```bash
for f in $(find apps/web-ar-admin/tools/mock-fixtures/tenant -name "*.json" ! -name "capture-log.json"); do
  code=$(python3 -c "import json; d=json.load(open('$f')); print(d.get('code','?'))" 2>/dev/null)
  if [ "$code" != "0" ]; then
    rel="${f##*/mock-fixtures/tenant/}"
    echo "code=$code  $rel"
  fi
done | sort
```

Expected output (endpoints needing re-capture):
```
code=11  Auth/CheckAuth
code=11  WithdrawOrder/GetAuditPageList
code=14  Common/GetDateTimeScopeTypes
code=14  RechargeCategory/GetPageList
code=14  RechargeLocalBank/GetPageList
code=14  RechargeLocalEWallet/GetPageList
code=14  RechargeLocalUpi/GetPageList
code=14  RechargeLocalUsdt/GetPageList
code=14  WithdrawCategory/GetPageList
code=14  WithdrawOrder/GetPageList
code=14  WithdrawRecord/GetPageList
code=14  v1/Finance/GetTabBanksPageList
code=14  v1/System/GetPlatformLogPageList
code=14  v1/System/GetWebLogPageList
code=14  v1/Users/GetOnlineUserPageList
code=14  v1/Users/GetSubsetUserPageList
code=14  v1/Users/GetUPIPageList
code=14  v1/Users/GetUserBankCardPageList
code=14  v1/Users/GetUserCpfPageList
code=14  v1/Users/GetUserDetail
code=14  v1/Users/GetUserPageList
code=14  v1/Users/GetUserRealNamePageList
code=14  v1/Users/GetUserRelativePageList
code=14  v1/Users/GetUserUsdtPageList
code=14  v1/Users/GetUserWalletPageList
code=7   PaymentReport/GetChannelPageList
code=7   PaymentReport/GetTenantPageList
code=7   WithdrawChannel/GetPageList
code=7   WithdrawStaticDay/GetPageList
code=7   v1/Users/GetBankTypeList
code=7   v1/Users/GetCpfTypeList
code=7   v1/Users/GetUsdtTypeList
code=7   v1/Users/GetUserBetTotal
code=7   v1/Users/GetWalletTypeList
```

- [ ] **Step 2: Check old project pages for correct params of code=7 endpoints**

`code=7` means invalid params. Check what each page actually sends:

```bash
# WithdrawStaticDay
grep -A10 "WithdrawStaticDay\|staticDay" \
  /Users/cola/Documents/gs/feat1-ar_platform_admin/src/views/finance/withdrawOrder/dashboard/index.vue 2>/dev/null | head -15

# WithdrawChannel
grep -A10 "WithdrawChannel\|withdrawChannel" \
  /Users/cola/Documents/gs/feat1-ar_platform_admin/src/api/withdraw/index.ts 2>/dev/null | grep -A8 "GetPageList" | head -15

# PaymentReport
find /Users/cola/Documents/gs/feat1-ar_platform_admin/src/views -name "*.vue" | \
  xargs grep -l "PaymentReport\|paymentReport" 2>/dev/null | head -3

# v1/Users type lists (GetBankTypeList etc.)
grep -A5 "GetBankTypeList\|getBankTypeList" \
  /Users/cola/Documents/gs/feat1-ar_platform_admin/src/api/v1platform/index.ts 2>/dev/null | head -10

# GetUserBetTotal
grep -A5 "GetUserBetTotal\|getUserBetTotal" \
  /Users/cola/Documents/gs/feat1-ar_platform_admin/src/api/v1platform/index.ts 2>/dev/null | head -10
```

Read the output. For each endpoint with code=7, compare the body sent in the current `tenant-read.ts` vs what the old project page actually sends.

- [ ] **Step 3: Fix tenant-read.ts for code=7 endpoints**

Open `apps/web-ar-admin/tools/endpoints/tenant-read.ts` and correct the body for each failing endpoint based on what you found in Step 2.

Common patterns to check:
- `WithdrawStaticDay/GetPageList`: may not want `tenantId`, needs a `dateType` field
- `WithdrawChannel/GetPageList`: needs `tenantId` AND `channelId: 0` or similar
- `PaymentReport/*`: needs specific date range params
- `v1/Users/GetBankTypeList` etc.: may need `tenantId: 0` in signed body, or none at all
- `v1/Users/GetUserBetTotal`: needs `userId: <validId>`, `pageNo: 0, pageSize: 0`

After editing, verify the change makes sense by comparing with the old project API types:
```bash
grep -A15 "WithdrawStaticDay\|WithdrawChannel\|PaymentReport" \
  /Users/cola/Documents/gs/feat1-ar_platform_admin/src/api/withdraw/types.ts | head -40
```

- [ ] **Step 4: Re-run capture for tenant**

```bash
cd apps/web-ar-admin
pnpm exec esno tools/capture-mock-data.ts --mode tenant
```

Expected: watch the console output. Most endpoints should now show `✓` or `ok`.

- [ ] **Step 5: Verify fixed fixtures**

```bash
for f in $(find tools/mock-fixtures/tenant -name "*.json" ! -name "capture-log.json"); do
  code=$(python3 -c "import json; d=json.load(open('$f')); print(d.get('code','?'))" 2>/dev/null)
  if [ "$code" != "0" ]; then
    rel="${f##*/mock-fixtures/tenant/}"
    echo "STILL BROKEN code=$code  $rel"
  fi
done
```

Expected: hub/ai/event endpoints still show non-zero codes (they're a different service — that's correct). All `/WithdrawOrder/`, `/Recharge*/`, `/v1/Users/` should now be `code=0`.

- [ ] **Step 6: Commit**

```bash
git add apps/web-ar-admin/tools/mock-fixtures/tenant/ \
        apps/web-ar-admin/tools/endpoints/tenant-read.ts
git commit -m "fix(mock): re-capture broken tenant fixtures — fix params for code=14/7 endpoints"
```

---

## Task 11: Admin role fixture re-capture

The `admin/Role/GetPageList` fixture has `code=-1` (DB error). Re-capture it.

**Files:**
- Modify: `apps/web-ar-admin/tools/mock-fixtures/admin/Role/GetPageList.json` (replaced by capture)

- [ ] **Step 1: Check current Role/GetPageList fixture**

```bash
cat apps/web-ar-admin/tools/mock-fixtures/admin/Role/GetPageList.json
```

Expected: `{ "code": -1, "msg": "数据库异常", ... }` — broken capture.

- [ ] **Step 2: Verify admin-read.ts Role params**

```bash
grep -A8 "Role/GetPageList" apps/web-ar-admin/tools/endpoints/admin-read.ts
```

Confirm the body shape is: `{ pageNo: 1, pageSize: 20, orderBy: 'Desc', sortField: 'id' }` (no extra fields). If different, fix to match what the role page actually sends (confirmed from role.vue in old project).

- [ ] **Step 3: Re-run admin capture**

```bash
cd apps/web-ar-admin
pnpm exec esno tools/capture-mock-data.ts --mode admin
```

- [ ] **Step 4: Verify Role/GetPageList is now code=0**

```bash
python3 -c "import json; d=json.load(open('tools/mock-fixtures/admin/Role/GetPageList.json')); print(d.get('code'), len(d.get('data',{}).get('list',[])))"
```

Expected: `0 <N>` where N > 0.

- [ ] **Step 5: Commit**

```bash
git add apps/web-ar-admin/tools/mock-fixtures/admin/
git commit -m "fix(mock): re-capture admin Role/GetPageList — was code=-1 DB error"
```

---

## Task 12: End-to-end verification

- [ ] **Step 1: Start mock server**

```bash
pnpm --filter @vben/backend-mock dev &
sleep 3
```

- [ ] **Step 2: Test admin pagination (Role)**

```bash
curl -s -X POST http://localhost:5320/api/Role/GetPageList \
  -H 'Content-Type: application/json' \
  -H 'domainUrl: https://sit-adminapi.lottotest6688.com' \
  -d '{"pageNo":1,"pageSize":5,"orderBy":"Desc","sortField":"id"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print('code:', d['code'], 'count:', d['data']['totalCount'] if d.get('data') else 'N/A')"
```

Expected: `code: 0  count: <N>`

- [ ] **Step 3: Test admin keyword filter (SysUsers)**

```bash
curl -s -X POST http://localhost:5320/api/SysUsers/GetAdminPageList \
  -H 'Content-Type: application/json' \
  -H 'domainUrl: https://sit-adminapi.lottotest6688.com' \
  -d '{"pageNo":1,"pageSize":10,"userName":"nonexist_xyz"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print('code:', d['code'], 'list_len:', len(d.get('data',{}).get('list',[])))"
```

Expected: `code: 0  list_len: 0`

- [ ] **Step 4: Test tenant list (WithdrawConfigGroup)**

```bash
curl -s -X POST http://localhost:5320/api/WithdrawConfigGroup/GetPageList \
  -H 'Content-Type: application/json' \
  -H 'domainUrl: https://sit-tenantadmin.lottotest6688.com' \
  -d '{"pageNo":1,"pageSize":5,"orderBy":"Desc","tenantId":0}' | python3 -c "import sys,json; d=json.load(sys.stdin); print('code:', d['code'], 'count:', d.get('data',{}).get('totalCount','?'))"
```

Expected: `code: 0  count: <N>`

- [ ] **Step 5: Test write-op stub**

```bash
curl -s -X POST http://localhost:5320/api/Role/Add \
  -H 'Content-Type: application/json' \
  -H 'domainUrl: https://sit-adminapi.lottotest6688.com' \
  -d '{"name":"test_role"}' | python3 -m json.tool
```

Expected: `{ "code": 0, "data": null, "msg": "ok" }`

- [ ] **Step 6: Test static dict (passthrough)**

```bash
curl -s -X POST http://localhost:5320/api/Common/GetDictionary \
  -H 'Content-Type: application/json' \
  -H 'domainUrl: https://sit-adminapi.lottotest6688.com' \
  -d '{}' | python3 -c "import sys,json; d=json.load(sys.stdin); print('code:', d['code'], 'type(data):', type(d.get('data')).__name__)"
```

Expected: `code: 0  type(data): dict` (or `list`)

- [ ] **Step 7: Kill server and final commit**

```bash
kill %1 2>/dev/null || true
```

No new files to commit — just note in the tracker that mock is complete.

---

## Self-Review

**Spec coverage check:**
- ✅ Two-tier dispatch (Tier 1 registry + Tier 2 generic) → Tasks 2, 8
- ✅ `ar-mock-utils.ts` with all four functions → Task 1
- ✅ Admin handlers: SysUsers, Role, Org+Tenant, IpWhitelist/SysLog/SysDict, MenuTree → Tasks 3, 4
- ✅ Tenant handlers: Withdraw, Recharge, Payment, v1/Users, v1/System → Tasks 5, 6, 7
- ✅ Registry index.ts → Task 8
- ✅ [...ar].ts async + readBody → Task 9
- ✅ Re-capture broken tenant fixtures → Task 10
- ✅ Re-capture admin Role fixture → Task 11
- ✅ Write-op stub policy → handled by dispatchArHandler fallback (no registry match + no fixture)
- ✅ hub/ai/event passthrough as-is → generic handler returns fixture with error code as-is
- ✅ No faker / no real write requests → confirmed by policy

**Type consistency check:**
- `ArHandler` defined in `index.ts`, imported in all module files ✅
- `loadFixture` passed as `(path: string) => any` consistently in `GetInfo`/`GetUserDetail` handlers ✅
- `paginate()` return shape matches `CrudRequestResult` (`list`, `totalCount`, `pageNo`) ✅
