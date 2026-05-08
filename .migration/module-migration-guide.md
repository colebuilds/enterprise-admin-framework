# 模块迁移作战手册

> 每迁一个业务模块前，Claude 和开发者都应通读本文件。  
> 迁移节奏：**先写 E2E spec → 再迁代码 → spec 跑通才算完成**。

---

## 迁移前置检查

```bash
# 1. 确认 registry.ts 是最新的（后端如有新增字典 key 先重跑）
pnpm --filter web-ar-admin exec esno tools/dict-snapshot.ts

# 2. 确认 API 是最新的（后端如有接口变化先重跑）
pnpm --filter web-ar-admin run gen:api

# 3. 确认当前分支干净
git status
```

---

## 标准迁移流程

```
1. 在老项目写 e2e spec（老项目跑通，作为基准）
2. 新项目建路由（src/router/routes/modules/xxx.ts）
3. 迁移 API（gen:api 已生成，确认接口存在）
4. 迁移 views（src/views/xxx/）
5. 迁移 composables/hooks（按需，非全量搬运）
6. 新项目跑同一 e2e spec
7. 更新 tracker.md 和 e2e-inventory.md
```

---

## 老代码 → 新代码对照表

### Store 调用替换

| 老代码 | 新代码 | 说明 |
| --- | --- | --- |
| `import { useUserStore } from '@/store/modules'` | `import { useAppUserStore } from '#/store/app-user'` | 业务 store |
| `userStore.info` | `appUserStore.info` | 用户信息 |
| `userStore.isSuperAuthUser` | `appUserStore.isSuperAuthUser` | 超管判断 |
| `userStore.isPlatformUser` | `appUserStore.isPlatformUser` | 平台用户判断 |
| `userStore.getActiveTenantId` | `appUserStore.activeTenantId` | 当前商户 ID |
| `userStore.getTenantGroups` | `appUserStore.getTenantGroups` | 商户分组 |
| `userStore.getTenantFlatList` | `appUserStore.getTenantFlatList` | 商户平铺列表 |
| `userStore.getPermissions` | `appUserStore.getPermissionCodes` | 权限码数组 |

### 字典调用替换（最重要）

**老代码模式（5 种常见写法）：**

```ts
// 模式 1：直接读 store
const options = userStore.getDictionaryList?.enableStateList ?? []

// 模式 2：useDictionary hook（老组件内）
const { getOptions } = useDictionary()
const options = getOptions('enableStateList', { source: 'common' })

// 模式 3：DictSelect 组件（dict-key prop）
<DictSelect dict-key="enableStateList" />

// 模式 4：动态字典 store
const { load } = useDynamicDictionaryStore()
const list = await load('roleList')

// 模式 5：动态字典 loadMany
await store.loadMany(['roleList', 'tenantList'])
```

**新代码（统一一种写法）：**

```ts
import { useDictOptions, useLabelMap } from '#/composables/dict'

// 下拉选项（响应式，ComputedRef<DictOption[]>）
const statusOptions = useDictOptions('enableStateList')        // static，自动推断 source
const roleOptions   = useDictOptions('roleList')               // dynamic，自动懒加载
const countryOpts   = useDictOptions('countryList', 'platform') // 歧义 key，必须指定 source

// 表格列渲染（value → label Map）
const statusMap = useLabelMap('enableStateList')
// 模板中：{{ statusMap.get(row.status) }}

// DictSelect 组件（key 不变，内部已改用新 composable）
<DictSelect dict-key="enableStateList" />  // 保持不变
```

### 关键规则

1. **禁止直接读 store**：不再有 `dictStore.dictionary?.enableStateList`，统一用 `useDictOptions`
2. **dynamic key 不需要手动 load**：`useDictOptions('roleList')` 自动触发 TanStack Query 懒加载，无需提前调 `load()` 或 `loadMany()`
3. **CRUD 后失效 dynamic dict**：如果页面有增删改操作，操作成功后调：
   ```ts
   import { queryClient } from '#/lib/query-client';
   import { DICT_QUERY_KEY } from '#/store/dict';
   queryClient.invalidateQueries({ queryKey: DICT_QUERY_KEY.dynamic });
   ```
