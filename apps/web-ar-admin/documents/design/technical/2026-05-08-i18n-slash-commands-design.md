---
title: i18n Slash Commands 设计规格
type: design
status: stable
author: cole
owner: cole
created: 2026-05-08
updated: 2026-05-08
audience: human, ai-agent
---

# i18n Slash Commands 设计规格

## 1. 背景

项目已有 `/dict` 和 `/dict-sync` 两个 Slash Command，解决了字典 key 查询和同步问题。

多语言场景有类似的查询和验证需求：

- 迁移页面时需要确认翻译 key 是否已存在（避免重复造 key）
- 批量迁入 locale 文件后需要验证 zh-CN / en-US 是否完全对齐

本文定义两个新命令：`/i18n` 和 `/i18n-check`。

---

## 2. 命令清单

| 命令             | 用途                                        | 变更 |
| ---------------- | ------------------------------------------- | ---- |
| `/i18n <关键词>` | 搜索已有翻译 key；搜不到时给出添加指引      | 只读 |
| `/i18n-check`    | 检查 zh-CN / en-US 文件对齐、key 覆盖、空值 | 只读 |

两个命令均为只读操作。实际的文件写入由 AI agent 在得到指引后直接完成，无需封装为命令（参考 `/dict` 不提供 add 命令的同样逻辑）。

---

## 3. `/i18n <关键词>`

### 3.1 用途

在写 `$t('...')` 之前，先确认有无现成 key 可以复用。搜不到时给出应加到哪个文件、用什么路径的指引。

### 3.2 执行逻辑

1. 在 `apps/web-ar-admin/src/locales/langs/zh-CN/*.json` 中全文搜索 `$ARGUMENTS`，匹配 value 中的中文文本或 key 路径片段
2. 在 `apps/web-ar-admin/src/locales/langs/en-US/*.json` 中做相同搜索（兼顾用英文关键词查询的场景）
3. 对每个命中的 key，从对应的 en-US 文件读取同路径的 value

### 3.3 找到时的输出格式

```
关键词: "提现工单"

✓ 找到 2 个匹配

1. finance.withdrawOrder.title
   文件: finance.json
   zh-CN: "提现工单"
   en-US: "Withdrawal Order"
   用法:  $t('finance.withdrawOrder.title')

2. menu.withdrawOrder
   文件: menu.json
   zh-CN: "提现工单管理"
   en-US: "Withdrawal Orders"
   用法:  $t('menu.withdrawOrder')
```

### 3.4 搜不到时的输出格式

```
关键词: "结算报告"

✗ 未找到匹配的翻译 key

建议添加位置：
  文件: src/locales/langs/zh-CN/report.json（含"报告"语义的文件）
       src/locales/langs/en-US/report.json（同步添加）
  推荐 key 路径: report.settlement.title 或 report.settlementReport
               （参考同文件现有 key 命名风格）

下一步: 在两个文件中添加对应 key，保持 key 结构和 zh-CN 完全一致。
```

### 3.5 文件推断规则

搜不到时，根据关键词语义推断应放入的文件：

| 关键词含义                       | 推断文件                     |
| -------------------------------- | ---------------------------- |
| 包含"充值/提现/结算/财务/手续费" | `finance.json`               |
| 包含"报表/报告/统计"             | `report.json`                |
| 包含"系统/用户/角色/权限/管理员" | `system.json`                |
| 包含"商户/租户"                  | `tenant.json`                |
| 包含"会员/玩家/用户账户"         | `member.json`                |
| 包含"代理/分销"                  | `agent.json`                 |
| 包含"游戏/彩票"                  | `game.json`                  |
| 包含"菜单/导航"                  | `menu.json`                  |
| 包含"运营/活动/公告"             | `operations.json`            |
| 通用词汇（按钮/状态/操作/提示）  | `page.json` 或 `common.json` |

若无法推断，建议查看同类页面的 key 所在文件作为参考。

---

## 4. `/i18n-check`

### 4.1 用途

批量迁入 locale 文件后，验证 zh-CN 和 en-US 的完整性。三层检查按严重程度排列，发现问题不中断，继续检查后续层级。

### 4.2 执行逻辑

**层 1 — 文件对齐**（最严重）

比对 `langs/zh-CN/` 和 `langs/en-US/` 的文件列表，报告单边存在的文件。

**层 2 — Key 覆盖**

对两边都存在的文件，提取所有叶子 key（递归展开嵌套对象），报告只在一边有的 key。

**层 3 — 空值检测**

扫描两个目录所有文件，报告 value 为 `""` 的 key。

### 4.3 输出格式

```
i18n 覆盖检查报告
==================

【文件对齐】
✓ zh-CN: 19 个文件
✓ en-US: 19 个文件
✗ 缺失: en-US/report.json（zh-CN 有，en-US 无）

【Key 覆盖】
finance.json
  ✗ zh-CN 有、en-US 缺失 (2 个):
      finance.withdrawOrder.newField
      finance.fee.tip
  ✓ en-US 无多余 key

system.json  ✓ 完全对齐
member.json  ✓ 完全对齐
（其余文件全部对齐，省略）

【空值 Key】
en-US/member.json
  member.level.desc → ""
en-US/system.json
  system.user.placeholder → ""

==================
检查完成
文件缺失: 1 个
Key 缺失: 2 个
空值 Key: 2 个
==================
```

全部通过时：

```
==================
检查完成 ✓ 无问题
==================
```

---

## 5. 实现方式

两个命令均实现为 `.claude/commands/` 下的 Markdown 文件，与 `/dict`、`/dict-sync` 完全相同的模式。

| 文件                             | 命令          |
| -------------------------------- | ------------- |
| `.claude/commands/i18n.md`       | `/i18n`       |
| `.claude/commands/i18n-check.md` | `/i18n-check` |

命令文件描述执行步骤（读哪些文件、搜什么、输出什么格式），Claude Code 按步骤执行，不需要额外脚本。

---

## 6. 不在范围内

- `/i18n-add`：添加 key 只需编辑 2 个 JSON 文件，AI agent 直接操作即可，无需封装命令
- 多语言扩展（vi-VN/id-ID）：当前项目只支持 zh-CN / en-US，命令硬编码这两个路径
- 翻译质量检查（机器翻译检测、一致性校验）：超出当前迁移阶段的范围
