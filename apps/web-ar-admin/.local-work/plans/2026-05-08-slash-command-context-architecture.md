# Slash Command 上下文架构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 i18n 和 dict 两个子系统各建一个 CLAUDE.md 作为规则唯一来源，新增 3 个 i18n slash command，更新现有 2 个 dict command，收窄全局 CLAUDE.md 中的 dict 章节。

**Architecture:** 每个子系统在代码目录旁放 CLAUDE.md（AI 读），命令文件只写"读哪里 + 执行步骤"，不内联规则。规则改一处，所有命令自动受益。全局 CLAUDE.md 只保留高频违规摘要，指向子系统 CLAUDE.md。

**Tech Stack:** Markdown 文件操作，无编译步骤。所有任务独立，可任意顺序执行。

---

## 文件清单

| 操作 | 文件                                               |
| ---- | -------------------------------------------------- |
| 新建 | `apps/web-ar-admin/src/locales/CLAUDE.md`          |
| 新建 | `apps/web-ar-admin/src/composables/dict/CLAUDE.md` |
| 新建 | `.claude/commands/i18n-fix.md`                     |
| 新建 | `.claude/commands/i18n.md`                         |
| 新建 | `.claude/commands/i18n-check.md`                   |
| 更新 | `.claude/commands/dict.md`                         |
| 更新 | `.claude/commands/dict-sync.md`                    |
| 更新 | `CLAUDE.md`（根目录）                              |

---

## Task 1：新建 `src/locales/CLAUDE.md`

**Files:**

- Create: `apps/web-ar-admin/src/locales/CLAUDE.md`

- [ ] **Step 1: 创建文件**

内容如下（完整复制，不增删）：

```markdown
# i18n Agent Context

## 支持语言

zh-CN / en-US（仅这两种）

## 调用 API

模板: $t('key.path') script setup: const { t } = useI18n(); → t('key.path') 非组件上下文: import { $t } from '#/locales' → $t('key.path')

## Key 命名规范

- 以文件名为 namespace 前缀: finance.withdrawOrder.title
- 嵌套对象表达层次: { finance: { withdrawOrder: { title: "..." } } }
- 新增 key 风格参考同文件已有 key

## 文件推断（业务域 → JSON 文件）

充值/提现/结算/财务/手续费 → finance.json报表/报告/统计 → report.json系统/用户/角色/权限/管理员 → system.json商户/租户 → tenant.json会员/玩家 → member.json代理/分销 → agent.json游戏/彩票 → game.json菜单/导航 → menu.json运营/活动/公告 → operations.json通用按钮/状态/操作/提示 → page.json 或 common.json

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

- [ ] **Step 2: 验证文件存在**

```bash
ls apps/web-ar-admin/src/locales/CLAUDE.md
```

预期：文件存在，无报错。

- [ ] **Step 3: Commit**

```bash
git add apps/web-ar-admin/src/locales/CLAUDE.md
git commit -m "docs(@vben/web-ar-admin): add src/locales/CLAUDE.md — i18n agent context"
```

---

## Task 2：新建 `src/composables/dict/CLAUDE.md`

**Files:**

- Create: `apps/web-ar-admin/src/composables/dict/CLAUDE.md`

- [ ] **Step 1: 创建文件**

内容如下（完整复制，不增删）：

````markdown
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
````

## 歧义 key（必须显式指定 source，否则编译报错）

countryList / currencyList / financialTypeList

## 禁止的旧写法

❌ userStore.getDictionaryList?.enableStateList ❌ const { getOptions } = useDictionary() ❌ const dictStore = useDynamicDictionaryStore(); dictStore.load(...) ❌ 手改 registry.ts

## CRUD 后失效 dynamic dict

```ts
import { queryClient } from '#/lib/query-client';
import { DICT_QUERY_KEY } from '#/store/dict';
queryClient.invalidateQueries({ queryKey: DICT_QUERY_KEY.dynamic });
```

## Key 元数据（source、含义、label/value 字段）

完整列表见：.migration/specs/spec-dict-keys.md

## 维护说明

本文件是字典调用规则的唯一来源。变更时必须同步检查：

- .claude/commands/dict.md
- .claude/commands/dict-sync.md
- 根目录 CLAUDE.md（字典规范摘要节）

触发更新时机：API 变化、source 规则调整、新增 key 类型、禁止写法列表扩充

````

- [ ] **Step 2: 验证文件存在**

```bash
ls apps/web-ar-admin/src/composables/dict/CLAUDE.md
````

