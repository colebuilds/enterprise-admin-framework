---
title: Harness 术语与对象模型 V2
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: core-architecture-v2, phase-hook-plugin-contract-v1, diagnostics-intake-v1
---

# Harness 术语与对象模型 V2

## 1. 目标

本文档用于把 Harness 当前已有的对象模型，从：

- 总任务
- 中任务
- 可提交单元

进一步升级为更适合生命周期内核、插件合同、配置层和问题诊断闭环消费的 V2 术语与对象模型。

本文档回答的问题是：

- Harness 应该使用哪些正式术语
- 哪些术语属于对象层
- 哪些术语属于任务域
- 哪些术语属于工作项类型
- 哪些术语属于提交语义
- 哪些术语属于方法层
- 问题诊断闭环应新增哪些对象

## 2. 为什么要升级术语

当前术语体系虽然已经能支撑运行，但仍存在几个问题：

- `大任务 / 中任务` 过于口语化
- `中任务` 容易和 `子任务 / 批次 / 可提交单元` 混淆
- 任务来源、工作类型、提交语义和方法层混在一起
- 问题诊断闭环还缺少正式对象承接

因此，V2 必须把：

- 对象层
- 策略层
- 方法层
- 诊断层

拆开。

## 3. V2 术语设计原则

### 3.1 先拆维度，再定名词

不要再让一个词同时承担：

- 任务对象
- 任务来源
- 提交语义
- 场景方法

### 3.2 对象名优先稳定、可被协议消费

V2 的对象术语应优先适合：

- runtime
- plugin contract
- config
- diagnostics
- 能力矩阵

而不是优先服务口语表达。

### 3.3 当前阶段允许双轨映射

V2 不要求立即废弃现有中文对象名，但必须给出稳定映射，方便过渡：

- 当前中文术语继续可读
- 新术语作为系统正式术语

## 4. V2 对象层

### 4.1 Requirement

`Requirement` 表示原始需求输入。

它可以来自：

- 用户任务描述
- 架构演进目标
- bug 报告
- 日志反哺问题
- PRD / 图片 / 外部参考

它不是正式执行对象，而是任务生成的上游输入。

### 4.2 Task

`Task` 表示顶层正式任务对象。

它对应当前体系里的“总任务”。

`Task` 负责承接：

- 总目标
- 总边界
- 总拆分方案
- 总收口路径
- 总验收 / 总 MR

### 4.3 Work Item

`Work Item` 表示可编排工作项。

它对应当前体系里的“中任务”。

`Work Item` 不只用于执行，也可以用于分析、验证和收口。

### 4.4 Execution Unit

`Execution Unit` 表示最小可执行、可验证、可提交的执行对象。

它对应当前体系里的“可提交单元”。

它不是 phase，也不是口令，而是被 phase 推进的对象。

## 5. 当前术语与 V2 术语映射

建议采用如下映射：

- `需求` -> `Requirement`
- `总任务` -> `Task`
- `中任务` -> `Work Item`
- `可提交单元` -> `Execution Unit`

过渡期允许继续在中文说明中写：

- 总任务（Task）
- 中任务（Work Item）
- 可提交单元（Execution Unit）

但后续 runtime、contract 和 config 应逐步以英文术语为主。

## 6. Work Item 类型模型

### 6.1 为什么 Work Item 必须分类型

如果 `Work Item` 默认被理解为“执行型子任务”，那么复杂任务前置分析就无法稳定进入系统。

所以 `Work Item` 必须显式支持类型。

### 6.2 推荐类型

V2 推荐最小 `work_item_type` 为：

- `analysis`
- `execution`
- `validation`
- `closure`

### 6.3 含义

#### `analysis`

用于：

- 参考实现分析
- 依赖盘点
- PRD / 图片 / 外部项目分析
- 形成拆分依据

#### `execution`

用于：

- 实际实现
- 文档落盘
- runtime 动作
- 代码改动

#### `validation`

用于：

- 独立验证
- 回归核对
- review 准备

#### `closure`

用于：

- 总收口
- 汇总验证
- `total-acceptance`
- `total-mr-ready`

## 7. Task Domain 模型

### 7.1 为什么任务域必须独立

以下内容不属于对象类型，而属于任务域：

- Harness 自身需求
- 项目架构升级需求
- 日常迭代需求
- bugfix
- docs-only

这些类型会直接影响：

- 风险等级
- 自动推进策略
- 文档要求
- 版本治理
- blocked 策略

所以必须独立为 `task_domain`。

### 7.2 推荐 task_domain

V2 推荐最小 `task_domain` 为：

