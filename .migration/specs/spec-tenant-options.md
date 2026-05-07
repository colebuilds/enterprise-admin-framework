# useTenantOptions 重构方案

> 源文件：`feat1-ar_platform_admin/src/hooks/useTenantOptions.ts`（955行）
> 目标：3 个文件，约 500 行，公共接口不变，调用方零改动。

---

## 文件结构

```
#/utils/tenant.ts              (~60  行)  纯工具：formatTenantLabel + 共享类型
#/store/tenant-options.ts      (~220 行)  Pinia store：state + async load
#/hooks/useTenantOptions.ts    (~220 行)  composable：dispatch + 所有方法
```

**为什么需要 `#/utils/tenant.ts`：**
store 需要 `formatTenantLabel` 和 `TenantOption` 类型，hook 需要 store。
如果 `formatTenantLabel` 放在 hook 里，就形成 store→hook→store 循环依赖。
提取到 utils 彻底断开循环。

**为什么迁移到 Pinia store：**
- Devtools 可见（实时看商户列表状态）
- 手动 `reset()` 可调用（logout 场景清空 admin 数据）
- 与项目其他 store 架构一致
- ⚠️ 响应式正确性与原方案一致，这不是迁移理由

---

## File 1：`#/utils/tenant.ts`

### 内容
1. `formatTenantLabel(tenantId, tenantName, fallback?)` — 从原文件 line 409 直接搬，零依赖纯函数
2. 类型定义（从原文件 interfaces 区块搬入，去掉多行 JSDoc，保留单行注释）：
   - `TenantOption`
   - `TenantCascaderOption`
   - `ApprovalTenantOption`
   - `UseTenantOptionsReturn`
   - `UserTenantItem`（从 `#/store/app-user` re-export，避免调用方改 import）

**hook 文件必须 re-export `formatTenantLabel`**，保证原有调用方路径可用：
```ts
// #/hooks/useTenantOptions.ts 顶部
export { formatTenantLabel } from '#/utils/tenant';
```

---

## File 2：`#/store/tenant-options.ts`

### 职责
- 非管理员商户的全部 computed 映射（始终可用）
- 超管异步拉取的集团/商户数据
- `load(force?)` action，带 in-flight 去重
- 手动 `reset()` action

### setup-syntax store 不支持 `$reset()`

Options-syntax 的 `$reset()` 在 setup-syntax store 不可用，必须手动实现：

```ts
function reset() {
  organizationList.value = [];
  loading.value = false;
  loaded.value = false;
  pendingRequest = null; // 普通变量，必须手动清
}
```

> 非管理员用户登录后调用 `load()` 时，store 的非管理员短路路径会立即将 `loaded` 设回 `true`，
> 因此 `reset()` 在 logout 时安全调用，不影响下一个普通用户的正常使用。

### `pendingRequest` 实现

```ts
// ✅ 普通 let 变量，在 store setup 闭包内，不触发 devtools 更新
let pendingRequest: Promise<void> | null = null;
// ❌ 不能是 ref（会产生 devtools 噪声，且 $reset 无法清它）
```

### `load()` 实现（与原版逻辑完全一致）

```ts
async function load(force = false) {
  if (!appUser.isSuperAuthUser) {
    // 非管理员短路：清空 admin 数据，标记为已完成
    organizationList.value = [];
    loaded.value = true;
    return;
  }
  if (loaded.value && !force) return;
  if (pendingRequest && !force) { await pendingRequest; return; }

  pendingRequest = (async () => {
    loading.value = true;
    try {
      const { data, result } = await api.tenant.organizationGetSelectList();
      if (result && Array.isArray(data)) {
        organizationList.value = data;
        loaded.value = true;
      } else {
        organizationList.value = [];
        loaded.value = false;
      }
    } catch {
      organizationList.value = [];
      loaded.value = false;
    } finally {
      loading.value = false;
      pendingRequest = null;
    }
  })();

  await pendingRequest;
}
```

### `adminTenantList` computed（含 filter 守卫）

原版 `normalizeAdminTenantList`（line 437-452）显式过滤无效 id，实现时必须保留：

```ts
const adminTenantList = computed(() =>
  organizationList.value.flatMap(org =>
    (org.tenantList ?? [])
      // ⚠️ 必须有此 filter，防止 id 为 undefined/NaN 的项破坏下游 Map
      .filter((t): t is { id: number; name: string } =>
        typeof t?.id === 'number' && Number.isFinite(t.id)
      )
      .map(t => ({
        id: t.id,
        name: String(t.name ?? '').trim(),
        orgId: org.id,
        orgName: String(org.name ?? '').trim(),
        // 时区从 non-admin tenantMap 回填（admin API 不返回时区）
        timeZone: tenantMap.value[t.id]?.timeZone ?? '',
      }))
  )
);
```

