# Mock 数据录制与 Mock Server 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 录制真实 SIT 接口的响应数据，搭建本地 Nitro Mock Server，让 web-ar-admin 在无网络/无权限时也能完整运行。

**Architecture:** 捕获脚本（esno）登录两套 backend（ADMIN: sys_milo / TENANT: org_milo），对所有只读接口发签名请求，将响应保存为 JSON fixtures。Nitro catch-all handler 读取 fixtures，通过请求头 `domainUrl` 区分 admin/tenant 数据集。vite.config.ts 在 `VITE_NITRO_MOCK=true` 时把 proxy 指向 localhost:5320。

**Tech Stack:** esno · node:crypto（MD5 签名）· Nitro（h3）· fetch API

---

## 文件结构

```
apps/web-ar-admin/tools/
├── lib/
│   ├── sign.ts                  新建：复现 request.ts 的签名逻辑（node:crypto）
│   └── capture-client.ts        新建：带签名+token 的 fetch 封装
├── endpoints/
│   ├── admin-read.ts            新建：ADMIN 只读接口清单
│   └── tenant-read.ts           新建：TENANT 只读接口清单
├── capture-mock-data.ts         新建：主捕获脚本（esno 运行）
└── mock-fixtures/               自动生成（.gitignore 追加）
    ├── admin/                   sys_milo 的响应快照
    │   ├── capture-log.json     成功/失败记录
    │   └── **/*.json            按路径存储（Login/Login.json 等）
    └── tenant/                  org_milo 的响应快照
        ├── capture-log.json
        └── **/*.json

apps/backend-mock/
├── utils/
│   └── ar-fixtures.ts           新建：从 mock-fixtures 目录读取 fixture
└── api/
    └── [...ar].ts               新建：AR admin catch-all handler（检查 domainUrl）

apps/web-ar-admin/
├── vite.config.ts               修改：VITE_NITRO_MOCK=true 时 proxy → localhost:5320
└── .env.development             修改（或新建）：添加 VITE_NITRO_MOCK=true 本地开关
```

---

## 只读接口清单概览

**原则：只调用名称含 Get/List/Detail/Check/Health/Stats/Metrics/Info/All/Options/Search/Config/Sites/Trend/Summary/Nodes/Flow/Context 的接口，以及登录接口。**

### ADMIN（~65 个）

| 路径 | 默认参数 |
| --- | --- |
| `POST /Login/Login` | `{userName:'sys_milo',pwd:'12345678'}` |
| `POST /Home/GetSysUserInfo` | `{}` |
| `POST /Home/GetVersion` | `{}` |
| `POST /Home/CheckHealth` | `{}` |
| `POST /Login/HomeBasic` | `{}` |
| `GET  /.well-known/openid-configuration` | — |
| `POST /Auth/CheckAuth` | `{}` |
| `POST /Auth/GetOrgTenantList` | `{}` |
| `POST /Common/GetDictionary` | `{}` |
| `POST /Common/GetPlatformDic` | `{}` |
| `POST /Common/GetDynamicDictionary` | `{key:'roleList'}` |
| `POST /Common/GetDateTimeScopeTypes` | `{}` |
| `POST /Common/GetListBasicTable` | `{}` |
| `POST /Common/GetSettingByKey` | `{key:'SiteSetting'}` |
| `POST /Common/GetListRedisKey` | `{keyPattern:'*',pageIndex:1,pageSize:20}` |
| `POST /IpWhitelist/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /Menu/Get` | `{}` |
| `POST /Role/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /SysDictionary/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /SysLog/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /SysUsers/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /SysUsers/GetAdminPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /SysUsers/GetTenantPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /SysUsers/GetSuperAuthUser` | `{}` |
| `POST /Country/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /Country/Get` | `{id:1}` ← ID 从 GetPageList 取 |
| `POST /Currency/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /Currency/Get` | `{id:1}` ← ID 从 GetPageList 取 |
| `POST /Language/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /Language/Get` | `{id:1}` ← ID 从 GetPageList 取 |
| `POST /Organization/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /Organization/Get` | `{id:1}` ← ID 从 GetPageList 取 |
| `POST /Tenant/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /Tenant/GetV3Mode` | `{}` |
| `POST /hub/domains/list` | `{page:1,pageSize:20}` |
| `POST /hub/assets/list` | `{page:1,pageSize:20}` |
| `POST /hub/jobs/list` | `{page:1,pageSize:20}` |
| `POST /hub/jobs/stats` | `{}` |
| `POST /hub/job-logs/list` | `{page:1,pageSize:20}` |
| `POST /hub/runners/list` | `{}` |
| `POST /hub/themes/list` | `{page:1,pageSize:20}` |
| `POST /hub/layouts/list` | `{page:1,pageSize:20}` |
| `POST /hub/tabbars/list` | `{page:1,pageSize:20}` |
| `POST /hub/merchant/sites` | `{}` |
| `POST /hub/web/config` | `{}` |
| `POST /hub/web/game` | `{}` |
| `POST /hub/debug/scheduler/org-tenant-list` | `{}` |
| `POST /event/metrics` | `{}` |
| `POST /event/options` | `{}` |
| `POST /event/admin/card-page` | `{}` |
| `POST /event/admin/project` | `{}` |
| `POST /event/admin/init/status` | `{}` |
| `POST /event/admin/alarm/stats` | `{}` |
| `POST /event/traffic/health` | `{}` |
| `POST /event/traffic/metrics` | `{}` |
| `POST /event/traffic/summary` | `{}` |
| `POST /event/traffic/trend` | `{}` |
| `POST /event/traffic/nodes` | `{}` |
| `POST /ai/metrics` | `{}` |
| `POST /ai/health` | `{}` |
| `POST /ai/chat/config` | `{}` |
| `POST /ai/chat/sessions` | `{page:1,pageSize:20}` |
| `POST /ai/knowledge/queue/stats` | `{}` |
| `POST /ai/knowledge/search` | `{q:'test',limit:5}` |
| `POST /ai/admin/escalation/stats` | `{}` |
| `POST /ai/admin/feedback/stats` | `{}` |
| `POST /ai/report/sessions` | `{page:1,pageSize:10}` |
| `POST /ai/report/alerts/config` | `{}` |
| `POST /ai/report/failed-queries` | `{page:1,pageSize:10}` |
| `POST /ai/report/planner/stats` | `{}` |
| `GET  /menu/all` | — |
| `GET  /user/info` | — |
| `GET  /auth/codes` | — |

