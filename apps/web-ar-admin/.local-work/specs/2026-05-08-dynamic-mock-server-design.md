# Dynamic Mock Server Design

> **For agentic workers:** This spec is paired with an implementation plan. Follow that plan task by task.

**Goal:** Upgrade `apps/backend-mock` from static JSON file responses to parameter-aware dynamic mock — supporting pagination, keyword filtering, and ID lookup — for all admin and tenant read endpoints.

---

## Background

The current mock is a single catch-all handler (`api/[...ar].ts`) that reads a JSON fixture file and returns it verbatim, ignoring all request parameters. This means:

- Pagination always returns the same page regardless of `pageNo`
- Search/filter params have no effect
- Detail lookups (`GetInfo`, `Get`) always return the same record

The fixture data lives in `apps/web-ar-admin/tools/mock-fixtures/{admin,tenant}/`.

---

## Current Fixture State

### Admin (35 files)

All fixtures captured successfully (`code=0`) except:

- `Role/GetPageList` — `code=-1` DB error (must re-capture)

Key list fixtures with usable data: `SysUsers/GetAdminPageList` (5), `SysUsers/GetTenantPageList`, `Organization/GetPageList` (5), `Tenant/GetPageList` (10), `IpWhitelist/GetPageList` (6), `SysLog/GetPageList` (20), `Country/GetPageList`, `Currency/GetPageList`, `Language/GetPageList`, `SysDictionary/GetPageList`

### Tenant (60 files)

Only ~10 fixtures have `code=0`. ~40+ have error codes from failed captures:

- `code=14` — auth/session expired at capture time (most tenant list endpoints)
- `code=7` — invalid params (PaymentReport, WithdrawChannel, WithdrawStaticDay, v1/Users type lists)
- `code=11` — business logic error (Auth/CheckAuth, WithdrawOrder/GetAuditPageList)
- `code=400/401/404` — hub/ai/event endpoints (separate service, not AR backend)

**Implication:** Broken tenant fixtures must be re-captured with correct params (derived from old project pages) as part of this implementation. The dynamic handler infrastructure handles them automatically once re-captured.

---

## Architecture

### Two-Tier Dispatch

```
[...ar].ts (thin)
    │
    ▼
dispatchArHandler(mode, apiPath, body)
    │
    ├─ Tier 1: Module handler exists? → call it (custom filter logic)
    │
    ├─ Tier 2: Generic handler → auto-paginate if fixture has data.list
    │                          → return as-is otherwise
    │
    └─ No fixture → { code: 0, data: null, msg: 'ok' }   ← write-op stub
```

### File Structure

```
apps/backend-mock/
  api/[...ar].ts                    ← thin: read body, call dispatch, return
  utils/ar-fixtures.ts              ← existing (unchanged)
  utils/ar-handlers/
    index.ts                        ← registry + dispatchArHandler()
    _generic.ts                     ← generic pagination + passthrough handler
    admin/
      sys-users.ts                  ← SysUsers (filter by userName/keyword)
      role.ts                       ← Role (filter by keyword→name)
      org-tenant.ts                 ← Organization + Tenant (filter by name)
      menu-tree.ts                  ← GetMenuTreeByRoleId (match roleId)
      common.ts                     ← IpWhitelist, SysLog, SysDictionary
    tenant/
      withdraw.ts                   ← WithdrawOrder + WithdrawRecord + WithdrawCategory + WithdrawChannel + WithdrawConfigGroup
      recharge.ts                   ← Recharge* modules
      payment.ts                    ← ThirdPayMerchant + PaymentReport
      v1-users.ts                   ← v1/Users/* (filter by userId, keyword)
      v1-system.ts                  ← v1/System/* logs
  utils/ar-mock-utils.ts            ← shared: paginate / filterByFields / findById / wrapOk
```

### Handler Contract

```ts
type ArHandler = (ctx: {
  body: Record<string, any>;
  fixture: any; // full fixture JSON (may be null)
  fixtures: Record<string, any>; // all fixtures for this mode, keyed by path
}) => any;

type ArHandlerMap = Record<string, ArHandler>;
```

### Registry (index.ts)

```ts
const registry: Record<'admin' | 'tenant', ArHandlerMap> = {
  admin: { ...adminSysUsersHandlers, ...adminRoleHandlers, ... },
  tenant: { ...tenantWithdrawHandlers, ...tenantRechargeHandlers, ... },
};

export function dispatchArHandler(
  domainUrl: string,
  apiPath: string,
  body: Record<string, any>,
): unknown | null {
  const mode = resolveMode(domainUrl);       // 'admin' | 'tenant'
  const handler = registry[mode]?.[apiPath];
  const fixture = loadArFixture(domainUrl, apiPath);

  if (handler) {
    return handler({ body, fixture, fixtures: allFixtures[mode] });
  }
  return genericHandler({ body, fixture });  // Tier 2
}
```

---

## ar-mock-utils.ts API

