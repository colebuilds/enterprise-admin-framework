# 技术方案 E — 字典系统

## 背景

老项目字典体系有五条链路，分散在 `userStore` 和独立 `dynamicDictionaryStore` 里。业务代码通过 `userStore.*` 直接读取，共 20+ 处调用。

## 五条链路全貌

| 链路 | 接口 | 老项目缓存 | 加载时机 | 新 staleTime | 新消费方式 |
| --- | --- | --- | --- | --- | --- |
| common | `POST /Common/GetDictionary` | ❌ 无，裸 Pinia ref | 登录后预热（prefetch） | `Infinity` | `useDictOptions('enableStateList')` |
| group | `POST /SysDictionary/GetGroupData` | ❌ 无，裸 Pinia ref | 登录后预热（prefetch） | `Infinity` | `useDictOptions('countryDictionaryList')` |
| v1 | `POST /v1/Common/GetDictionary` | ❌ 无，裸 Pinia ref | 登录后预热（prefetch） | `Infinity` | `useDictOptions('userStateList')` |
| platform | `POST /Common/GetPlatformDic` | ❌ 无，裸 Pinia ref | 登录后预热（prefetch） | `Infinity` | `useDictOptions('languageList')` |
| dynamic | `POST /Common/GetDynamicDictionary` | ✅ 手写 5 分钟 + in-flight 去重 | 模块内按需懒加载 | `5 * 60 * 1000` | `useDictOptions('roleList')` |

---

## 架构决策

### 1. 五条链路全走 TanStack Query（统一基础设施）

**老项目的问题：**

- static dict（4 条）：裸 Pinia ref，没有任何缓存或去重。`loadBaseDicts()` 若被并发调用（如路由守卫竞态），会重复发请求；失败后静默写空数据，没有重试。
- dynamic dict（1 条）：老项目自己手写了 `cache + pending + loadedAt` 实现 5 分钟缓存 + in-flight 去重，逻辑复杂且不可复用。

**TanStack Query 对所有 5 条链路统一提供：**

- **in-flight 去重**：同一 queryKey 并发调用只发出 1 个请求
- **失败重试**：`retry: 1`
- **请求取消**：AbortSignal 自动传递
- **staleTime 控制刷新策略**（见下）

**staleTime 的选取：**

- static dict → `staleTime: Infinity`

  static dict 是 session 级别稳定的数据——登录时加载一次，session 内内容不变，**唯一需要刷新的场景是语言切换**。`Infinity` 表达"不自动过期，由业务显式失效"，语言切换时调 `queryClient.invalidateQueries({ queryKey: ['dict'] })` 触发重拉。这与老项目的实际行为（session 内存一份，语言切换重新调接口）完全一致，只是加上了去重和重试。

- dynamic dict → `staleTime: 5 * 60 * 1000`

  沿用老项目 `STALE_AFTER_MS = 5 * 60 * 1000` 的设定，含义不变：业务侧 CRUD 后主动调 `queryClient.invalidateQueries(['dict', 'dynamic'])` 失效；5 分钟兜底是"业务忘了失效"时的安全网。

### 2. Static dict 的 prefetch 模式

TanStack Query 的 `useQuery` 只能在组件/composable 上下文（setup）里调用。  
登录时 auth store 不在组件上下文里，需要 `queryClient.prefetchQuery`（可在任意位置调用）。  
这要求暴露一个**单例 `queryClient`**，auth store 和组件共享同一个实例。

```
登录时：auth store → queryClient.prefetchQuery → cache 预热
组件内：useQuery(同 queryKey) → 命中 cache，不二次请求
```

### 3. 删除 useDictStore（Pinia store）

dict 不再需要 Pinia store，TanStack Query cache 是唯一数据源。  
`appUserStore` 保持不变（只管用户信息 + 商户 + 权限）。

### 4. Registry + composable — TypeScript 强约束

不变。见 registry 节。

---

## 实现细节

### `src/lib/query-client.ts`（新增）

单例 QueryClient，auth store 和 VueQueryPlugin 共享。

```ts
import { QueryClient } from '@tanstack/vue-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### `bootstrap.ts`（更新）

显式传入单例，保证 auth store 和组件用同一个 QueryClient：

```ts
import { VueQueryPlugin } from '@tanstack/vue-query';
import { queryClient } from '#/lib/query-client';

