---
title: Harness 任务对象模型
type: design
status: stable
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-03
---

# Harness 任务对象模型

## 1. 目标

本文档用于定义 Harness 当前阶段的任务对象模型，为后续：

- runtime 控制面
- skill 协议联动
- 多任务编排
- 自动执行
- 自动验证
- 总 MR 收口

提供统一的对象基础。

本文档回答的问题是：

- Harness 中有哪些正式对象
- 每类对象最少需要哪些字段
- 各对象之间如何关联
- 哪些对象必须有文档
- 哪些对象可以独立提交
- `Task` 如何最终收口到总 MR

## 2. 设计原则

### 2.1 先定义最小对象，不直接过度建模

当前阶段只定义足以支撑后续 runtime 与 skill 改造的最小对象模型，不直接扩展成数据库级全量结构。

### 2.2 对象层级必须稳定

当前阶段主对象模型稳定为四层：

- `Requirement`
- `Task`
- `Work Item`
- `Execution Unit`

其中真正进入执行编排与 runtime 主视图的核心三层为：

- `Task`
- `Work Item`
- `Execution Unit`

若对象边界不稳定，后续拆分、验证、提交和总 MR 收口都会继续混乱。

### 2.3 任务对象必须能承接文档、验证与提交

对象不是只用于“描述任务”，还必须能承接：

- 文档
- 验证
- 提交
- 状态

## 3. 对象层级定义

### 3.1 Requirement

`Requirement` 用于承接原始需求输入、问题来源或待处理目标。

它回答的是：

- 为什么要做这件事
- 原始输入是什么
- 期望解决什么问题

`Requirement` 可以来自：

- 用户直接提出的开发需求
- 一个架构升级目标
- 一个 bugfix 输入
- diagnostics 反哺出来的问题

`Requirement` 不是默认执行对象，它是后续形成 `Task` 的上游来源。

### 3.2 Task

`Task` 用于承接一个复杂需求的整体目标与最终交付。

`Task` 负责：

- 总目标
- 总边界
- 总拆分方案
- 总文档
- 总验收
- 总汇总 MR

`Task` 不直接等于一个代码提交，但复杂 `Task` 默认应拥有独立文档。

### 3.3 Work Item

`Work Item` 用于承接 `Task` 下的中间工作项。

`Work Item` 分为至少四类：

- `analysis`
- `execution`
- `validation`
- `closure`

其中最常见的两类是：

- 分析型 `Work Item`
- 执行型 `Work Item`

分析型 `Work Item` 用于形成拆分依据，例如：

- 参考实现分析
- 依赖盘点
- 架构可行性分析

执行型 `Work Item` 用于承接一组可继续拆为 `Execution Unit` 的执行事项。

### 3.4 Execution Unit

`Execution Unit` 是 Harness 自动拆解的最小执行单元。

一个 `Execution Unit` 应具备：

- 独立边界
- 独立验证方式
- 独立提交能力
- 独立回滚能力

分析型 `Work Item` 若形成独立闭环结果，也可以直接落成单个 `Execution Unit`。

### 3.5 旧术语映射

当前主术语为：

- `Requirement`
- `Task`
- `Work Item`
- `Execution Unit`

历史文档中的旧术语映射如下：

- `总任务 -> Task`
- `中任务 -> Work Item`
- `可提交单元 -> Execution Unit`

后续主说明体系应优先使用新术语，旧术语仅作为过渡性说明保留。

## 4. 对象关系模型

### 4.1 归属关系

- 一个 `Requirement` 可形成一个或多个 `Task`
- 一个 `Task` 可包含多个 `Work Item`
- 一个 `Work Item` 可包含多个 `Execution Unit`
- 一个 `Execution Unit` 必须归属于某个 `Work Item`
- 一个 `Work Item` 必须归属于某个 `Task`

### 4.2 依赖关系

对象之间允许存在依赖，但依赖应显式记录。

最常见依赖包括：

- 分析型 `Work Item` -> 执行型 `Work Item`
- 前置 `Execution Unit` -> 后续 `Execution Unit`
- 某个 `Work Item` 完成 -> `Task` 进入下一阶段

### 4.3 文档关系

