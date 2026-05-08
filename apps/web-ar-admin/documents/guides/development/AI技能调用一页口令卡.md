---
title: AI技能调用一页口令卡
type: guide
status: stable
author: cole
owner: cole
created: 2026-04-30
updated: 2026-05-01
audience: human, ai-agent
---

# AI技能调用一页口令卡

## 1. 先选场景

| 你现在要做什么             | 优先 skill                                     |
| -------------------------- | ---------------------------------------------- |
| 新功能方案还没想清楚       | `superpowers:brainstorming`                    |
| 准备正式规划任务           | `pir-planner`                                  |
| 已有批准计划，准备开工     | `pir-implementer`                              |
| 已知有 bug，但还不知道根因 | `superpowers:systematic-debugging`             |
| 一轮 bug 列表处理          | `bug-sop`                                      |
| 模块内多语言接入           | `module-i18n-onboarding-sop`（本地私有）       |
| 模块 / 页面权限接入与核对  | `module-permission-onboarding-sop`（本地私有） |
| 先写失败测试               | `superpowers:test-driven-development`          |
| 改动完成，想先拿审查反馈   | `superpowers:requesting-code-review`           |
| 改动完成，做独立 review    | `pir-reviewer`                                 |
| 生成本地提交信息           | `commit-local`                                 |

---

## 2. 最小总模板

忘了具体提示词时，先用这句：

```text
用 [skill-name] 处理 [目标]。范围：[目录/模块/文件]。输出：[先看计划 / 直接实施 / 做 review / 给提示词]。约束：[不要改什么 / 保持什么不变]。
```

---

## 3. 直接可复制口令

### 3.1 模块内多语言接入

说明：

- 这是本仓库本地私有 skill
- `SKILL.md` 正文只放 `/.repo-local-skills/`
- 面向开发者的正式说明、速查口令和提示词模板只放 `documents/`

```text
用 module-i18n-onboarding-sop 处理 [路径] 的模块内多语言接入。
```

先盘点：

```text
按 module-i18n-onboarding-sop 先盘点 [路径] 的模块内多语言接入范围，不要立即改代码。
```

### 3.2 正常功能开发

```text
先用 superpowers:brainstorming 想清楚方案；再用 pir-planner 出计划；计划确认后按 pir-implementer 实施。
```

### 3.3 Bug 修复

```text
先用 superpowers:systematic-debugging 定位根因；确认后再决定是否走 pir-planner 或直接实施。
```

如果是 bug 列表：

```text
用 bug-sop 处理这批 bug，先生成清单和方案卡。
```

### 3.4 完成后收口

```text
用 superpowers:requesting-code-review 为这次改动发起代码审查。
```

或：

```text
按 pir-reviewer review 这次改动，重点看业务回归和缺失验证。
```

### 3.5 提交信息

```text
用 commit-local 为当前改动生成 commit message。
```

### 3.6 模块 / 页面权限接入与核对

说明：

- 这是本仓库本地私有 skill
- `SKILL.md` 正文只放 `/.repo-local-skills/`
- 面向开发者的正式说明、速查口令和提示词模板只放 `documents/`

```text
用 module-permission-onboarding-sop 处理 [路径] 的权限核对。
```

缺数据先中断：

```text
按 module-permission-onboarding-sop 处理 [路径] 的权限核对；如果拿不到真实权限树，就直接中断并告诉我需要提供账号密码、可用 token 或真实返回体。
```

---

## 4. 最常用链路

### 4.1 模块内多语言接入

```text
先用 pir-planner 为 [模块路径] 的模块内多语言接入写计划；计划确认后，再按 module-i18n-onboarding-sop 执行实施。
```

### 4.2 模块 / 页面权限接入与核对

```text
先用 module-permission-onboarding-sop 处理 [模块路径] 的权限核对；如果当前没有真实权限树，就先中断并告诉我需要补账号密码、可用 token 或真实返回体。
```

### 4.3 正常功能开发

```text
先用 superpowers:brainstorming 想清楚方案；再用 pir-planner 出计划；实施时按 pir-implementer 执行，并用 superpowers:test-driven-development 先写失败测试；完成后用 pir-reviewer 做 review。
```

### 4.4 一轮 bug 处理

```text
先用 bug-sop 处理这批 bug，输出清单和方案卡；确定后再按 pir-implementer 实施，最后用 pir-reviewer 做 review。
```

---

## 5. 不确定时怎么选

按这个顺序判断：

1. 是“想清楚做什么”吗：`superpowers:brainstorming`
2. 是“先形成计划”吗：`pir-planner`
3. 是“按已批准计划开工”吗：`pir-implementer`
4. 是“先查 bug 根因”吗：`superpowers:systematic-debugging`
5. 是“模块内多语言接入”吗：`module-i18n-onboarding-sop`
6. 是“模块 / 页面权限接入与核对”吗：`module-permission-onboarding-sop`
7. 是“代码改完要 review”吗：`superpowers:requesting-code-review` 或 `pir-reviewer`

---

## 6. 还不够时看哪里

- 想看更完整的 skill 说明：`documents/guides/development/AI技能调用速查手册.md`
- 想直接复制模块内多语言接入提示词：`documents/guides/development/模块内多语言接入AI提示词模板.md`
- 想直接复制权限核对提示词：`documents/guides/development/权限核对AI提示词模板.md`
- 想先理解国际化方案：`documents/design/technical/2026-05-01-前端国际化方案.md`
- 想看完整国际化实现手册：`documents/guides/development/国际化接入与运行时机制说明.md`
- 想看完整权限核对规则：`documents/guides/development/权限接入与模块核对SOP.md`
- 想跨 session 恢复任务：`documents/guides/development/AI会话上下文恢复执行指南.md`
- 想把任务拆给子代理：`documents/guides/development/AI子任务下发示例.md`