- `harness-core`
- `project-architecture`
- `project-feature`
- `project-bugfix`
- `project-docs`
- `governance`

### 7.3 含义

#### `harness-core`

用于：

- Harness 协议
- runtime
- phase / hook / plugin contract
- 版本治理
- diagnostics 闭环

#### `project-architecture`

用于：

- 项目核心架构升级
- 共享层、基础设施层、跨模块演进

#### `project-feature`

用于：

- 日常功能需求
- 一般性迭代交付

#### `project-bugfix`

用于：

- 功能缺陷修复
- 异常定位
- blocked / diagnose 类型问题

#### `project-docs`

用于：

- 文档设计
- 文档治理
- 接入手册

#### `governance`

用于：

- 协作规范
- 工程治理
- AI 规则

## 8. Change Kind 模型

### 8.1 为什么提交语义必须独立

`feat / fix / docs / style / refactor` 这些不属于任务对象，而属于提交语义或变更语义。

它们应独立为：

- `change_kind`

### 8.2 推荐 change_kind

V2 推荐最小 `change_kind` 为：

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `style`
- `chore`

### 8.3 对象与提交语义的关系

一个对象可以同时拥有：

- `task_domain = harness-core`
- `work_item_type = analysis`
- `change_kind = docs`

这三者并不冲突，也不应被压成一个字段。

## 9. Method / Tactic 模型

### 9.1 为什么方法层不能混进对象层

如下内容不应视为任务对象：

- 浏览器调试
- 调试日志
- 网络面板排查
- PRD 深读
- 参考项目对比
- screenshot 对比

这些属于：

- `method`
- 或 `tactic`

### 9.2 推荐 method/tactic 示例

- `browser-debugging`
- `log-tracing`
- `api-inspection`
- `screenshot-comparison`
- `reference-analysis`
- `prd-analysis`

这些对象应由某些 plugin 在特定 phase 下调用，而不进入核心对象模型。

## 10. 问题诊断闭环对象

### 10.1 必须新增的对象

随着 diagnostics-intake V1 进入系统，V2 应承认以下对象：

- `Issue`
- `Diagnostic Report`
- `Evidence Bundle`
- `Remediation Task`

### 10.2 含义

#### `Issue`

问题对象。

用于承接：

- 用户反馈
- 使用中异常
- 真实场景缺口

#### `Diagnostic Report`

诊断报告对象。

用于承接：

- 问题摘要
- 初步归因
- 受影响 phase / plugin / runtime

#### `Evidence Bundle`

证据包对象。

用于承接：

- runtime 快照
- events.log
- 终端日志
- 用户补充说明

#### `Remediation Task`

修复任务对象。

用于承接：

- 已可执行的修复工作

在对象层上，它仍然是 `Task` 的一种来源，不是单独的并行体系。

## 11. 对象之间的关系

### 11.1 正常主链路

建议理解为：

- `Requirement` -> `Task` -> `Work Item` -> `Execution Unit`

### 11.2 诊断反哺链路

建议理解为：

- `Issue` -> `Evidence Bundle` -> `Diagnostic Report` -> `Remediation Task` -> 再进入 `Task -> Work Item -> Execution Unit`

### 11.3 当前 / 下一任务关系

当前 / 下一任务不是新的对象类型，而是：

- batch 视角下对 `Work Item` 或 `Execution Unit` 的运行时引用关系

所以应进入：

- runtime
- orchestration

而不应进入对象类型本身。

## 12. 与 Phase / Hook / Plugin Contract 的关系

V2 的对象模型不替代 phase 模型，但会被 phase 模型消费。

例如：

- `requirement-analysis`
  - 主要处理 `Requirement`
- `planning`
  - 主要生成 `Task / Work Item / Execution Unit` 结构
- `execution`
  - 主要推进 `Execution Unit`
- `closure`
  - 主要推进 `Task` 收口

plugin 也是消费对象，而不是重新定义对象。

## 13. 当前阶段建议

V2 当前阶段不要求立刻修改全部现有文件字段，但建议按以下顺序推进：

1. 先在架构文档里固定新术语
2. 再在 runtime / skill / config 文档中逐步采用新术语
3. 过渡期允许：
   - 中文旧术语 + 英文正式术语并列
4. 等 runtime 和 plugin contract 稳定后，再考虑字段级统一替换

## 14. 当前阶段总结

Harness 术语与对象模型 V2 可以压缩成一句：

把对象层、任务域、工作项类型、提交语义、方法层和问题诊断对象拆开，才能让 Harness 从“能跑的流程系统”升级为“可长期演进的生命周期内核”。