app.use(router);
app.use(VueQueryPlugin, { queryClient });
```

### `src/store/auth.ts`（更新）

登录后用 `queryClient.prefetchQuery` 预热 4 条 static dict（非阻塞）：

```ts
import { queryClient } from '#/lib/query-client';

// 在 fetchUserInfo() 末尾，不 await，不阻塞导航
Promise.allSettled([
  queryClient.prefetchQuery({
    queryKey: ['dict', 'common'],
    queryFn: () => api.common.getDictionary(),
    staleTime: Infinity,
  }),
  queryClient.prefetchQuery({
    queryKey: ['dict', 'v1'],
    queryFn: () => api.v1platform.getDictionary(),
    staleTime: Infinity,
  }),
  queryClient.prefetchQuery({
    queryKey: ['dict', 'group'],
    queryFn: () => api.system.getGroupData(),
    staleTime: Infinity,
  }),
  queryClient.prefetchQuery({
    queryKey: ['dict', 'platform'],
    queryFn: () => api.common.getPlatformDic(),
    staleTime: Infinity,
  }),
]);
```

登出时清理 dict cache：

```ts
queryClient.removeQueries({ queryKey: ['dict'] });
```

### `src/composables/dict/useDictionary.ts`（更新）

5 条链路全用 `useQuery`，差异只在 `staleTime`：

```ts
const STATIC_QUERY: Record<
  string,
  { queryKey: readonly unknown[]; queryFn: () => Promise<unknown> }
> = {
  common: {
    queryKey: ['dict', 'common'],
    queryFn: () => api.common.getDictionary(),
  },
  v1: {
    queryKey: ['dict', 'v1'],
    queryFn: () => api.v1platform.getDictionary(),
  },
  group: {
    queryKey: ['dict', 'group'],
    queryFn: () => api.system.getGroupData(),
  },
  platform: {
    queryKey: ['dict', 'platform'],
    queryFn: () => api.common.getPlatformDic(),
  },
};

