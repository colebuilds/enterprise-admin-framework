# 字典 Agent Context

## 调用 API

```ts
import { useDictOptions, useLabelMap } from '#/composables/dict';

// 下拉选项
const opts = useDictOptions('enableStateList');
// Label Map（表格列渲染）
const map = useLabelMap('enableStateList');
// 歧义 key 必须指定 source
const countryOpts = useDictOptions('countryList', 'platform');
```

## 歧义 key（必须显式指定 source，否则编译报错）

`countryList` / `currencyList` / `financialTypeList`

## 禁止的旧写法

- ❌ `userStore.getDictionaryList?.enableStateList`
- ❌ `const { getOptions } = useDictionary()`
- ❌ `const dictStore = useDynamicDictionaryStore(); dictStore.load(...)`
- ❌ 手改 `registry.ts`

## CRUD 后失效 dynamic dict

```ts
import { queryClient } from '#/lib/query-client';
import { DICT_QUERY_KEY } from '#/store/dict';
queryClient.invalidateQueries({ queryKey: DICT_QUERY_KEY.dynamic });
```

## Key 元数据（source、含义、label/value 字段）

完整列表见：`apps/web-ar-admin/.migration/specs/spec-dict-keys.md`

## 维护说明

本文件是字典调用规则的唯一来源。变更时必须同步检查：

- `.claude/commands/dict.md`
- `.claude/commands/dict-sync.md`
- 根目录 `CLAUDE.md`（字典规范摘要节）

触发更新时机：API 变化、source 规则调整、新增 key 类型、禁止写法列表扩充
