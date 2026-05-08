---
title: AI技能调用速查手册
type: guide
status: stable
author: cole
owner: cole
created: 2026-04-29
updated: 2026-05-01
audience: human, ai-agent
---

# AI技能调用速查手册

## 1. 目标

本文档用于解决一个很实际的问题：

- 技能很多
- 名字容易忘
- 提示词每次都临时重写
- 久了就会退回“随口描述任务”，导致 AI 不一定稳定命中正确 skill

目标不是把所有 skill 全背下来，而是给出一套日常够用的最小调用口令。

如果你只想看一页版，优先打开：

- `documents/guides/development/AI技能调用一页口令卡.md`

---

## 2. 先记住一个总模板

如果你忘了具体提示词，先用下面这个总模板：

```text
用 [skill-name] 处理 [目标]。范围：[目录/模块/文件]。输出：[我想先看计划 / 直接实施 / 做 review / 给提示词]。约束：[不要改什么 / 保持什么不变]。
```

只要这 4 个信息说清楚，通常就够了：

- `skill-name`
- `目标`
- `范围`
- `输出要求`

---

## 3. 什么时候该点哪个 skill

| 场景 | 优先 skill | 最小口令 |
| --- | --- | --- |
| 模块内多语言接入 | `module-i18n-onboarding-sop` | `用 module-i18n-onboarding-sop 处理 [路径] 的模块内多语言接入。` |
| 模块 / 页面权限接入与核对 | `module-permission-onboarding-sop` | `用 module-permission-onboarding-sop 处理 [路径] 的权限核对。` |
| 新功能方向还没想清楚 | `superpowers:brainstorming` | `用 superpowers:brainstorming 先把这个需求的方案和边界想清楚。` |
| 模块内多语言接入先做计划 | `pir-planner` | `用 pir-planner 为 [路径] 的模块内多语言接入先出计划。` |
| 已有批准计划，准备正式开工 | `pir-implementer` | `按 pir-implementer 实施 [目标]，基于已批准计划开始改动。` |
| 一轮 bug 列表处理 | `bug-sop` | `用 bug-sop 处理这批 bug，先生成清单和方案卡。` |
| 已知有 bug，但还不知道根因 | `superpowers:systematic-debugging` | `用 superpowers:systematic-debugging 先定位根因。` |
| 准备改功能或修 bug，但还没写失败用例 | `superpowers:test-driven-development` | `用 superpowers:test-driven-development 为 [目标] 先写失败测试，再开始实现。` |
| 改动完成后做独立 review | `pir-reviewer` | `按 pir-reviewer review 这次改动，重点看业务回归和缺失验证。` |
| 改动完成，想先要一轮代码审查反馈 | `superpowers:requesting-code-review` | `用 superpowers:requesting-code-review 为这次改动发起代码审查。` |
| 需要生成本地提交信息 | `commit-local` | `用 commit-local 为当前改动生成 commit message。` |

如果一个任务同时命中多个场景，推荐顺序通常是：

1. 先 `superpowers:systematic-debugging` 或 `bug-sop`
2. 再 `pir-planner`
3. 然后 `pir-implementer`
4. 最后 `pir-reviewer`

---

## 4. 本仓库高频技能速查

### 4.1 本地私有 skills

#### `module-i18n-onboarding-sop`

说明：

- 这是本仓库本地私有 skill
- `SKILL.md` 正文只放 `/.repo-local-skills/`
- 面向开发者的正式说明、速查口令和提示词模板只放 `documents/`

适用：

- 模块内多语言接入
- 老模块补齐 locale（至少 `zh/en`，已有 `vi/id` 资源时同步补齐）
- 盘点哪些写法不支持 `switchLocale()`
- 需要一段可直接发给 AI 的国际化提示词

最小口令：

```text
用 module-i18n-onboarding-sop 处理 src/views/operations/takePackage 的模块内多语言接入。
```

先盘点版：

```text
按 module-i18n-onboarding-sop 先盘点 src/views/operations/takePackage 的模块内多语言接入范围，不要立即改代码。
```

只要提示词版：

```text
按 module-i18n-onboarding-sop 给我一段 src/views/operations/takePackage 的模块内多语言接入提示词。
```

#### `module-permission-onboarding-sop`

说明：

- 这是本仓库本地私有 skill
- `SKILL.md` 正文只放 `/.repo-local-skills/`
- 面向开发者的正式说明、速查口令和提示词模板只放 `documents/`

适用：

- 单个模块或页面的权限码接入与核对
- 基于真实权限树的权限权威核对
- 盘点权限码是否已经在路由、Tab、按钮、操作列、批量操作和 handler 上正确消费
- 需要一段可直接发给 AI 的权限核对提示词

最小口令：

```text
用 module-permission-onboarding-sop 处理 src/views/finance/withdrawOrder/dashboard 的权限核对。
```

缺数据先中断版：

```text
按 module-permission-onboarding-sop 处理 src/views/finance/withdrawOrder/dashboard 的权限核对；如果拿不到真实权限树，就直接中断并告诉我需要提供账号密码、可用 token 或真实返回体。
```

只要提示词版：

```text
按 module-permission-onboarding-sop 给我一段 src/views/finance/withdrawOrder/dashboard 的权限核对提示词。
```

#### `bug-sop`

适用：

- 从禅道 bug 列表进入
- 一轮批量缺陷处理
- 需要先生成清单、方案卡、批次决策，再进入实施

最小口令：

```text
用 bug-sop 处理这批 bug，先生成处理前清单和方案卡，再决定实施批次。
```

#### `commit-local`

适用：

- 需要按当前仓库本地提交口径生成 commit message
- 希望 `subject` 默认保持简体中文

