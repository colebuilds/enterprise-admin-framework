---
title: Harness diagnostics domain contract V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: diagnostics-package-positioning-v1, diagnostics-runtime-and-issue-runtime-model-v1, release-prep-readiness-judgement-after-build-v1
---

# Harness diagnostics domain contract V1

## 1. 目标

本文档用于把当前 diagnostics 子系统从：

- 仓库内可运行链路
- 单文件编排实现
- markdown / yaml 文件协议

继续收敛成一层最小 diagnostics domain contract，明确当前 internal domain 至少由哪些正式对象和边界组成。

本文档回答的问题是：

- diagnostics 当前最小输入 contract 是什么
- issue lifecycle contract 是什么
- upgrade path contract 是什么
- diagnostics runtime output contract 是什么
- 当前 diagnostics 与 runtime / phase / host / CLI 的边界是什么

## 2. 当前定位

当前 diagnostics 仍属于：

- `internal-only domain`

当前不属于：

- `public optional domain`
- `package export target`
- `release-prep-ready domain`

因此本次 contract 的目标不是外提，而是先把 internal domain 的对象协议和模块边界收清楚。

## 3. 最小 contract 结构

当前最小 diagnostics domain contract 为：

### 3.1 diagnostics input contract

统一入口对象：

```yaml
runtimeDir: <runtime root>
diagnosticsIssuesRoot: <issues root>
options: <action options>
```

约束：

- diagnostics 内部动作先消费统一输入对象
- CLI 参数解析不应继续直接散落在每个 diagnostics 动作里

### 3.2 issue lifecycle contract

当前最小 lifecycle state：

- `open`
- `analyzing`
- `ready-for-upgrade`
- `upgraded`

当前最小 lifecycle stage：

- `diagnosis-ready`
- `diagnosis-completed`
- `upgraded-to-task`
- `task-card-entry-created`
- `task-card-mounted`
- `formal-task-ready`
- `task-card-start-ready`
- `boundary-start-ready`

### 3.3 upgrade path contract

当前最小升级路径为：

1. `issue`
2. `remediation-task`
3. `task-card-entry`
4. `formal-task`
5. `task-card-start`
6. `boundary-start`

约束：

- diagnostics 现在仍直接承接这条升级链
- 这也是它当前还不能外提为 public optional domain 的核心原因之一

### 3.4 diagnostics runtime output contract

当前 diagnostics 最小输出面分为两层：

- 主 runtime 输出：
  - `current-task.yaml.diagnostics`
- issue runtime 输出：
  - `/.harness-diagnostics/issues/<issue-id>/issue-runtime.yaml`

当前相关报告文件仍保留在文件协议层：

- `diagnostic-report.md`
- `remediation-task-draft.md`
- `task-card-entry.md`

## 4. 当前最小模块边界

本轮收口后，diagnostics 至少拆成：

- `contract`
  - 承接 diagnostics domain contract 与最小对象构造
- `issue-io`
  - 承接 issue 路径、issue runtime 写入、evidence 文件枚举
- `report-writers`
  - 承接 report / draft / task-card-entry 文件协议读写
- `upgrade-path`
  - 承接 issue -> remediation-task -> task-card-entry -> formal-task 的升级链
- `phase-bridge`
  - 承接 diagnostics -> task_card / boundary 的 phase gate 与 runtime bridge
- `index`
  - 承接 collect / analyze 与统一导出层

这意味着 diagnostics 已不再完全等于单文件 monolith，但当前仍未进入完整 domain package 化阶段。

## 5. 与其他层的边界

### 5.1 与 runtime 的边界

- diagnostics 复用 `TaskRuntimeState`
- diagnostics 只写 `current-task.yaml.diagnostics` 及相关任务对象承接字段
- diagnostics 不拥有独立 runtime 数据库

### 5.2 与 phase 的边界

- diagnostics 通过 `task_card / boundary` phase contract bridge 进入正式任务流
- diagnostics 本身不是新的顶层 phase

### 5.3 与 host 的边界

- diagnostics 当前不直接暴露 host adapter contract
- 它通过 runtime action 被宿主调用，而不是作为独立 host-facing API

### 5.4 与 CLI 的边界

- CLI 只负责把统一输入对象交给 diagnostics 动作
- diagnostics domain contract 不应依赖 CLI argv 结构本身

## 6. 当前仍未完成的部分

本轮之后，diagnostics 仍未完成：

- 文件协议与对象协议进一步解耦
- upgrade path 与 report writer 的进一步分层
- diagnostics 独立自动回归矩阵扩容
- package-internal diagnostics smoke

因此当前仍不应直接进入 diagnostics package 导出。

## 7. 结论

当前 diagnostics 已从“单文件可运行链”推进到“具有最小 domain contract 和最小模块边界的 internal domain”。

这一步的价值在于：

- 为后续继续拆 monolith 提供正式对象层
- 为 future optional domain 评估提供更稳定边界
- 让 diagnostics 与 runtime / phase / CLI 的耦合关系更可解释

但这一步仍不代表：

- diagnostics 已可对外导出
- diagnostics 已 package-ready
- diagnostics 已 release-prep-ready