### TENANT（~55 个）

| 路径 | 默认参数 |
| --- | --- |
| `POST /Login/Login` | `{userName:'org_milo',pwd:'12345678'}` |
| `POST /Home/GetSysUserInfo` | `{}` |
| `POST /Login/HomeBasic` | `{}` |
| `POST /Auth/CheckAuth` | `{}` |
| `POST /Auth/GetOrgTenantList` | `{}` |
| `POST /Common/GetDictionary` | `{}` |
| `POST /Common/GetPlatformDic` | `{}` |
| `POST /Common/GetDynamicDictionary` | `{key:'roleList'}` |
| `POST /Common/GetDateTimeScopeTypes` | `{}` |
| `POST /v1/Common/GetDictionary` | `{}` |
| `POST /RechargeCategory/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /RechargeChannel/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /RechargeLocalBank/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /RechargeLocalEWallet/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /RechargeLocalUpi/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /RechargeLocalUsdt/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /ThirdPayMerchant/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /WithdrawCategory/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /WithdrawChannel/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /WithdrawConfigGroup/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /WithdrawOrder/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /WithdrawOrder/GetAuditPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /WithdrawRecord/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /WithdrawStaticDay/GetPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /PaymentReport/GetChannelPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /PaymentReport/GetTenantPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /v1/Finance/GetTabBanksPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /v1/Users/GetUserPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /v1/Users/GetUserDetail` | `{userId:1}` ← ID 从 GetUserPageList 取 |
| `POST /v1/Users/GetUserBetTotal` | `{userId:1}` ← 同上 |
| `POST /v1/Users/GetUserBankCardPageList` | `{userId:1,pageIndex:1,pageSize:20}` |
| `POST /v1/Users/GetUserRelativePageList` | `{userId:1,pageIndex:1,pageSize:20}` |
| `POST /v1/Users/GetSubsetUserPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /v1/Users/GetOnlineUserPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /v1/Users/GetUPIPageList` | `{userId:1,pageIndex:1,pageSize:20}` |
| `POST /v1/Users/GetUserCpfPageList` | `{userId:1,pageIndex:1,pageSize:20}` |
| `POST /v1/Users/GetUserRealNamePageList` | `{userId:1,pageIndex:1,pageSize:20}` |
| `POST /v1/Users/GetUserUsdtPageList` | `{userId:1,pageIndex:1,pageSize:20}` |
| `POST /v1/Users/GetUserWalletPageList` | `{userId:1,pageIndex:1,pageSize:20}` |
| `POST /v1/Users/GetBankTypeList` | `{}` |
| `POST /v1/Users/GetCpfTypeList` | `{}` |
| `POST /v1/Users/GetUsdtTypeList` | `{}` |
| `POST /v1/Users/GetWalletTypeList` | `{}` |
| `POST /v1/System/GetPlatformLogPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /v1/System/GetWebLogPageList` | `{pageIndex:1,pageSize:20}` |
| `POST /hub/domains/list` | `{page:1,pageSize:20}` |
| `POST /hub/assets/list` | `{page:1,pageSize:20}` |
| `POST /hub/jobs/list` | `{page:1,pageSize:20}` |
| `POST /hub/jobs/stats` | `{}` |
| `POST /hub/themes/list` | `{page:1,pageSize:20}` |
| `POST /hub/layouts/list` | `{page:1,pageSize:20}` |
| `POST /hub/tabbars/list` | `{page:1,pageSize:20}` |
| `POST /hub/merchant/sites` | `{}` |
| `POST /hub/web/config` | `{}` |
| `POST /event/metrics` | `{}` |
| `POST /event/traffic/health` | `{}` |
| `POST /event/traffic/summary` | `{}` |
| `POST /ai/metrics` | `{}` |
| `POST /ai/health` | `{}` |
| `GET  /menu/all` | — |
| `GET  /user/info` | — |
| `GET  /auth/codes` | — |

---

## Task 1: 签名工具（tools/lib/sign.ts）

**Files:**

- Create: `apps/web-ar-admin/tools/lib/sign.ts`

- [ ] **Step 1: 创建 sign.ts**