最小口令：

```text
用 commit-local 为当前改动生成 commit message。
```

---

### 4.2 PIR 系列

#### `pir-planner`

适用：

- 需求已明确
- 准备改代码
- 想先形成一个可执行计划，不直接落盘

最小口令：

```text
用 pir-planner 为 [任务目标] 产出实施计划，先不要改代码。
```

例子：

```text
用 pir-planner 为 src/views/operations/takePackage 的模块内多语言接入产出实施计划，先不要改代码。
```

#### `pir-implementer`

适用：

- 已经有批准的计划
- 现在进入正式实施阶段

最小口令：

```text
按 pir-implementer 实施 [任务目标]，基于已批准计划开始改动。
```

#### `pir-reviewer`

适用：

- 改动已经完成
- 需要做独立 review
- 重点关注 bug、回归、缺失验证，而不是风格

最小口令：

```text
按 pir-reviewer review 这次改动，重点看业务回归、边界条件和缺失验证。
```

---

### 4.3 Superpowers 常用技能

#### `superpowers:brainstorming`

适用：

- 功能要做，但方案还不稳定
- 你还在比较几种实现路线
- 你希望先把边界、非目标和权衡说清楚

最小口令：

```text
用 superpowers:brainstorming 先把这个需求的方案、边界和风险想清楚。
```

#### `superpowers:systematic-debugging`

适用：

- 线上/本地出现 bug
- 当前还不知道根因
- 需要先定位问题，再决定改法

最小口令：

```text
用 superpowers:systematic-debugging 分析这个问题，先定位根因，不要急着改代码。
```

#### `superpowers:writing-plans`

适用：

- 任务比较大
- 涉及多个文件或模块
- 想先把方案拆清楚

最小口令：

```text
用 superpowers:writing-plans 为这个任务写一个可执行计划。
```

#### `superpowers:test-driven-development`

适用：

- 准备改功能或修 bug
- 想先补失败测试，再进入实现
- 需要把“验证什么”先固定下来

最小口令：

```text
用 superpowers:test-driven-development 为这次改动先写失败测试，再开始实现。
```

#### `superpowers:requesting-code-review`

适用：

- 代码改完了，但还没正式交付
- 想先要一轮独立代码审查反馈
- 希望在合并前尽早暴露问题

最小口令：

```text
用 superpowers:requesting-code-review 为这次改动发起代码审查。
```

#### `superpowers:verification-before-completion`

适用：

- 改动基本完成
- 准备对外说“做完了”
- 希望先补验证证据

最小口令：

```text
用 superpowers:verification-before-completion 复核这次改动的验证项和证据。
```

---

## 5. 最实用的组合口令

### 5.1 模块内多语言接入

```text
先用 pir-planner 为 [模块路径] 的模块内多语言接入写计划；计划确认后，再按 module-i18n-onboarding-sop 执行实施。
```

更完整版本：

```text
先用 superpowers:brainstorming 把 [模块路径] 的模块内多语言接入边界想清楚；再用 pir-planner 出计划；计划确认后按 pir-implementer 实施，最后用 pir-reviewer 做 review。
```

### 5.2 模块 / 页面权限接入与核对

```text
先用 module-permission-onboarding-sop 处理 [模块路径] 的权限核对；如果当前没有真实权限树，就先中断并告诉我需要补账号密码、可用 token 或真实返回体。
```

### 5.3 一轮 bug 处理

```text
先用 bug-sop 处理这批 bug，输出清单和方案卡；确定后再按 pir-implementer 实施，最后用 pir-reviewer 做 review。
```

### 5.4 复杂问题先查根因

```text
先用 superpowers:systematic-debugging 定位根因；确认后再决定是否走 pir-planner 或直接实施。
```

### 5.5 正常功能开发

```text
先用 superpowers:brainstorming 想清楚方案；再用 pir-planner 出计划；实施时按 pir-implementer 执行，并用 superpowers:test-driven-development 先写失败测试；完成后用 superpowers:requesting-code-review 或 pir-reviewer 做 review。
```

---

## 6. 放在哪里最合适

当前建议分两层：

- 正式速查手册放在 `documents/guides/development/`
- `.repo-local-skills/README.md` 只保留本地 skills 入口、匹配命令和跳转说明

原因：

- `superpowers`、`PIR` 不属于 `.repo-local-skills/` 本身
- 如果把所有 skill 的使用手册都堆进 `.repo-local-skills/`，边界会变乱
- 正式开发手册更适合作为长期可维护入口

---

## 7. 忘了提示词时的最低策略

如果你连本文档都懒得翻，最低可用写法就是：

```text
用 [skill-name] 处理 [目标]，范围是 [路径]，先 [计划 / 盘点 / 实施 / review]。
```

例如：

```text
用 module-i18n-onboarding-sop 处理 src/views/operations/takePackage，先盘点。
```

```text
用 module-permission-onboarding-sop 处理 src/views/finance/withdrawOrder/dashboard；如果拿不到真实权限树，就先中断并补数据。
```

```text
用 pir-planner 处理 takePackage 模块内多语言接入，先出计划。
```

```text
用 bug-sop 处理这批 bug，先生成清单。
```

```text
用 superpowers:brainstorming 处理这个需求，先把方案想清楚。
```

---

## 8. 关联

- `documents/design/technical/2026-05-01-前端国际化方案.md`
- `documents/guides/development/模块内多语言接入AI提示词模板.md`
- `documents/guides/development/权限核对AI提示词模板.md`
- `documents/guides/development/国际化接入与运行时机制说明.md`
- `documents/guides/development/权限接入与模块核对SOP.md`
- `.repo-local-skills/README.md`
