---
title: Harness method / tactic 层模型 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: core-architecture-v2, terminology-and-object-model-v2, phase-hook-plugin-contract-v1
---

# Harness method / tactic 层模型 V1

## 1. 目标

本文档用于把 Harness V2 中已经提出的：

- `Method / Tactic Layer`

继续收敛成正式模型，明确：

- 什么属于 method / tactic
- 什么不属于 method / tactic
- 它和 phase、plugin、task domain 分别是什么关系
- 它应该如何被调用，而不是如何进入内核

本文档回答的问题是：

- 浏览器调试、日志排查、PRD 深读这类能力应该放在哪一层
- 为什么它们不应进入 Lifecycle Kernel
- method 和 tactic 有什么区别
- 后续怎样让优秀方法接入 Harness，而不污染内核

## 2. 为什么要单独建模

如果不把方法层单独定义，会出现两个问题：

- 系统内核不断吸收场景化技巧，最后变得又重又碎
- 各类 skill 会把“具体做法”混成“系统阶段”，导致 phase 语义漂移

例如下面这些能力：

- 浏览器调试
- 控制台日志分析
- network trace 排查
- PRD 深读
- 参考项目对比
- 截图比对

它们都很重要，但都不是：

- phase
- control action
- task object
- plugin contract 本体

它们更适合作为独立的方法层。

## 3. 设计原则

### 3.1 方法层不进入内核

Lifecycle Kernel 只应承接：

- phase
- hook
- 状态转移
- blocked / resume
- closure 终点

不应承接：

- 前端 bug 一定怎么调
- PRD 一定怎么读
- 日志一定怎么排

这些都属于场景策略。

### 3.2 方法层由 plugin 调用，不由内核直接调度

V1 推荐的关系是：

- phase 决定当前处于哪个系统阶段
- plugin 决定当前阶段由谁承接
- method / tactic 决定承接者采用哪种做法

也就是说：

- kernel 不直接调用 method
- method 由 plugin 在合适 phase 下选用

### 3.3 方法层应可替换、可组合、可禁用

同一类任务下，不应只有一种做法。

例如前端 bugfix：

- 可以先用浏览器调试
- 也可以先看 network log
- 也可以先复现实验

因此方法层应天然支持：

- 替换
- 组合
- 按任务场景选择

## 4. method 与 tactic 的区别

### 4.1 Method

`Method` 表示一类较稳定的方法类别。

例如：

- `browser-debugging`
- `log-tracing`
- `prd-analysis`
- `reference-implementation-analysis`
- `snapshot-comparison`

它更像“方法名”。

### 4.2 Tactic

`Tactic` 表示在某种方法下的一次具体战术使用。

例如在 `browser-debugging` 下，可能会有：

- 打开 console
- 查看 network 请求
- 检查 DOM 状态
- 观察事件触发顺序

也就是说：

- `Method`
  - 偏分类层
- `Tactic`
  - 偏执行动作层

V1 中可以先把二者放在一层讨论，但概念上建议区分。

## 5. 在整体架构中的位置

在 Harness V2 中，method / tactic 层应位于：

- Lifecycle Kernel 之下
- Plugin Layer 旁侧
- Runtime Control Plane 之外

建议理解为：

- Core Lifecycle
- Plugin Contract / Plugin Registry
- `Method / Tactic Layer`
- Runtime / Diagnostics / Config

其中方法层和 plugin 的关系最强，和 runtime 的关系最弱。

## 6. 与 phase 的关系

### 6.1 method 不等于 phase

如下对象不应被理解成 phase：

- 浏览器调试
- 日志排查
- PRD 深读
- 参考实现分析

它们可以发生在：

- `requirement-analysis`
- `planning`
- `execution`
- `verification`

但它们本身不是生命周期阶段。

### 6.2 method 受 phase 约束

虽然 method 不是 phase，但它应受 phase 约束。

例如：

- `prd-analysis`
  - 更适合 `requirement-analysis`
- `reference-implementation-analysis`
  - 更适合 `requirement-analysis / planning`
- `browser-debugging`
  - 更适合 `execution / verification`
- `snapshot-comparison`
  - 更适合 `verification`

所以 method 层应至少能表达：

- 适用 phase

## 7. 与 plugin 的关系

### 7.1 plugin 是承接者，method 是做法

建议统一理解为：

- plugin 决定“谁来做”
- method 决定“怎么做”

例如：

- `diagnostics-provider`
  - 作为 plugin
- `log-tracing`
  - 作为 method

### 7.2 method 应通过 plugin 挂接

V1 推荐 method 至少由某个 plugin 在内部引用，而不是由内核直接激活。

例如：

- `document-governance`
  - 可调用 `reference-structure-check`
- `diagnostics-provider`
  - 可调用 `log-tracing`
- 某个 bugfix plugin
  - 可调用 `browser-debugging`

## 8. 与 task domain 的关系

不同 `task_domain` 会影响默认推荐 method。

### 8.1 `harness-core`

更适合：

- `rule-diff-analysis`
- `runtime-state-inspection`
- `event-sequence-analysis`
- `reference-contract-check`

### 8.2 `project-architecture`

更适合：

- `reference-implementation-analysis`
- `dependency-mapping`
- `structure-diff-analysis`
- `prd-analysis`

### 8.3 `project-feature`

更适合：

- `prd-analysis`
- `reference-ui-check`
- `acceptance-case-check`

### 8.4 `project-bugfix`

更适合：

- `browser-debugging`
- `log-tracing`
- `runtime-state-check`
- `network-inspection`

### 8.5 `project-docs`

更适合：

- `document-structure-check`
- `naming-rule-check`
- `metadata-check`

这说明 method 层和 `task_domain` 之间存在强关联，但 method 仍不属于 `task_domain` 本身。

## 9. 推荐的最小 method 集合

V1 建议先承认以下最小 method 集合：

- `prd-analysis`
- `reference-implementation-analysis`
- `browser-debugging`
- `log-tracing`
- `runtime-state-inspection`
- `snapshot-comparison`
- `document-structure-check`
- `metadata-check`

这些已经足够覆盖当前大多数实践场景。

## 10. method 层最小声明建议

如果后续要把 method 也做成正式可注册对象，建议最少声明：

```yaml
method_id:
method_name:
applicable_domains:
applicable_phases:
suggested_plugins:
description:
```

字段说明：

- `method_id`
  - 方法唯一标识
- `method_name`
  - 可读方法名
- `applicable_domains`
  - 适用任务域
- `applicable_phases`
  - 适用 phase
- `suggested_plugins`
  - 更适合由哪些 plugin 调用
- `description`
  - 方法用途说明

V1 不要求真正落成 registry，只先把模型说清。

## 11. 当前阶段明确不包含

本次模型明确不包含：

- method registry 实现
- tactic 执行引擎
- 自动 method 推荐器
- method 权限系统
- 复杂多层 tactic 编排

V1 只先定义：

- 方法层在架构中的位置
- 它和 phase / plugin / task_domain 的边界
- 最小 method 集合和声明方向

## 12. 总结

Harness method / tactic 层模型 V1 可以压缩成一句：

method / tactic 是某类 plugin 在特定 phase 下采用的场景化做法，它与 task_domain 强相关，但不属于生命周期内核，也不应直接被 phase 或 runtime 承接。

把这层单独抽出来，Harness 才能真正做到：

- 内核稳定
- plugin 可插拔
- 方法可替换
- 场景技巧不污染系统主骨架