### Pinia store 访问方式（重要）

setup-syntax store 返回的 `ref`/`computed` 在外部通过 `store.xxx` 访问时**自动解包**，
返回的是值本身（`T`），不是 `Ref<T>`。

```ts
// hook 里访问 store
const store = useTenantOptionsStore();
store.tenantList   // T[]，已解包，不是 Ref<T[]>
store.loading      // boolean，已解包

// 需要响应式 ref 时用 storeToRefs
const { tenantList, loading } = storeToRefs(store);
tenantList.value   // T[]
```

### store 完整 return

```ts
return {
  // non-admin（始终可用）
  tenantList, tenantMap,
  tenantNameMap, tenantLabelMap,
  tenantTimeZoneMap, tenantTimeZoneLabelMap,
  tenantOptions, tenantOptionMap,
  // admin only
  adminTenantNameMap, adminTenantLabelMap,
  adminTenantOptions, adminTenantOptionMap,
  tenantCascaderOptions, orgNameMap,
  // async state
  loading, loaded,
  load, refresh: () => load(true), reset,
};
```

---

## File 3：`#/hooks/useTenantOptions.ts`

### 职责
- 调用 store，组装 dispatch 层（isSuperAuthUser 切换）
- 持有 `approvalTenant*`
- 持有所有业务方法
- Re-export `formatTenantLabel`

### Admin 加载触发：同步 if，不改成 watch

```ts
// ✅ 保持原版同步触发，setup() 结束时 load 已 in-flight
if (isSuperAuthUser.value && !store.loaded && !store.loading) {
  void store.load();
}
// ❌ 不用 watch+immediate：Vue 3 watch 是微任务异步，首帧读到空列表
```

### dispatch 层（4个 resolved* computed）

```ts
const resolvedTenantNameMap   = computed(() =>
  isSuper.value ? store.adminTenantNameMap   : store.tenantNameMap);
const resolvedTenantLabelMap  = computed(() =>
  isSuper.value ? store.adminTenantLabelMap  : store.tenantLabelMap);
const resolvedTenantOptions   = computed(() =>
  isSuper.value ? store.adminTenantOptions   : store.tenantOptions);
const resolvedTenantOptionMap = computed(() =>
  isSuper.value ? store.adminTenantOptionMap : store.tenantOptionMap);
```

### load / refresh：hook 层必须有 isSuperAuthUser 守卫

```ts
// ✅ hook 层守卫：非管理员调用 load() 不触发 store 的副作用
async function load(force = false) {
  if (!isSuperAuthUser.value) return;
  await store.load(force);
}
async function refresh() {
  if (!isSuperAuthUser.value) return;
  await store.load(true);
}
// ❌ 错误写法：直接 store.load() 会对非管理员执行 organizationList=[];loaded=true
```

### getTenant()：始终读 non-admin tenantMap

```ts
function getTenant(tenantId?: number | null) {
  return typeof tenantId === 'number' ? (store.tenantMap[tenantId] ?? null) : null;
}
```

> ⚠️ 超管场景已知限制：
> - `getTenant()` 对超管不在 tenantFlatList 里的商户返回 `null`（设计行为）
> - `getTenantCurrency()` 对超管始终返回 fallback（通过 getTenant，同上）
> - `getTenantTimeZone()` / `getTenantTimeZoneLabel()` 读 `store.tenantTimeZoneMap`（non-admin），
>   超管对 admin API 独有的商户时区查询同样返回 fallback

### getOrgName()：双路径

```ts
function getOrgName(orgId?: string | number | null, fallback = '-'): string {
  const id = Number(orgId);
  if (!Number.isFinite(id) || id <= 0) return fallback;
  if (isSuperAuthUser.value) {
    return store.orgNameMap[id]?.trim() || fallback; // admin: 读集团 API 数据
  }
  const tenant = store.tenantList.find(t => t.orgId === id);
  return tenant?.orgName?.trim() || fallback;        // 普通: 从商户列表回填
}
```

### defaultApprovalTenantId：超管路径