```ts
// apps/web-ar-admin/tools/lib/sign.ts
import { createHash } from 'node:crypto';

function sortObjectForSign(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const keys = Object.keys(obj)
    .filter(
      (k) =>
        !Array.isArray(obj[k]) &&
        obj[k] !== '' &&
        obj[k] !== null &&
        obj[k] !== undefined,
    )
    .sort();
  for (const k of keys) {
    result[k] =
      obj[k] && typeof obj[k] === 'object'
        ? sortObjectForSign(obj[k] as Record<string, unknown>)
        : obj[k];
  }
  return result;
}

function removeArrayFields(value: unknown): unknown {
  if (Array.isArray(value)) return undefined;
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const next = removeArrayFields(v);
      if (next !== undefined) result[k] = next;
    }
    return result;
  }
  return value;
}

function randomInt(n: number): number {
  if (n <= 0) return -1;
  const limit = 10 ** n;
  const value = Math.floor(Math.random() * limit);
  if (value < limit / 10 && value !== 0) return randomInt(n);
  return value;
}

export function signBody(
  body: Record<string, unknown>,
): Record<string, unknown> {
  const language = 'zh';
  const random = randomInt(12);
  const withMeta = { ...body, language, random };
  const forSign = removeArrayFields(withMeta) as Record<string, unknown>;
  const sorted = sortObjectForSign(forSign);
  const signature = createHash('md5')
    .update(JSON.stringify(sorted))
    .digest('hex')
    .toUpperCase()
    .slice(0, 32);
  const timestamp = Math.floor(Date.now() / 1000);
  return { ...withMeta, signature, timestamp };
}
```

- [ ] **Step 2: 验证签名逻辑与 request.ts 一致**

对比 `apps/web-ar-admin/src/api/request.ts` 中的 `signBody` 函数逻辑，确认：

1. `sortObjectForSign` 过滤条件一致（排除 array、空字符串、null）
2. `removeArrayFields` 递归逻辑一致
3. MD5 算法：`node:crypto` vs SparkMD5，两者对同一输入应产生相同的 hex 字符串

---

## Task 2: HTTP 捕获客户端（tools/lib/capture-client.ts）

**Files:**

- Create: `apps/web-ar-admin/tools/lib/capture-client.ts`

- [ ] **Step 1: 创建 capture-client.ts**

```ts
// apps/web-ar-admin/tools/lib/capture-client.ts
import { signBody } from './sign.js';

export interface CaptureClientOptions {
  baseUrl: string; // e.g. https://sit-adminapi.lottotest6688.com
  domainUrl: string; // same as baseUrl (sent as header)
}

export class CaptureClient {
  private token = '';
  constructor(private opts: CaptureClientOptions) {}

  setToken(token: string) {
    this.token = token;
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      domainUrl: this.opts.domainUrl,
    };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    return headers;
  }

  async post<T = unknown>(
    path: string,
    body: Record<string, unknown> = {},
  ): Promise<T> {
    const signed = signBody(body);
    const res = await fetch(`${this.opts.baseUrl}${path}`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(signed),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
    return res.json() as Promise<T>;
  }

  async get<T = unknown>(path: string): Promise<T> {
    const res = await fetch(`${this.opts.baseUrl}${path}`, {
      method: 'GET',
      headers: this.buildHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
    return res.json() as Promise<T>;
  }
}
```

---

## Task 3: 只读接口清单文件

**Files:**

- Create: `apps/web-ar-admin/tools/endpoints/admin-read.ts`
- Create: `apps/web-ar-admin/tools/endpoints/tenant-read.ts`

- [ ] **Step 1: 创建 admin-read.ts**

