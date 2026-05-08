---
title: Slash Command 上下文架构设计
type: design
status: stable
author: cole
owner: cole
created: 2026-05-08
updated: 2026-05-08
audience: human, ai-agent
---

# Slash Command 上下文架构设计

## 1. 背景与问题

项目有多个 Slash Command（`/dict`、`/dict-sync`、`/i18n`、`/i18n-check`）。这些命令在执行时需要"工作知识"——如何调用 API、key 命名规范、禁止什么写法。

当前问题：

- 规则散落在全局 `CLAUDE.md`、架构文档、命令文件内联文本中
- 底层代码变更时，不清楚需要更新哪些文件，存在断链风险
- 架构文档（200-300 行）远超 agent 执行任务所需，上下文浪费

## 2. 解法：子系统 CLAUDE.md

每个子系统在其代码目录旁放置一个 `CLAUDE.md`，作为该子系统执行规则的**唯一来源**。

```
src/locales/
  CLAUDE.md          ← i18n 执行规则（AI 读）
  README.md          ← 架构说明（人读，不动）
  index.ts
  langs/...

src/composables/dict/
  CLAUDE.md          ← 字典执行规则（AI 读）
  registry.ts
  useDictionary.ts
  index.ts
```

**原则：**
- 命令文件只写"读哪里 + 执行步骤"，不内联规则
- 规则只在子系统 CLAUDE.md 里维护，改一处，所有命令自动受益
- 架构文档（`documents/`）供人阅读，不作为命令的上下文来源

## 3. `src/locales/CLAUDE.md` 内容

```markdown
# i18n Agent Context

## 支持语言
zh-CN / en-US（仅这两种）

## 调用 API
模板:           $t('key.path')
script setup:   const { t } = useI18n();  →  t('key.path')
非组件上下文:   import { $t } from '#/locales'  →  $t('key.path')

## Key 命名规范
- 以文件名为 namespace 前缀: finance.withdrawOrder.title
- 嵌套对象表达层次: { finance: { withdrawOrder: { title: "..." } } }
- 新增 key 风格参考同文件已有 key

## 文件推断（业务域 → JSON 文件）
充值/提现/结算/财务/手续费  →  finance.json
报表/报告/统计              →  report.json
系统/用户/角色/权限/管理员  →  system.json
商户/租户                   →  tenant.json
会员/玩家                   →  member.json
代理/分销                   →  agent.json
游戏/彩票                   →  game.json
菜单/导航                   →  menu.json
运营/活动/公告              →  operations.json
通用按钮/状态/操作/提示     →  page.json 或 common.json

## 禁止
- 状态枚举 label（启用/禁用/订单状态）→ 走字典，不走 locale JSON
- 只改 zh-CN 不改 en-US（必须两套同步）
- 修改 packages/locales/ 下的 vben 框架层文件

## 维护说明
本文件是 i18n 执行规则的唯一来源。变更时必须同步检查：
- .claude/commands/i18n-fix.md
- .claude/commands/i18n.md
- .claude/commands/i18n-check.md
- documents/guides/development/国际化接入与运行时机制说明.md

触发更新时机：新增/删除 locale JSON 文件、API 变化、命名规范调整、支持语言变更
```

## 4. `src/composables/dict/CLAUDE.md` 内容

```markdown
# 字典 Agent Context

## 调用 API
import { useDictOptions, useLabelMap } from '#/composables/dict'

下拉选项:  useDictOptions('enableStateList')
Label Map: useLabelMap('enableStateList')
歧义 key:  useDictOptions('countryList', 'platform')  ← 必须指定 source

## 歧义 key（必须显式指定 source，否则编译报错）
countryList / currencyList / financialTypeList

## 禁止的旧写法
❌ userStore.getDictionaryList?.enableStateList
❌ const { getOptions } = useDictionary()
❌ const dictStore = useDynamicDictionaryStore(); dictStore.load(...)
❌ 手改 registry.ts

## CRUD 后失效 dynamic dict
import { queryClient } from '#/lib/query-client'
import { DICT_QUERY_KEY } from '#/store/dict'
queryClient.invalidateQueries({ queryKey: DICT_QUERY_KEY.dynamic })

## Key 元数据（source、含义、label/value 字段）
完整列表见：.migration/specs/spec-dict-keys.md

## 维护说明
本文件是字典调用规则的唯一来源。变更时必须同步检查：
- .claude/commands/dict.md
- .claude/commands/dict-sync.md
- 根目录 CLAUDE.md（字典规范摘要节）

触发更新时机：API 变化、source 规则调整、新增 key 类型、禁止写法列表扩充
```

## 5. 命令文件变更

### 5.1 新增 `.claude/commands/i18n-fix.md`

```markdown
# /i18n-fix — 模块多语言问题修复

用途：扫描指定目录或文件下的所有多语言问题并直接修复。

## 用法
/i18n-fix <路径>
示例: /i18n-fix src/views/finance/

## 执行步骤

1. 读 `src/locales/CLAUDE.md` — 获取完整执行规则
2. 扫描 `$ARGUMENTS` 路径下所有 .vue / .ts 文件，识别问题：
   - 硬编码中文字符串（未用 $t 包裹）
   - $t key 在 locale JSON 中不存在
   - 错误的调用方式（如在 script 中用模板 $t）
3. 读目标域对应的 locale JSON 前 30 行 — 感知当前 key 命名风格
4. 直接修复所有问题：
   - 替换硬编码中文为 $t('key.path')
   - 在 zh-CN / en-US 两个 JSON 文件中添加对应 key
5. 输出变更报告：修改了哪些文件、新增了哪些 key
```

### 5.2 更新 `.claude/commands/i18n.md` 和 `i18n-check.md`

在文件头部加一行：

```markdown
规则来源: src/locales/CLAUDE.md（文件推断表、禁止项）
```

### 5.3 更新 `.claude/commands/dict.md` 和 `dict-sync.md`

在文件头部加两行：

```markdown
规则来源: src/composables/dict/CLAUDE.md
数据来源: .migration/specs/spec-dict-keys.md
```

## 6. 全局 CLAUDE.md 变更

字典规范章节从约 60 行缩减为摘要 + 指针：

```markdown
## 字典使用规范

完整规则见 `src/composables/dict/CLAUDE.md`。

核心约束（高频违规）：
- 调用入口：`useDictOptions` / `useLabelMap`，从 `#/composables/dict` 导入
- 歧义 key（countryList / currencyList / financialTypeList）必须指定 source
- 禁止读 store、手改 registry.ts、使用旧 useDictionary hook
```

## 7. 文件清单

| 操作 | 文件 |
|---|---|
| 新建 | `src/locales/CLAUDE.md` |
| 新建 | `src/composables/dict/CLAUDE.md` |
| 新建 | `.claude/commands/i18n-fix.md` |
| 更新 | `.claude/commands/i18n.md`（加规则来源声明）|
| 更新 | `.claude/commands/i18n-check.md`（加规则来源声明）|
| 更新 | `.claude/commands/dict.md`（加规则来源声明）|
| 更新 | `.claude/commands/dict-sync.md`（加规则来源声明）|
| 更新 | 根目录 `CLAUDE.md`（字典章节瘦身）|

## 8. 不在范围内

- 自动检测 CLAUDE.md 过期（由维护说明节的人工/AI 检查替代）
- 其他子系统（store、request）的 CLAUDE.md（待需要时按相同模式扩展）
- `/i18n-add` 独立命令（直接编辑 JSON 即可，无需封装）