```ts
const defaultApprovalTenantId = computed<number>(() => {
  // 超管用户 defaultTenantId 始终为 null，直接走 approvalTenantList[0]
  const globalDefault = defaultTenantId.value;
  if (
    typeof globalDefault === 'number' &&
    Number.isFinite(globalDefault) &&
    approvalTenantList.value.some(t => t.id === globalDefault)
  ) {
    return globalDefault;
  }
  return approvalTenantList.value[0]?.id ?? 0;
});
```

### 未展示实现的方法（从原文件直接搬，替换 `state.` → `store.`）

以下方法逻辑简单，实现时对照原文件 line 730-870 直接搬入，
把 `state.tenantTimeZoneMap.value` → `store.tenantTimeZoneMap`，
把 `state.tenantMap.value` → `store.tenantMap`：

- `getTenantOption` — 读 `resolvedTenantOptionMap`
- `getTenantName` — 读 `resolvedTenantNameMap`，fallback 走 `getTenant`
- `getTenantCurrency` — 读 `getTenant(id)?.supportSysCurrency`
- `getTenantTimeZone` — 读 `store.tenantTimeZoneMap`
- `getTenantTimeZoneLabel` — 读 `store.tenantTimeZoneLabelMap`
- `getTenantLabel` — 组合 `formatTenantLabel` + `getTenantName`
- `getTenantDateTimeColumnTitle` — 调 `getTenantTimeZoneLabel`
- `renderTenantDateTimeColumnTitle` — 调 `getTenantTimeZoneLabel`，返回 VNode 渲染函数
- `formatTenantDateTime` — 调 `getTenantTimeZone` + `formatToTimeZone`
- `toTenantUtcTimestamp` — 调 `getTenantTimeZone` + `convertLocalWallClockToZoneUtc`

### hook 完整 return（32 个字段，与原版对齐）

```ts
return {
  activeTenant, activeTenantId, defaultTenantId,
  tenantList:            computed(() => store.tenantList),
  tenantMap:             computed(() => store.tenantMap),
  tenantNameMap:         resolvedTenantNameMap,
  tenantLabelMap:        resolvedTenantLabelMap,
  tenantTimeZoneMap:     computed(() => store.tenantTimeZoneMap),
  tenantTimeZoneLabelMap:computed(() => store.tenantTimeZoneLabelMap),
  tenantOptions:         resolvedTenantOptions,
  tenantCascaderOptions: computed(() => isSuper.value ? store.tenantCascaderOptions : []),
  tenantOptionMap:       resolvedTenantOptionMap,
  approvalTenantList, approvalTenantOptions, defaultApprovalTenantId,
  loading: computed(() => isSuper.value ? store.loading : false),
  loaded:  computed(() => isSuper.value ? store.loaded  : true),
  load, refresh,
  getTenant, getTenantOption, getTenantName, getTenantLabel,
  getOrgName, getTenantCurrency,
  getTenantTimeZone, getTenantTimeZoneLabel,
  getTenantDateTimeColumnTitle, renderTenantDateTimeColumnTitle,
  formatTenantDateTime, toTenantUtcTimestamp,
};
```

---

## 责任边界

| 字段/方法 | 数据来源 | 文件 |
|-----------|---------|------|
| `tenantList`, `tenantMap`, `tenantTimeZoneMap` | appUserStore.getTenantFlatList | store (non-admin) |
| `adminTenantOptions`, `tenantCascaderOptions` | API 异步拉取 | store (admin) |
| `resolvedTenant*` (4个 dispatch) | isSuperAuthUser 切换 | hook |
| `approvalTenant*` (3个) | appUserStore.info.approvalTenantList | hook |
| 所有 `getTenant*` 方法、时区格式化 | store computed | hook |
| `formatTenantLabel` + 所有类型 | 纯函数/类型定义 | utils/tenant.ts |

---

## 行数估算

| 文件 | 估算 |
|------|------|
| `#/utils/tenant.ts` | ~60 行 |
| `#/store/tenant-options.ts` | ~220 行 |
| `#/hooks/useTenantOptions.ts` | ~220 行 |
| **合计** | **~500 行**（原 955 行，减少 48%） |

---

## 调用方改动

**composable 调用（零改动）：**
```ts
const { tenantOptions, getTenantName, formatTenantDateTime } = useTenantOptions();
```

**import 路径（alias 批量替换，与本方案无关）：**
```ts
// 旧 → 新（hook 文件 re-export，用法不变）
import { formatTenantLabel } from '@/hooks' → '#/hooks/useTenantOptions'
```

**Logout 时调用 reset：**
```ts
// authStore.logout() 里追加
useTenantOptionsStore().reset();
```
