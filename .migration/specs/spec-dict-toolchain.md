# 字典工具链 SOP

> 与 `gen:api` 的纪律完全相同：有生成工具，产物文件禁止手改。

---

## 工具链全景

```
tools/dict-keys-meta.ts     ← 【手动维护】key 中文元数据（唯一手改入口）
        ↓
tools/dict-snapshot.ts      ← 【脚本】连接 SIT API 拉取最新字典结构
        ↓
tools/dict-snapshot.json    ← 原始快照（用于人工审查，不提交）
src/composables/dict/registry.ts  ← 【生成产物】禁止手改
```

对比 API 工具链：

```
tools/api.ts（gen:api）→ src/api/**   （对应）   dict-snapshot.ts → registry.ts
```

---

## 何时必须重跑脚本

| 触发场景          | 说明                                               |
| ----------------- | -------------------------------------------------- |
| 后端新增字典 key  | 新 key 不在 registry 里，`useDictOptions` 无法使用 |
| 后端字段名修改    | label/value 字段变了，`toOptions` 映射失效         |
| 发现新的歧义 key  | 某 key 开始同时存在于多个接口                      |
| 后端拆分/合并接口 | key 从一个 source 移到另一个                       |
| 新增 dynamic key  | dynamic 接口返回了新的 key                         |

**判断依据**：运行时 `useDictOptions` 返回空数组，且确认数据库有数据 → 先重跑脚本确认 key 是否变化。

---

## 重跑命令

```bash
pnpm --filter web-ar-admin exec esno tools/dict-snapshot.ts
```

脚本会：

1. 登录 SIT 获取 token
2. 分别调用 5 个字典接口
3. 输出 `tools/dict-snapshot.json`（快照，供人工审查）
4. 读取 `tools/dict-keys-meta.ts` 中的中文注释
5. 生成带 JSDoc 的 `src/composables/dict/registry.ts`

---

## 新增 key 完整流程

### 场景 A：后端新增 static dict key（common / v1 / group / platform）

```
1. 重跑脚本 → registry.ts 自动包含新 key
2. 在 tools/dict-keys-meta.ts 的对应 source 区块补充中文说明
3. 重跑脚本（第二次）→ 带注释的 registry.ts
4. 在 spec-dict-keys.md 速查表对应 source 节补一行
5. 提交：dict-keys-meta.ts + registry.ts + spec-dict-keys.md
```

### 场景 B：后端新增 dynamic dict key

```
1. 重跑脚本 → registry.ts 自动包含新 dynamic key
2. 在 tools/dict-keys-meta.ts 的 dynamic 区块补中文说明
3. 在 src/composables/dict/useDictionary.ts 的 ALL_DYNAMIC_KEYS 追加英文 key：
   'newKey',   // 新字典中文含义
   ⚠️ 这是实际发请求的 key 列表；漏掉这步 → 该 key 永远不会被请求，下拉永远空
4. 在 src/composables/dict/useDictionary.ts 的 DYNAMIC_FIELDS 补字段映射：
   /** 新字典中文含义说明 */
   newKey: { label: 'labelField', value: 'valueField' }
   ⚠️ 字段名以 dict-snapshot.json 里的 samples 为准，后端 types 不可信
5. 在 tools/dict-snapshot.ts 的 DYNAMIC_ENUM_MAP 追加映射（供脚本拉 SIT 数据用）：
   newKey: '后端中文枚举值',
6. 在 spec-dict-keys.md 的 dynamic 表格补一行（含 label/value 字段）
7. 重跑脚本（带注释）→ registry.ts 和 dict-snapshot.json 更新
8. 提交：dict-keys-meta.ts + useDictionary.ts + dict-snapshot.ts + registry.ts + spec-dict-keys.md
```

⚠️ 最常见漏做项：步骤 3（ALL_DYNAMIC_KEYS）和步骤 4（DYNAMIC_FIELDS）缺一不可。

- 漏步骤 3 → key 根本不在请求里，服务端不返回该数据
- 漏步骤 4 → 数据拿到了但 label/value 字段猜错，下拉 label 为空或 value 为 undefined

### 场景 C：发现歧义 key

脚本自动检测并输出到 `AMBIGUOUS_SOURCES`，同时从 `KEY_SOURCE` 移除。  
此时所有 `useDictOptions('ambiguousKey')` 调用会**编译报错**（TS 重载不匹配），  
必须逐一加上 `source` 参数：`useDictOptions('ambiguousKey', 'common')`。

在 `tools/dict-keys-meta.ts` 的 `AMBIGUOUS_META` 补两个 source 的区别说明。

---

## 生成产物说明（registry.ts 结构）

```ts
// AUTO-GENERATED — 禁止手改

export type DictSource = 'common' | 'v1' | 'group' | 'platform' | 'dynamic';

/** 歧义 key：useDictOptions 编译期强制要求 source 参数 */
export const AMBIGUOUS_SOURCES = { ... };

export type AmbiguousKey = keyof typeof AMBIGUOUS_SOURCES;

/** 单一 source 的 key 注册表，共 N 个 key */
// prettier-ignore
export const KEY_SOURCE: Record<string, DictSource> = {
  // ── common ──
  /** 启用/禁用状态（0=禁用 1=启用，全局最高频） */
  enableStateList: 'common',
  // ...
};
```

---

## 与 gen:api 的纪律对比

| 纪律 | gen:api | dict-snapshot |
| --- | --- | --- |
| 产物禁止手改 | `src/api/**` | `registry.ts` |
| 手动维护入口 | `tools/api.ts`（模板/配置） | `tools/dict-keys-meta.ts` |
| 触发条件 | 后端接口变化 | 后端字典 key/字段变化 |
| 运行命令 | `pnpm gen:api` | `pnpm --filter web-ar-admin exec esno tools/dict-snapshot.ts` |
| 额外步骤 | 无 | dynamic key 还需更新 `DYNAMIC_FIELDS` |

---

## 快速判断：用哪个字典？

```
需要某类下拉数据
    ↓
查 spec-dict-keys.md 找中文含义对应的 key
    ↓
是否歧义 key（countryList / currencyList / financialTypeList）？
    ├─ 是 → useDictOptions(key, source)  指定哪个 source
    └─ 否 → useDictOptions(key)          source 自动推断
    ↓
是否 dynamic key？
    ├─ 是 → TanStack Query 懒加载，不需要提前调用任何 load，直接 useDictOptions
    └─ 否 → 已在登录时预热，直接读缓存
```