```ts
// apps/web-ar-admin/tools/endpoints/admin-read.ts
export interface Endpoint {
  method: 'GET' | 'POST';
  path: string;
  body?: Record<string, unknown>;
  /** 若需要从其他接口取到 ID 才能调用，填写 dependsOn 的 path 和取 ID 的函数 */
  idFrom?: {
    listPath: string;
    extractId: (data: any) => Record<string, unknown>;
  };
}

export const ADMIN_READ_ENDPOINTS: Endpoint[] = [
  // ── Core auth ──────────────────────────────────────────────
  {
    method: 'POST',
    path: '/Login/Login',
    body: { userName: 'sys_milo', pwd: '12345678' },
  },
  { method: 'GET', path: '/menu/all' },
  { method: 'GET', path: '/user/info' },
  { method: 'GET', path: '/auth/codes' },
  { method: 'POST', path: '/Home/GetSysUserInfo', body: {} },
  { method: 'POST', path: '/Home/GetVersion', body: {} },
  { method: 'POST', path: '/Home/CheckHealth', body: {} },
  { method: 'POST', path: '/Login/HomeBasic', body: {} },
  { method: 'GET', path: '/.well-known/openid-configuration' },
  // ── Auth/Common ────────────────────────────────────────────
  { method: 'POST', path: '/Auth/CheckAuth', body: {} },
  { method: 'POST', path: '/Auth/GetOrgTenantList', body: {} },
  { method: 'POST', path: '/Common/GetDictionary', body: {} },
  { method: 'POST', path: '/Common/GetPlatformDic', body: {} },
  {
    method: 'POST',
    path: '/Common/GetDynamicDictionary',
    body: { key: 'roleList' },
  },
  { method: 'POST', path: '/Common/GetDateTimeScopeTypes', body: {} },
  { method: 'POST', path: '/Common/GetListBasicTable', body: {} },
  {
    method: 'POST',
    path: '/Common/GetSettingByKey',
    body: { key: 'SiteSetting' },
  },
  {
    method: 'POST',
    path: '/Common/GetListRedisKey',
    body: { keyPattern: '*', pageIndex: 1, pageSize: 20 },
  },
  // ── System ─────────────────────────────────────────────────
  {
    method: 'POST',
    path: '/IpWhitelist/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  { method: 'POST', path: '/Menu/Get', body: {} },
  {
    method: 'POST',
    path: '/Role/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/SysDictionary/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/SysLog/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/SysUsers/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/SysUsers/GetAdminPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/SysUsers/GetTenantPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  { method: 'POST', path: '/SysUsers/GetSuperAuthUser', body: {} },
  // ── Tenant mgmt ────────────────────────────────────────────
  {
    method: 'POST',
    path: '/Country/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/Country/Get',
    idFrom: {
      listPath: '/Country/GetPageList',
      extractId: (d) => ({ id: d?.data?.list?.[0]?.id ?? 1 }),
    },
  },
  {
    method: 'POST',
    path: '/Currency/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/Currency/Get',
    idFrom: {
      listPath: '/Currency/GetPageList',
      extractId: (d) => ({ id: d?.data?.list?.[0]?.id ?? 1 }),
    },
  },
  {
    method: 'POST',
    path: '/Language/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/Language/Get',
    idFrom: {
      listPath: '/Language/GetPageList',
      extractId: (d) => ({ id: d?.data?.list?.[0]?.id ?? 1 }),
    },
  },
  {
    method: 'POST',
    path: '/Organization/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/Organization/Get',
    idFrom: {
      listPath: '/Organization/GetPageList',
      extractId: (d) => ({ id: d?.data?.list?.[0]?.id ?? 1 }),
    },
  },
  {
    method: 'POST',
    path: '/Tenant/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  { method: 'POST', path: '/Tenant/GetV3Mode', body: {} },
  // ── Hub ────────────────────────────────────────────────────
  {
    method: 'POST',
    path: '/hub/domains/list',
    body: { page: 1, pageSize: 20 },
  },
  { method: 'POST', path: '/hub/assets/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/jobs/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/jobs/stats', body: {} },
  {
    method: 'POST',
    path: '/hub/job-logs/list',
    body: { page: 1, pageSize: 20 },
  },
  { method: 'POST', path: '/hub/runners/list', body: {} },
  { method: 'POST', path: '/hub/themes/list', body: { page: 1, pageSize: 20 } },
  {
    method: 'POST',
    path: '/hub/layouts/list',
    body: { page: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/hub/tabbars/list',
    body: { page: 1, pageSize: 20 },
  },
  { method: 'POST', path: '/hub/merchant/sites', body: {} },
  { method: 'POST', path: '/hub/web/config', body: {} },
  { method: 'POST', path: '/hub/web/game', body: {} },
  { method: 'POST', path: '/hub/debug/scheduler/org-tenant-list', body: {} },
  // ── Event ──────────────────────────────────────────────────
  { method: 'POST', path: '/event/metrics', body: {} },
  { method: 'POST', path: '/event/options', body: {} },
  { method: 'POST', path: '/event/admin/card-page', body: {} },
  { method: 'POST', path: '/event/admin/project', body: {} },
  { method: 'POST', path: '/event/admin/init/status', body: {} },
  { method: 'POST', path: '/event/admin/alarm/stats', body: {} },
  { method: 'POST', path: '/event/traffic/health', body: {} },
  { method: 'POST', path: '/event/traffic/metrics', body: {} },
  { method: 'POST', path: '/event/traffic/summary', body: {} },
  { method: 'POST', path: '/event/traffic/trend', body: {} },
  { method: 'POST', path: '/event/traffic/nodes', body: {} },
  // ── AI Assistant ────────────────────────────────────────────
  { method: 'POST', path: '/ai/metrics', body: {} },
  { method: 'POST', path: '/ai/health', body: {} },
  { method: 'POST', path: '/ai/chat/config', body: {} },
  {
    method: 'POST',
    path: '/ai/chat/sessions',
    body: { page: 1, pageSize: 20 },
  },
  { method: 'POST', path: '/ai/knowledge/queue/stats', body: {} },
  {
    method: 'POST',
    path: '/ai/knowledge/search',
    body: { q: 'test', limit: 5 },
  },
  { method: 'POST', path: '/ai/admin/escalation/stats', body: {} },
  { method: 'POST', path: '/ai/admin/feedback/stats', body: {} },
  {
    method: 'POST',
    path: '/ai/report/sessions',
    body: { page: 1, pageSize: 10 },
  },
  { method: 'POST', path: '/ai/report/alerts/config', body: {} },
  {
    method: 'POST',
    path: '/ai/report/failed-queries',
    body: { page: 1, pageSize: 10 },
  },
  { method: 'POST', path: '/ai/report/planner/stats', body: {} },
];
```

- [ ] **Step 2: 创建 tenant-read.ts**