```ts
// Slice list for current page, return CrudRequestResult shape
function paginate(
  list: any[],
  pageNo: number,
  pageSize: number,
): {
  list: any[];
  pageNo: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
};

// Filter list items where any of `fields` contains `keyword` (case-insensitive)
function filterByFields(
  list: any[],
  keyword: string | undefined,
  fields: string[],
): any[];

// Find single item by id field value; returns first item if not found
function findById(list: any[], id: any, idField: string): any | null;

// Wrap data in standard success envelope
function wrapOk(data: any): { code: 0; data: any; msg: '' };
```

---

## Generic Handler (\_generic.ts)

Covers all endpoints NOT in the module handler registry:

1. If `fixture` is `null` → return `null` (caller returns write stub)
2. If `fixture.code !== 0` → return `fixture` as-is (preserve error responses)
3. If `fixture.data` has `list` field AND `body.pageNo` exists → paginate and return
4. Otherwise → return `fixture` as-is (trees, dicts, single objects)

---

## Module Handler Examples

### admin/role.ts

```ts
'/Role/GetPageList': ({ body, fixture }) => {
  if (!fixture || fixture.code !== 0) return fixture;
  const filtered = filterByFields(fixture.data.list, body.keyword, ['name']);
  return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 20));
},
```

### admin/sys-users.ts

```ts
'/SysUsers/GetAdminPageList': ({ body, fixture }) => {
  const filtered = filterByFields(fixture.data.list, body.userName, ['userName', 'nickName']);
  return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 10));
},
'/SysUsers/GetInfo': ({ body, fixtures }) => {
  const list = fixtures['/SysUsers/GetAdminPageList']?.data?.list ?? [];
  return wrapOk(findById(list, body.userId, 'userId'));
},
```

### admin/menu-tree.ts

```ts
'/Menu/GetMenuTreeByRoleId': ({ body, fixture }) => {
  // Return full tree regardless of roleId (mock doesn't have per-role data)
  return fixture;
},
```

### tenant/withdraw.ts

```ts
'/WithdrawOrder/GetPageList': ({ body, fixture }) => {
  if (!fixture || fixture.code !== 0) return fixture;
  let list = fixture.data.list;
  if (body.tenantId) list = list.filter((i: any) => i.tenantId === body.tenantId);
  return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
},
```

---

## Parameter Source: Old Project Pages

For each module handler, derive the actual request params from the old project's page code (not API types), since types are auto-generated and may be inaccurate.

**Reference path:** `/Users/cola/Documents/gs/feat1-ar_platform_admin/src/views/<module>/`

Key params confirmed from old project pages:

| Endpoint | Filter field(s) | Notes |
| --- | --- | --- |
| `/Role/GetPageList` | `keyword` → `name` field | `orderBy:'Desc', sortField:'id'` |
| `/SysUsers/GetAdminPageList` | `userName` → `userName, nickName` |  |
| `/Organization/GetPageList` | `name` → `name` | `orderBy:'Desc'` |
| `/Tenant/GetPageList` | `keyword` → `name` |  |
| `/IpWhitelist/GetPageList` | `ip` → `ip` |  |
| `/SysLog/GetPageList` | `keyword` → `userName, operationDesc` |  |
| `/WithdrawOrder/GetPageList` | `tenantId`, `withdrawStates` | array filter |

---

## Re-Capture Strategy for Broken Fixtures

Fixtures with `code=14` need re-capture with the correct `tenantId` in the signed body. Process:

1. Run `tools/capture-mock-data.ts` for each broken endpoint module
2. Verify `code=0` in output before committing
3. Broken fixtures that succeed → replaced; those that still fail → left as error stubs

**Endpoints to re-capture (tenant, code=14):** `WithdrawOrder/GetPageList`, `WithdrawOrder/GetAuditPageList`, `WithdrawRecord/GetPageList`, `RechargeCategory/GetPageList`, `RechargeLocal*/GetPageList`, `v1/Users/*`

---

## Write Operation Policy

Any endpoint path NOT present in `registry[mode]` and NOT matching a fixture file → returns:

```json
{ "code": 0, "data": null, "msg": "ok" }
```

Write operation paths are never registered in the handler maps. No real requests are made to the test environment.

---

## Updated [...]ar.ts

```ts
export default defineEventHandler(async (event) => {
  const domainUrl = getHeader(event, 'domainUrl') ?? '';
  const apiPath = getRequestURL(event).pathname.replace(/^\/api/, '') || '/';
  const body = await readBody(event).catch(() => ({}));

  const result = dispatchArHandler(domainUrl, apiPath, body);
  if (result !== null) return result;

  return { code: 0, data: null, msg: 'ok' };
});
```

Note: `loadArFixture` is now called inside `dispatchArHandler` (Tier 2 fallback), not in `[...ar].ts`.

---

## Out of Scope

- hub / ai / event endpoints (different backend service, return 400/401/404 stubs as-is)
- Mutation endpoints (create/update/delete) — always stub
- Generating fake data beyond what's in fixtures
- Auth/login endpoints (handled by existing `api/auth/` handlers)