- `Task` 必须有独立文档
- `Work Item` 可按需要拥有独立文档
- `Execution Unit` 若本身形成高价值沉淀，也可拥有独立文档

### 4.4 提交关系

- `Execution Unit` 默认对应一次独立提交
- `Work Item` 可汇聚多个 `Execution Unit`
- `Task` 最终收口为总 MR，而不是单一 commit

## 5. 最小字段建议

### 5.1 Requirement 最小字段

建议至少包含：

- `requirement_id`
- `title`
- `summary`
- `source_type`
- `source_ref`
- `status`

### 5.2 Task 最小字段

建议至少包含：

- `task_id`
- `requirement_id`
- `title`
- `goal`
- `scope`
- `status`
- `risk_level`
- `architecture_level`
- `doc_path`
- `split_plan`
- `validation_summary`
- `mr_summary`

### 5.3 Work Item 最小字段

建议至少包含：

- `work_item_id`
- `parent_task_id`
- `title`
- `work_item_type`
- `goal`
- `scope`
- `status`
- `depends_on`
- `doc_path`
- `unit_plan`

### 5.4 Execution Unit 最小字段

建议至少包含：

- `unit_id`
- `parent_work_item_id`
- `title`
- `goal`
- `file_scope`
- `status`
- `validation_plan`
- `doc_action`
- `commit_ref`

## 6. 状态流转建议

### 6.1 Task 状态

当前阶段建议至少包括：

- `draft`
- `analyzing`
- `split-ready`
- `executing`
- `verifying`
- `ready-for-mr`
- `completed`
- `blocked`

### 6.2 Work Item 状态

当前阶段建议至少包括：

- `draft`
- `pending`
- `in_progress`
- `verifying`
- `completed`
- `blocked`

### 6.3 Execution Unit 状态

当前阶段建议至少包括：

- `draft`
- `ready`
- `executing`
- `reviewing`
- `verified`
- `committed`
- `blocked`

## 7. 文档约束

### 7.1 Task 文档强制存在

复杂需求一旦形成 `Task`，`Task` 文档必须存在。

`Task` 文档的作用是：

- 固定总体目标
- 固定总体边界
- 固定拆分结果
- 防止多轮迭代后任务模糊

### 7.2 Work Item 文档按需存在

命中以下情况时，`Work Item` 建议有独立文档：

- 分析型 `Work Item`
- 边界较复杂
- 需要后续复用
- 需要作为拆分依据沉淀

### 7.3 Execution Unit 文档按沉淀价值决定

`Execution Unit` 若只是普通实现，可不单独建文档。  
若形成规则、决策、方案或高价值说明，应同步生成或更新文档。

## 8. 提交与总 MR 关系

### 8.1 Execution Unit 与 commit

`Execution Unit` 默认是一条独立提交链路。

这意味着：

- 一个 `Execution Unit` 完成后，应尽量形成一个独立 commit
- 提交前应完成自身验证与文件范围校验

### 8.2 Work Item 与提交组

`Work Item` 可由多个 `Execution Unit` 组成。

`Work Item` 本身不一定直接对应一个 commit，但它负责组织一组相关执行单元的推进顺序和依赖关系。

### 8.3 Task 与总 MR

`Task` 最终收口时，应形成总汇总 MR。

默认交付方式为：

- `Execution Unit` 分别 `commit / push`
- 最终汇总成总 MR

因此 `Task` 至少要能记录：

- 已完成的 `Execution Unit`
- 已完成的 `Work Item`
- 总 MR 入口
- 总体验收状态

## 9. 对后续系统建设的意义

该对象模型将直接指导：

- runtime 控制面设计
- task-flow 与 orchestration 的状态承接
- 自动执行入口分流
- 自动验证与总 MR 收口

若对象模型不先稳定，后续所有运行时、skill 和自动化能力都会继续漂移。

## 10. 当前阶段总结

Harness 当前阶段的主对象模型可以压缩为：

- `Requirement`：承接原始需求与问题来源
- `Task`：承接复杂需求与总收口
- `Work Item`：承接中间阶段与分析 / 执行 / 验证 / 收口分层
- `Execution Unit`：承接最小执行与提交闭环

其中真正进入后续 Harness 控制面主视图的核心对象为：

- `Task`
- `Work Item`
- `Execution Unit`