```ts
// apps/web-ar-admin/tools/endpoints/tenant-read.ts
import type { Endpoint } from './admin-read.js';

export const TENANT_READ_ENDPOINTS: Endpoint[] = [
  // ── Core auth ──────────────────────────────────────────────
  {
    method: 'POST',
    path: '/Login/Login',
    body: { userName: 'org_milo', pwd: '12345678' },
  },
  { method: 'GET', path: '/menu/all' },
  { method: 'GET', path: '/user/info' },
  { method: 'GET', path: '/auth/codes' },
  { method: 'POST', path: '/Home/GetSysUserInfo', body: {} },
  { method: 'POST', path: '/Login/HomeBasic', body: {} },
  // ── Auth/Common ────────────────────────────────────────────
  { method: 'POST', path: '/Auth/CheckAuth', body: {} },
  { method: 'POST', path: '/Auth/GetOrgTenantList', body: {} },
  { method: 'POST', path: '/Common/GetDictionary', body: {} },
  { method: 'POST', path: '/Common/GetPlatformDic', body: {} },
  {
    method: 'POST',
    path: '/Common/GetDynamicDictionary',
    body: { key: 'roleList' },
  },
  { method: 'POST', path: '/Common/GetDateTimeScopeTypes', body: {} },
  { method: 'POST', path: '/v1/Common/GetDictionary', body: {} },
  // ── Recharge ───────────────────────────────────────────────
  {
    method: 'POST',
    path: '/RechargeCategory/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/RechargeChannel/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/RechargeLocalBank/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/RechargeLocalEWallet/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/RechargeLocalUpi/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/RechargeLocalUsdt/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/ThirdPayMerchant/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  // ── Withdraw ───────────────────────────────────────────────
  {
    method: 'POST',
    path: '/WithdrawCategory/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/WithdrawChannel/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/WithdrawConfigGroup/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/WithdrawOrder/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/WithdrawOrder/GetAuditPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/WithdrawRecord/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/WithdrawStaticDay/GetPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  // ── Report ─────────────────────────────────────────────────
  {
    method: 'POST',
    path: '/PaymentReport/GetChannelPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/PaymentReport/GetTenantPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  // ── v1 Finance ─────────────────────────────────────────────
  {
    method: 'POST',
    path: '/v1/Finance/GetTabBanksPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  // ── v1 Users ───────────────────────────────────────────────
  {
    method: 'POST',
    path: '/v1/Users/GetUserPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/v1/Users/GetUserDetail',
    idFrom: {
      listPath: '/v1/Users/GetUserPageList',
      extractId: (d) => ({
        userId: d?.data?.list?.[0]?.id ?? d?.data?.list?.[0]?.userId ?? 1,
      }),
    },
  },
  {
    method: 'POST',
    path: '/v1/Users/GetUserBetTotal',
    idFrom: {
      listPath: '/v1/Users/GetUserPageList',
      extractId: (d) => ({
        userId: d?.data?.list?.[0]?.id ?? d?.data?.list?.[0]?.userId ?? 1,
      }),
    },
  },
  {
    method: 'POST',
    path: '/v1/Users/GetUserBankCardPageList',
    idFrom: {
      listPath: '/v1/Users/GetUserPageList',
      extractId: (d) => ({
        userId: d?.data?.list?.[0]?.id ?? 1,
        pageIndex: 1,
        pageSize: 20,
      }),
    },
  },
  {
    method: 'POST',
    path: '/v1/Users/GetUserRelativePageList',
    idFrom: {
      listPath: '/v1/Users/GetUserPageList',
      extractId: (d) => ({
        userId: d?.data?.list?.[0]?.id ?? 1,
        pageIndex: 1,
        pageSize: 20,
      }),
    },
  },
  {
    method: 'POST',
    path: '/v1/Users/GetSubsetUserPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/v1/Users/GetOnlineUserPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/v1/Users/GetUPIPageList',
    idFrom: {
      listPath: '/v1/Users/GetUserPageList',
      extractId: (d) => ({
        userId: d?.data?.list?.[0]?.id ?? 1,
        pageIndex: 1,
        pageSize: 20,
      }),
    },
  },
  {
    method: 'POST',
    path: '/v1/Users/GetUserCpfPageList',
    idFrom: {
      listPath: '/v1/Users/GetUserPageList',
      extractId: (d) => ({
        userId: d?.data?.list?.[0]?.id ?? 1,
        pageIndex: 1,
        pageSize: 20,
      }),
    },
  },
  {
    method: 'POST',
    path: '/v1/Users/GetUserRealNamePageList',
    idFrom: {
      listPath: '/v1/Users/GetUserPageList',
      extractId: (d) => ({
        userId: d?.data?.list?.[0]?.id ?? 1,
        pageIndex: 1,
        pageSize: 20,
      }),
    },
  },
  {
    method: 'POST',
    path: '/v1/Users/GetUserUsdtPageList',
    idFrom: {
      listPath: '/v1/Users/GetUserPageList',
      extractId: (d) => ({
        userId: d?.data?.list?.[0]?.id ?? 1,
        pageIndex: 1,
        pageSize: 20,
      }),
    },
  },
  {
    method: 'POST',
    path: '/v1/Users/GetUserWalletPageList',
    idFrom: {
      listPath: '/v1/Users/GetUserPageList',
      extractId: (d) => ({
        userId: d?.data?.list?.[0]?.id ?? 1,
        pageIndex: 1,
        pageSize: 20,
      }),
    },
  },
  { method: 'POST', path: '/v1/Users/GetBankTypeList', body: {} },
  { method: 'POST', path: '/v1/Users/GetCpfTypeList', body: {} },
  { method: 'POST', path: '/v1/Users/GetUsdtTypeList', body: {} },
  { method: 'POST', path: '/v1/Users/GetWalletTypeList', body: {} },
  // ── v1 System logs ─────────────────────────────────────────
  {
    method: 'POST',
    path: '/v1/System/GetPlatformLogPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/v1/System/GetWebLogPageList',
    body: { pageIndex: 1, pageSize: 20 },
  },
  // ── Hub (same as admin) ────────────────────────────────────
  {
    method: 'POST',
    path: '/hub/domains/list',
    body: { page: 1, pageSize: 20 },
  },
  { method: 'POST', path: '/hub/assets/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/jobs/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/jobs/stats', body: {} },
  { method: 'POST', path: '/hub/themes/list', body: { page: 1, pageSize: 20 } },
  {
    method: 'POST',
    path: '/hub/layouts/list',
    body: { page: 1, pageSize: 20 },
  },
  {
    method: 'POST',
    path: '/hub/tabbars/list',
    body: { page: 1, pageSize: 20 },
  },
  { method: 'POST', path: '/hub/merchant/sites', body: {} },
  { method: 'POST', path: '/hub/web/config', body: {} },
  // ── Event ──────────────────────────────────────────────────
  { method: 'POST', path: '/event/metrics', body: {} },
  { method: 'POST', path: '/event/traffic/health', body: {} },
  { method: 'POST', path: '/event/traffic/summary', body: {} },
  // ── AI ─────────────────────────────────────────────────────
  { method: 'POST', path: '/ai/metrics', body: {} },
  { method: 'POST', path: '/ai/health', body: {} },
];
```