4. **不知道用哪个 key**：查 `.migration/specs/spec-dict-keys.md`

### HTTP 请求替换

| 老代码 | 新代码 |
| --- | --- |
| `import axios from 'axios'` | 禁止，改用 `requestClient` |
| `import { defHttp } from '@/utils/http/axios'` | `import { requestClient } from '#/api/request'` |
| `defHttp.post({ url: '/xxx' }, params)` | `requestClient.post('/xxx', params)` |
| `defHttp.get({ url: '/xxx' }, params)` | `requestClient.get('/xxx', params)` |
| `defHttp.uploadFile(config, params)` | `uploadFile(config, params)` |

### 路由 meta 替换

| 老字段             | 新字段                 | 说明     |
| ------------------ | ---------------------- | -------- |
| `roles: ['admin']` | `authority: ['admin']` | 权限码   |
| `keepAlive: true`  | `keepAlive: true`      | 保持不变 |
| `affix: true`      | `affixTab: true`       | 固定标签 |
| `icon: 'xxx'`      | `icon: 'xxx'`          | 保持不变 |

### 权限指令

```html
<!-- 老代码 -->
<button v-permission="['system:user:add']">新增</button>

<!-- 新代码（指令名不变，实现已适配 vben accessStore）-->
<button v-permission="['system:user:add']">新增</button>
```

### 组件使用优先级

```
1. vben 内置组件（useVbenForm、VbenModal、VbenDrawer）← 新页面首选
2. ProComponents（ProCrudTable、ProForm）← 老页面保持不变
3. Naive UI 原生组件（n-data-table、n-form 等）← 需要时直接用
```

---

## 如何迁移一个带字典的搜索表单

**老代码（以 tenantList 为例）：**

```vue
<script setup>
import { useDynamicDictionaryStore } from '@/store/modules';

const dictStore = useDynamicDictionaryStore();
const tenantOptions = ref([]);

onMounted(async () => {
  const list = await dictStore.load('tenantList');
  tenantOptions.value = list.map((t) => ({
    label: t.tenantName,
    value: t.tenantId,
  }));
});
</script>

<template>
  <n-select v-model:value="form.tenantId" :options="tenantOptions" />
</template>
```

**新代码：**

```vue
<script setup>
import { useDictOptions } from '#/composables/dict';

const tenantOptions = useDictOptions('tenantList'); // 自动懒加载，响应式
</script>

<template>
  <n-select v-model:value="form.tenantId" :options="tenantOptions" />
</template>
```

---

## 如何迁移一个带字典的表格列

**老代码：**

```ts
// columns 定义
{
  title: '状态',
  key: 'state',
  render: (row) => {
    const options = userStore.getDictionaryList?.enableStateList ?? []
    const item = options.find(o => o.id === row.state)
    return item?.name ?? row.state
  }
}
```

**新代码：**

```ts
import { useLabelMap } from '#/composables/dict'

const stateMap = useLabelMap('enableStateList')

// columns 定义
{
  title: '状态',
  key: 'state',
  render: (row) => stateMap.value.get(row.state) ?? String(row.state)
}
```

---

## E2E 测试规范（迁移模块的 spec）

```ts
// ✅ 语义选择器
page.getByRole('button', { name: '新增' });
page.getByRole('row').nth(1);
page.getByText('操作').first();

// ❌ 禁止 class 选择器
page.locator('.n-data-table-td');

// ✅ URL 直达导航
await page.goto('/system/user');

// ❌ 禁止点击侧边栏导航
await page.click('.layout-sider >> text=系统管理');
```

---

## 迁移完成 Checklist

- [ ] E2E spec 在新项目全绿
- [ ] 无 `import ... from '@/'` 残留（全部改为 `#/`）
- [ ] 无 `import axios` 直接使用
- [ ] 无 `userStore.getDictionaryList` 直接读 dict store
- [ ] 无 `useDynamicDictionaryStore().load()` 调用
- [ ] `v-permission` 指令正常生效（不是 `v-access:code`）
- [ ] 更新 `.migration/tracker.md`
- [ ] 更新 `.migration/e2e-inventory.md`