export function useDictOptions(
  key: string,
  source?: DictSource,
): ComputedRef<DictOption[]> {
  const resolvedSource = (source ?? KEY_SOURCE[key]) as DictSource;

  if (resolvedSource === 'dynamic') {
    // ⚠️ gen-api 把 DynamicDictionaryKeyEnum 错误生成为中文字面量，后端实际接收英文 camelCase。
    // 空 body {} 在 SIT 验证返回 0 条数据；必须显式传 ALL_DYNAMIC_KEYS（英文 camelCase）。
    // 后端某些环境返回 PascalCase key，queryFn 内统一转 camelCase。
    const { data } = useQuery({
      queryKey: DICT_QUERY_KEY.dynamic,
      queryFn: async () => {
        const res = await api.common.getDynamicDictionary({
          keys: ALL_DYNAMIC_KEYS as any,
        });
        const raw = res.items as Record<string, unknown[]>;
        const normalized: Record<string, unknown[]> = {};
        for (const [k, v] of Object.entries(raw)) {
          normalized[`${k[0]!.toLowerCase()}${k.slice(1)}`] = v;
        }
        return normalized;
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
    return computed(() =>
      toOptions('dynamic', key, (data.value as any)?.[key] ?? []),
    );
  }

  // Static: prefetch 已在 auth store 里预热，这里命中 cache 不二次请求
  const { queryKey, queryFn } = STATIC_QUERY[resolvedSource]!;
  const { data } = useQuery({ queryKey, queryFn, staleTime: Infinity });
  return computed(() =>
    toOptions(
      resolvedSource,
      key,
      getStaticRawList(data.value, resolvedSource, key),
    ),
  );
}
```

### `src/composables/dict/registry.ts`（脚本生成，禁止手改）

```ts
export const KEY_SOURCE: Record<string, DictSource> = {
  enableStateList: 'common',
  userStateList: 'v1',
  countryDictionaryList: 'group',
  languageList: 'platform',
  roleList: 'dynamic',
  // ... 共 141 个
};

export const AMBIGUOUS_SOURCES: Record<string, DictSource[]> = {
  countryList: ['common', 'platform'],
  currencyList: ['common', 'platform'],
  financialTypeList: ['common', 'v1'],
};

export type AmbiguousKey = keyof typeof AMBIGUOUS_SOURCES;
export type DictSource = 'common' | 'v1' | 'group' | 'platform' | 'dynamic';
```

**更新命令**：`pnpm --filter web-ar-admin exec esno tools/dict-snapshot.ts`

### `DYNAMIC_FIELDS` 映射（useDictionary.ts 内维护）

dynamic dict 各 key 的 label/value 字段各不相同：

```ts
const DYNAMIC_FIELDS: Record<string, { label: string; value: string }> = {
  withdrawCategoryList: { label: 'name', value: 'id' },
  organizationList: { label: 'orgName', value: 'orgId' },
  tenantList: { label: 'tenantName', value: 'tenantId' },
  sysCurrencyList: { label: 'sysCurrency', value: 'sysCurrency' },
  payCodeList: { label: 'payCode', value: 'payCode' },
  thirdPayMerchantList: { label: 'customName', value: 'merchantId' },
  tenantPayChannelList: { label: 'customName', value: 'tenantChannelId' },
  sysPayChannelList: { label: 'sysChannelName', value: 'sysChannelId' },
  rechargeCategoryList: { label: 'name', value: 'id' },
  roleList: { label: 'roleName', value: 'roleId' },
  menuList: { label: 'menuName', value: 'menuId' },
  withdrawConfigGroupList: { label: 'groupName', value: 'configGroupId' },
};
```

### TypeScript 重载（消费者 API 不变）

```ts
// 普通 key — 无需指定 source
export function useDictOptions(key: UnambiguousKey): ComputedRef<DictOption[]>;
// 歧义 key — 必须指定 source（编译器强制）
export function useDictOptions(
  key: AmbiguousKey,
  source: DictSource,
): ComputedRef<DictOption[]>;

// label 查找 Map（value → label），供表格列渲染
export function useLabelMap(
  key: UnambiguousKey,
): ComputedRef<Map<number | string, string>>;
export function useLabelMap(
  key: AmbiguousKey,
  source: DictSource,
): ComputedRef<Map<number | string, string>>;
```

---

## 文件变动总结

| 文件 | 变动 |
| --- | --- |
| `src/lib/query-client.ts` | **新增** — 单例 QueryClient |
| `src/store/dict.ts` | **重写** — 移除 Pinia store，改为工具模块（导出 `DICT_QUERY_KEY` / `STATIC_DICT_QUERY_FN` / `prefetchStaticDicts` / `clearDictCache` / `invalidateDicts`） |
| `src/store/auth.ts` | 更新 — prefetchQuery 替代 loadBaseDicts；登出时 removeQueries |
| `src/bootstrap.ts` | 更新 — 传入单例 queryClient |
| `src/composables/dict/useDictionary.ts` | 更新 — 5 条链路全走 useQuery |
| `src/composables/dict/registry.ts` | 不变（脚本生成） |
| `src/composables/dict/index.ts` | 不变 |

---

## 消费者示例

```vue
<script setup lang="ts">
import { useDictOptions, useLabelMap } from '#/composables/dict';

const statusOptions = useDictOptions('enableStateList'); // common，命中 prefetch cache
const roleOptions = useDictOptions('roleList'); // dynamic，懒加载
const countryOptions = useDictOptions('countryList', 'platform'); // 歧义 key，必须指定
const statusMap = useLabelMap('enableStateList'); // 用于表格列渲染
</script>
```

---

## 语言切换 → 字典刷新

语言切换后 static dict 内容变化（接口返回当前语言的文本），需要让 cache 失效：

```ts
// 切换语言后
queryClient.invalidateQueries({ queryKey: ['dict'] });
// 下一次 useQuery 会重新请求所有 dict，包括 static 和 dynamic
```

---

## 验证方法

1. **prefetch 生效**：登录后网络面板出现 4 个 dict 请求（common/v1/group/platform），无重复
2. **dynamic 懒加载**：登录后无 `GetDynamicDictionary` 请求；进入使用 dynamic key 的页面后才触发
3. **in-flight 去重**：两个组件同时调用 `useDictOptions('roleList')` 只发出 1 个网络请求
4. **stale cache**：`useDictOptions('enableStateList')` 调用 N 次，网络请求只有登录时的 1 次
5. **TypeScript**：`useDictOptions('countryList')` 无第二参数编译报错
6. **E2E**：`smoke/dict-loading.spec.ts` — 验证 4 条 static dict 在登录后加载，dynamic 不在登录时加载
7. **登出**：退出后 `queryClient.getQueryData(['dict', 'common'])` 为 undefined（cache 已清）