---

## Task 4: 主捕获脚本（tools/capture-mock-data.ts）

**Files:**

- Create: `apps/web-ar-admin/tools/capture-mock-data.ts`

- [ ] **Step 1: 创建主捕获脚本**

```ts
// apps/web-ar-admin/tools/capture-mock-data.ts
// Usage:
//   pnpm --filter web-ar-admin exec esno tools/capture-mock-data.ts --mode admin
//   pnpm --filter web-ar-admin exec esno tools/capture-mock-data.ts --mode tenant

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { ADMIN_READ_ENDPOINTS } from './endpoints/admin-read.js';
import { TENANT_READ_ENDPOINTS } from './endpoints/tenant-read.js';
import { CaptureClient } from './lib/capture-client.js';

const MODE = (process.argv
  .find((a) => a.startsWith('--mode='))
  ?.split('=')[1] ??
  (process.argv.includes('--mode')
    ? process.argv[process.argv.indexOf('--mode') + 1]
    : null) ??
  'admin') as 'admin' | 'tenant';

const CONFIG = {
  admin: {
    baseUrl: 'https://sit-adminapi.lottotest6688.com',
    endpoints: ADMIN_READ_ENDPOINTS,
    loginPath: '/Login/Login',
    loginBody: { userName: 'sys_milo', pwd: '12345678' },
  },
  tenant: {
    baseUrl: 'https://sit-tenantadmin.lottotest6688.com',
    endpoints: TENANT_READ_ENDPOINTS,
    loginPath: '/Login/Login',
    loginBody: { userName: 'org_milo', pwd: '12345678' },
  },
} as const;

const cfg = CONFIG[MODE];
const FIXTURES_DIR = path.join(import.meta.dirname, `mock-fixtures/${MODE}`);

function fixturePathFor(apiPath: string): string {
  // /Login/Login → mock-fixtures/admin/Login/Login.json
  const parts = apiPath.replace(/^\//, '').split('/');
  const dir = path.join(FIXTURES_DIR, ...parts.slice(0, -1));
  fs.mkdirSync(dir, { recursive: true });
  return path.join(FIXTURES_DIR, `${parts.join('/')}.json`);
}

async function run() {
  console.log(`\n[capture] mode=${MODE}  baseUrl=${cfg.baseUrl}\n`);

  const client = new CaptureClient({
    baseUrl: cfg.baseUrl,
    domainUrl: cfg.baseUrl,
  });

  // Step 1: Login
  console.log(`[login] POST ${cfg.loginPath}`);
  let loginResp: any;
  try {
    loginResp = await client.post(cfg.loginPath, cfg.loginBody);
  } catch (e) {
    console.error('[login] FAILED:', e);
    process.exit(1);
  }
  const token: string = loginResp?.data?.token ?? loginResp?.token ?? '';
  if (!token) {
    console.error(
      '[login] No token in response:',
      JSON.stringify(loginResp).slice(0, 200),
    );
    process.exit(1);
  }
  client.setToken(token);
  console.log(`[login] OK  token=${token.slice(0, 20)}...`);

  // Save login fixture
  fs.writeFileSync(
    fixturePathFor(cfg.loginPath),
    JSON.stringify(loginResp, null, 2),
  );

  // Step 2: Capture all read endpoints
  const log: Array<{ path: string; status: 'ok' | 'error'; note?: string }> =
    [];
  const listCache = new Map<string, any>(); // cache list results for idFrom lookups

  const endpoints = cfg.endpoints.filter((e) => e.path !== cfg.loginPath);

  for (const ep of endpoints) {
    let body = ep.body ?? {};

    if (ep.idFrom) {
      const cached = listCache.get(ep.idFrom.listPath);
      if (cached) {
        body = ep.idFrom.extractId(cached);
      } else {
        console.log(`  [skip-id] ${ep.path} — list not yet captured`);
        log.push({
          path: ep.path,
          status: 'error',
          note: 'idFrom list not captured',
        });
        continue;
      }
    }

    try {
      const resp =
        ep.method === 'GET'
          ? await client.get(ep.path)
          : await client.post(ep.path, body);

      fs.writeFileSync(fixturePathFor(ep.path), JSON.stringify(resp, null, 2));
      listCache.set(ep.path, resp);
      console.log(`  [ok] ${ep.method} ${ep.path}`);
      log.push({ path: ep.path, status: 'ok' });
    } catch (e: any) {
      console.warn(`  [err] ${ep.method} ${ep.path}  ${e?.message ?? e}`);
      log.push({
        path: ep.path,
        status: 'error',
        note: e?.message ?? String(e),
      });
    }

    // Polite delay: 100ms between requests
    await new Promise((r) => setTimeout(r, 100));
  }

  // Step 3: Save capture log
  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'capture-log.json'),
    JSON.stringify(
      { mode: MODE, capturedAt: new Date().toISOString(), results: log },
      null,
      2,
    ),
  );

  const ok = log.filter((l) => l.status === 'ok').length;
  const err = log.filter((l) => l.status === 'error').length;
  console.log(`\n[capture] Done. OK=${ok} ERR=${err}`);
  console.log(`[capture] Fixtures saved to ${FIXTURES_DIR}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 2: 把 mock-fixtures 加入 .gitignore**