预期：文件存在，无报错。

- [ ] **Step 3: Commit**

```bash
git add apps/web-ar-admin/src/composables/dict/CLAUDE.md
git commit -m "docs(@vben/web-ar-admin): add src/composables/dict/CLAUDE.md — dict agent context"
```

---

## Task 3：新建 `.claude/commands/i18n.md`

**Files:**

- Create: `.claude/commands/i18n.md`

- [ ] **Step 1: 创建文件**

```markdown
# /i18n — 翻译 key 查询助手

规则来源: `apps/web-ar-admin/src/locales/CLAUDE.md`（文件推断表、禁止项）

用途：搜索已有翻译 key；搜不到时给出添加指引。

## 用法
```

/i18n <关键词>

```

## 执行步骤

1. 读 `apps/web-ar-admin/src/locales/CLAUDE.md` — 获取文件推断规则
2. 在 `apps/web-ar-admin/src/locales/langs/zh-CN/*.json` 中全文搜索 `$ARGUMENTS`（匹配 value 中文或 key 路径片段）
3. 在 `apps/web-ar-admin/src/locales/langs/en-US/*.json` 中做相同搜索（兼顾英文关键词查询场景）
4. 对每个命中的 key，读对应 en-US 文件的同路径 value

## 找到时输出

```

关键词: "提现工单"

✓ 找到 2 个匹配

1. finance.withdrawOrder.title文件: finance.json zh-CN: "提现工单" en-US: "Withdrawal Order" 用法: $t('finance.withdrawOrder.title')

2. menu.withdrawOrder文件: menu.json zh-CN: "提现工单管理" en-US: "Withdrawal Orders" 用法: $t('menu.withdrawOrder')

```

## 搜不到时输出

根据关键词语义查 CLAUDE.md 文件推断表，给出添加指引：

```

关键词: "结算报告"

✗ 未找到匹配的翻译 key

建议添加位置：文件: src/locales/langs/zh-CN/report.json（含"报告"语义）src/locales/langs/en-US/report.json（同步添加）推荐 key 路径: report.settlement.title（参考同文件现有 key 命名风格）

下一步: 在两个文件中添加对应 key，保持 key 结构和 zh-CN 完全一致。

```

```

- [ ] **Step 2: 验证文件存在**

```bash
ls .claude/commands/i18n.md
```

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/i18n.md
git commit -m "feat(@vben/web-ar-admin): add /i18n slash command"
```

---

## Task 4：新建 `.claude/commands/i18n-check.md`

**Files:**

- Create: `.claude/commands/i18n-check.md`

- [ ] **Step 1: 创建文件**

```markdown
# /i18n-check — i18n 覆盖检查

规则来源: `apps/web-ar-admin/src/locales/CLAUDE.md`（支持语言、文件结构）

用途：检查 zh-CN 和 en-US 的文件对齐、key 覆盖、空值。三层检查按严重程度排列，发现问题不中断。

## 用法
```

/i18n-check

```

## 执行步骤

1. **【文件对齐】** 列出 `langs/zh-CN/` 和 `langs/en-US/` 的文件名集合，报告单边存在的文件
2. **【Key 覆盖】** 对两边都存在的文件，递归展开嵌套对象提取所有叶子 key，报告只在一边有的 key
3. **【空值检测】** 扫描两个目录所有文件，报告 value 为 `""` 的 key
4. 输出汇总报告

## 输出格式（有问题时）

```

# i18n 覆盖检查报告

【文件对齐】✓ zh-CN: 19 个文件 ✓ en-US: 19 个文件 ✗ 缺失: en-US/report.json（zh-CN 有，en-US 无）

【Key 覆盖】finance.json ✗ zh-CN 有、en-US 缺失 (2 个): finance.withdrawOrder.newField finance.fee.tip ✓ en-US 无多余 key

system.json ✓ 完全对齐（其余文件全部对齐，省略）

【空值 Key】en-US/member.json member.level.desc → ""

================== 检查完成文件缺失: 1 个 Key 缺失: 2 个空值 Key: 1 个 ==================

```

## 输出格式（全部通过时）

```

================== 检查完成 ✓ 无问题 ==================

```

```

- [ ] **Step 2: 验证文件存在**

```bash
ls .claude/commands/i18n-check.md
```

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/i18n-check.md
git commit -m "feat(@vben/web-ar-admin): add /i18n-check slash command"
```

---

## Task 5：新建 `.claude/commands/i18n-fix.md`

**Files:**

- Create: `.claude/commands/i18n-fix.md`

- [ ] **Step 1: 创建文件**

```markdown
# /i18n-fix — 模块多语言问题修复

规则来源: `apps/web-ar-admin/src/locales/CLAUDE.md`（API 用法、key 命名、文件推断、禁止项）

用途：扫描指定目录或文件下的所有多语言问题并直接修复。无需阅读其他 i18n 文档。

## 用法
```

/i18n-fix <路径>

```

示例:
- `/i18n-fix apps/web-ar-admin/src/views/finance/`
- `/i18n-fix apps/web-ar-admin/src/views/system/user/index.vue`

## 执行步骤

1. **读规则** — 读 `apps/web-ar-admin/src/locales/CLAUDE.md`，获取：
   - 三种调用 API（模板 / script setup / 非组件上下文）
   - Key 命名规范
   - 文件推断表（业务域 → JSON 文件）
   - 禁止项（字典 label 不走 locale、两套同步等）

2. **扫描问题** — 扫描 `$ARGUMENTS` 路径下所有 `.vue` / `.ts` 文件，识别：
   - 硬编码中文字符串（模板或 script 中未用 `$t` / `t()` 包裹的中文文本）
   - `$t(key)` 中的 key 在 locale JSON 中不存在
   - 错误调用方式（如在 `<script setup>` 中使用模板专用 `$t`）

3. **感知命名风格** — 根据文件推断表确定目标 JSON 文件，读该文件前 30 行，感知现有 key 命名风格

4. **直接修复** — 逐文件修复所有问题：
   - 替换硬编码中文为 `$t('namespace.key.path')`（模板）或 `t('namespace.key.path')`（script setup）
   - 在 `langs/zh-CN/<file>.json` 和 `langs/en-US/<file>.json` 中同步添加对应 key
   - en-US value 暂填英文直译（格式: 首字母大写的英文词组），标注 `// TODO: verify translation`

5. **输出报告** — 完成后输出：
   - 修改的业务文件列表
   - 新增的 key 列表（含 zh-CN / en-US value）
   - 如有无法自动推断文件的 key，列出供人工确认

## 注意

- 字典 label（启用/禁用等状态值）不属于多语言问题，跳过
- 如遇到 key 命名不确定的情况，参考同模块已有 key 的风格，宁可保守也不要乱命名
```

- [ ] **Step 2: 验证文件存在**

```bash
ls .claude/commands/i18n-fix.md
```

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/i18n-fix.md
git commit -m "feat(@vben/web-ar-admin): add /i18n-fix slash command"
```

---

## Task 6：更新 `.claude/commands/dict.md` 和 `dict-sync.md`

**Files:**

- Modify: `.claude/commands/dict.md`（第 1 行后插入）
- Modify: `.claude/commands/dict-sync.md`（第 1 行后插入）

- [ ] **Step 1: 更新 dict.md**

在 `# /dict — 字典 key 查询助手` 标题后、`用途：` 行前，插入两行：

```markdown
规则来源: `apps/web-ar-admin/src/composables/dict/CLAUDE.md` 数据来源: `apps/web-ar-admin/.migration/specs/spec-dict-keys.md`
```

更新后文件开头应为：

```markdown
# /dict — 字典 key 查询助手

规则来源: `apps/web-ar-admin/src/composables/dict/CLAUDE.md` 数据来源: `apps/web-ar-admin/.migration/specs/spec-dict-keys.md`

用途：快速查找字典 key、确认 source、查看 label/value 字段映射。
```

- [ ] **Step 2: 更新 dict-sync.md**

在 `# /dict-sync — 字典全量同步（类似 gen:api）` 标题后、`用途：` 行前，插入两行：

```markdown
规则来源: `apps/web-ar-admin/src/composables/dict/CLAUDE.md` 数据来源: `apps/web-ar-admin/.migration/specs/spec-dict-keys.md`
```

更新后文件开头应为：

```markdown
# /dict-sync — 字典全量同步（类似 gen:api）

规则来源: `apps/web-ar-admin/src/composables/dict/CLAUDE.md` 数据来源: `apps/web-ar-admin/.migration/specs/spec-dict-keys.md`

用途：后端新增/修改字典 key 后，一键同步 registry、ALL_DYNAMIC_KEYS、DYNAMIC_FIELDS 和文档。
```

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/dict.md .claude/commands/dict-sync.md
git commit -m "docs(@vben/web-ar-admin): add rule/data source declarations to dict commands"
```

---

## Task 7：更新根目录 `CLAUDE.md`

**Files:**

- Modify: `CLAUDE.md`（根目录）

本任务包含两处修改：字典规范章节瘦身 + 可用 Slash Commands 表格补充 i18n 命令。

- [ ] **Step 1: 替换字典规范章节**

将现有 `## 字典使用规范` 章节（从标题到 `---` 分隔线，约 60 行）替换为：

```markdown
## 字典使用规范

完整规则见 `apps/web-ar-admin/src/composables/dict/CLAUDE.md`。

核心约束（高频违规）：

- 调用入口：`useDictOptions` / `useLabelMap`，从 `#/composables/dict` 导入
- 歧义 key（`countryList` / `currencyList` / `financialTypeList`）必须指定 source
- 禁止读 store、手改 registry.ts、使用旧 useDictionary hook

---
```

- [ ] **Step 2: 在可用 Slash Commands 表格中补充 i18n 命令**

找到 `## 可用 Slash Commands` 下的表格，将：

```markdown
| 命令 | 用途 |
| --- | --- |
| `/dict <关键词>` | 查字典 key：source、字段映射、用法示例 |
| `/dict-sync` | 全量同步字典（重跑脚本 + 更新 ALL_DYNAMIC_KEYS + DYNAMIC_FIELDS + spec-dict-keys.md） |
```

替换为：

```markdown
| 命令 | 用途 |
| --- | --- |
| `/dict <关键词>` | 查字典 key：source、字段映射、用法示例 |
| `/dict-sync` | 全量同步字典（重跑脚本 + 更新 ALL_DYNAMIC_KEYS + DYNAMIC_FIELDS + spec-dict-keys.md） |
| `/i18n <关键词>` | 查翻译 key：zh-CN / en-US 值、用法示例；搜不到时给出添加指引 |
| `/i18n-check` | 检查 zh-CN / en-US 文件对齐、key 覆盖、空值 |
| `/i18n-fix <路径>` | 扫描指定目录/文件的多语言问题并直接修复 |
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: slim dict section in CLAUDE.md, add i18n slash commands to command table"
```

---

## 完成标志

- [ ] `ls apps/web-ar-admin/src/locales/CLAUDE.md` 存在
- [ ] `ls apps/web-ar-admin/src/composables/dict/CLAUDE.md` 存在
- [ ] `ls .claude/commands/i18n.md .claude/commands/i18n-check.md .claude/commands/i18n-fix.md` 三个文件均存在
- [ ] `.claude/commands/dict.md` 和 `dict-sync.md` 文件头部有 `规则来源` 声明
- [ ] 根目录 `CLAUDE.md` 字典章节只剩 3 行核心约束 + 指针
- [ ] 根目录 `CLAUDE.md` 可用命令表格包含 5 个命令