在 `apps/web-ar-admin/.gitignore`（若不存在则在根 `.gitignore`）追加：

```
# Mock fixtures (captured from real SIT, not committed)
apps/web-ar-admin/tools/mock-fixtures/
```

---

## Task 5: 运行捕获脚本

- [ ] **Step 1: 运行 ADMIN 捕获**

```bash
cd /Users/cola/Documents/gr/vue-vben-admin
pnpm --filter web-ar-admin exec esno tools/capture-mock-data.ts --mode admin
```

预期输出（举例）：

```
[capture] mode=admin  baseUrl=https://sit-adminapi.lottotest6688.com

[login] POST /Login/Login
[login] OK  token=eyJhbGciOiJIUzI1N...
  [ok] GET /menu/all
  [ok] GET /user/info
  ...
[capture] Done. OK=62 ERR=3
```

查看 capture-log 了解失败原因：

```bash
cat apps/web-ar-admin/tools/mock-fixtures/admin/capture-log.json
```

- [ ] **Step 2: 运行 TENANT 捕获**

```bash
pnpm --filter web-ar-admin exec esno tools/capture-mock-data.ts --mode tenant
```

预期输出：

```
[capture] mode=tenant  baseUrl=https://sit-tenantadmin.lottotest6688.com
[login] OK  token=...
  [ok] POST /RechargeCategory/GetPageList
  ...
[capture] Done. OK=55 ERR=2
```

- [ ] **Step 3: 确认 fixtures 目录结构**

```bash
find apps/web-ar-admin/tools/mock-fixtures -name "*.json" | wc -l
# 期望 > 100
find apps/web-ar-admin/tools/mock-fixtures -name "*.json" | head -20
```

---

## Task 6: backend-mock fixtures 加载工具

**Files:**

- Create: `apps/backend-mock/utils/ar-fixtures.ts`

- [ ] **Step 1: 创建 ar-fixtures.ts**

```ts
// apps/backend-mock/utils/ar-fixtures.ts
// Loads AR admin fixtures from apps/web-ar-admin/tools/mock-fixtures/
// Path resolution is relative to this file's location in the monorepo.

import fs from 'node:fs';
import path from 'node:path';

const FIXTURES_ROOT = path.resolve(
  import.meta.dirname,
  '../../web-ar-admin/tools/mock-fixtures',
);

function resolveMode(domainUrl = ''): 'admin' | 'tenant' {
  return domainUrl.includes('tenantadmin') ? 'tenant' : 'admin';
}

/**
 * Load fixture for an AR admin API path.
 * Returns the parsed JSON, or null if no fixture file exists.
 */
export function loadArFixture(
  domainUrl: string,
  apiPath: string,
): unknown | null {
  const mode = resolveMode(domainUrl);
  // Strip leading slash, convert to file path
  const rel = apiPath.replace(/^\//, '');
  const filePath = path.join(FIXTURES_ROOT, mode, `${rel}.json`);

  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

/** Returns true if the fixture directory for this mode exists. */
export function hasFixtures(mode: 'admin' | 'tenant'): boolean {
  return fs.existsSync(path.join(FIXTURES_ROOT, mode));
}
```

---

## Task 7: Nitro catch-all handler

**Files:**

- Create: `apps/backend-mock/api/[...ar].ts`

- [ ] **Step 1: 创建 catch-all handler**

```ts
// apps/backend-mock/api/[...ar].ts
// Handles all AR admin API paths not covered by existing vben handlers.
// Uses the 'domainUrl' request header to select admin vs tenant fixtures.

import { defineEventHandler, getHeader, getRequestURL } from 'h3';

import { loadArFixture } from '~/utils/ar-fixtures';

export default defineEventHandler((event) => {
  const domainUrl = getHeader(event, 'domainUrl') ?? '';
  // Strip the /api prefix that Nitro exposes
  const apiPath = getRequestURL(event).pathname.replace(/^\/api/, '') || '/';

  const fixture = loadArFixture(domainUrl, apiPath);
  if (fixture !== null) {
    return fixture;
  }

  // No fixture: return a stub success so write-ops don't crash the frontend
  return { code: 0, data: null, msg: 'ok (mock stub)' };
});
```

- [ ] **Step 2: 验证 Nitro 文件路由不冲突**

现有 vben handlers：

- `api/auth/login.post.ts` → `/api/auth/login`（精确，优先于 catch-all）
- `api/user/index.get.ts` → `/api/user`
- `api/menu/all.ts` → `/api/menu/all`

catch-all `[...ar].ts` 只处理上述路径之外的请求（Nitro 精确路由优先）。AR admin 的 `/api/Login/Login`（大写L）不会被 `api/auth/login.post.ts` 匹配，会落到 catch-all。✓

---

## Task 8: 更新 vite.config.ts 接入 mock

**Files:**

- Modify: `apps/web-ar-admin/vite.config.ts`

- [ ] **Step 1: 读取文件确认当前内容**

当前内容（见 Task 8 前的探查）：

```ts
const apiTarget = isTenant ? env.VITE_TENANT_API_URL : env.VITE_API_BASE_URL;
return {
  server: {
    proxy: {
      '/api': {
        changeOrigin: true,
        secure: false,
        target: apiTarget,
        ws: true,
      },
    },
  },
};
```

- [ ] **Step 2: 修改 vite.config.ts**

```ts
import process from 'node:process';

import { defineConfig } from '@vben/vite-config';

import { loadEnv } from 'vite';

export default defineConfig(async ({ mode } = {}) => {
  const env = loadEnv(mode ?? 'dev', process.cwd());

  const appType = process.env.VITE_APP_TYPE ?? env.VITE_APP_TYPE ?? 'ADMIN';
  const isTenant = appType === 'TENANT';
  const isMock =
    (process.env.VITE_NITRO_MOCK ?? env.VITE_NITRO_MOCK) === 'true';

  // Mock mode: both admin and tenant proxy to Nitro; domainUrl header differentiates
  const apiTarget = isMock
    ? 'http://localhost:5320'
    : isTenant
      ? env.VITE_TENANT_API_URL
      : env.VITE_API_BASE_URL;

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
            secure: false,
            target: apiTarget,
            ws: true,
          },
        },
      },
    },
  };
});
```

- [ ] **Step 3: 添加本地 mock 开关到 .env 或 .env.development**

在 `apps/web-ar-admin/.env`（如不存在则新建）追加：

```env
# 本地 mock 开关（不提交 .env.sit，只影响本地开发）
# 改为 true 后重启 dev server 即可使用录制数据
VITE_NITRO_MOCK=false
```

> ⚠️ `.env.sit` 已有 `VITE_NITRO_MOCK=false`，不改动。

---

## Task 9: 冒烟验证 Mock Server

- [ ] **Step 1: 启动 ADMIN mock dev server**

```bash
cd /Users/cola/Documents/gr/vue-vben-admin
VITE_NITRO_MOCK=true pnpm --filter web-ar-admin dev
```

预期：Vite 启动后日志出现：

```
➜  Nitro Mock Server: http://localhost:5320/api
```

- [ ] **Step 2: curl 验证 catch-all 返回 fixture**

```bash
# 用 admin fixture 测试（无 domainUrl → 默认 admin）
curl -s -X POST http://localhost:5320/api/Common/GetDictionary \
  -H 'Content-Type: application/json' \
  -d '{}' | head -c 200
# 期望：{ "code": 0, "data": { ... } }  — 来自 admin fixture

# 用 tenant fixture 测试
curl -s -X POST http://localhost:5320/api/Common/GetDictionary \
  -H 'Content-Type: application/json' \
  -H 'domainUrl: https://sit-tenantadmin.lottotest6688.com' \
  -d '{}' | head -c 200
# 期望：{ "code": 0, "data": { ... } }  — 来自 tenant fixture
```

- [ ] **Step 3: curl 验证写操作 stub**

```bash
curl -s -X POST http://localhost:5320/api/RechargeCategory/Add \
  -H 'Content-Type: application/json' \
  -d '{}' | cat
# 期望：{ "code": 0, "data": null, "msg": "ok (mock stub)" }
```

- [ ] **Step 4: 浏览器登录验证**

打开 `http://localhost:5173`，用 `sys_milo / 12345678`（admin 模式）或 `org_milo / 12345678`（tenant 模式）登录。

验证：

- 登录成功，跳转到 dashboard
- 菜单正常加载
- 字典数据（下拉选项）有数据
- 表格列表能看到 SIT 真实数据的快照

- [ ] **Step 5: 提交**

```bash
git add \
  apps/web-ar-admin/tools/lib/sign.ts \
  apps/web-ar-admin/tools/lib/capture-client.ts \
  apps/web-ar-admin/tools/endpoints/admin-read.ts \
  apps/web-ar-admin/tools/endpoints/tenant-read.ts \
  apps/web-ar-admin/tools/capture-mock-data.ts \
  apps/backend-mock/utils/ar-fixtures.ts \
  apps/backend-mock/api/\[...ar\].ts \
  apps/web-ar-admin/vite.config.ts \
  apps/web-ar-admin/.env \
  .gitignore

git commit -m "feat(mock): add AR admin mock capture + Nitro catch-all handler

- tools/capture-mock-data.ts: capture read-only API responses from SIT
- tools/lib/sign.ts: replicate request signing (node:crypto MD5)
- backend-mock/api/[...ar].ts: catch-all returning fixtures by domainUrl
- vite.config.ts: proxy → localhost:5320 when VITE_NITRO_MOCK=true"
```

---

## 注意事项

1. **捕获失败的接口**：查看 `tools/mock-fixtures/*/capture-log.json`，ERR 条目说明该接口权限不足或参数有误，mock server 会对这些路径返回 stub `{code:0,data:null}`
2. **idFrom 依赖顺序**：清单中 `idFrom` 接口必须排在对应 list 接口之后，脚本按数组顺序执行
3. **fixtures 不入库**：`mock-fixtures/` 已加入 `.gitignore`，需要 mock 的开发者本地运行捕获脚本
4. **重新捕获**：SIT 数据变更时重跑 `capture-mock-data.ts` 即可覆盖
