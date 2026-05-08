---
title: Harness runtime schema / config schema V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-03
related_decisions: runtime-control-plane, config-model-v1, core-architecture-v2, phase-hook-plugin-contract-v1
---

# Harness runtime schema / config schema V1

## 1. 目标

本文档用于把 Harness 当前已经存在的：

- runtime 控制面
- 配置模型
- phase / hook / plugin contract

继续收敛为更稳定的 schema 级合同，明确：

- 哪些 runtime 对象必须存在
- 哪些 config 对象必须存在
- 字段应按什么层级组织
- 哪些字段属于必须字段，哪些属于可选字段
- schema 层和实现层的边界在哪里

本文档回答的问题是：

- Harness runtime 在 schema 级应该如何组织
- Harness config 在 schema 级应该如何组织
- runtime schema 与 config schema 分别承接什么
- schema 与具体 yaml/json 文件、脚本实现之间如何分层

## 2. 为什么需要 schema 层

如果只有：

- 设计文档
- 默认配置样例
- 当前写入脚本

但没有 schema 层，后续会出现几个问题：

- runtime 文件字段继续漂移
- config 字段命名和层级缺少统一锚点
- plugin 接入时不知道哪些字段可读、哪些字段可写
- diagnostics、blocked、multi-agent、closure 等能力难以稳定复用

因此，V1 必须补一层最小 schema 合同。

## 2.1 P0 收口补充

自 `2026-04-03` 起，Harness V2 的 P0 收口进一步明确：

- `scripts/harness-runtime.mjs` 内核内部只应处理正式 state object
- 文件层只负责这些 object 的 load / save
- `current-task.yaml`、`current-batch.yaml`、`trial-feedback.yaml`、`manual-validation.yaml`、`events.log` 都应视为序列化载体，而不是脚本内部的真实对象模型本体

当前阶段最小正式对象为：

- `TaskRuntimeState`
- `BatchRuntimeState`
- `TrialFeedbackState`
- `ManualValidationState`
- `EventRecord`

这一步的目标不是一次完成完整状态机，而是先把 runtime schema 从“文档约定”推进到“实现中的唯一真相锚点”。

## 3. 设计原则

### 3.1 schema 先于实现细节

schema 负责定义：

- 对象结构
- 字段层级
- 必填性
- 类型方向

schema 不负责定义：

- 实际脚本怎么写
- 具体命令如何触发
- 每次写入的完整 payload 细节

### 3.2 先最小稳定，再逐步扩展

V1 不追求一次覆盖所有潜在字段。

当前阶段优先保证：

- 当前已落地能力有稳定字段承接
- 后续新增字段有扩展位
- 不把 schema 做成过重状态机

### 3.3 runtime schema 与 config schema 分层

- runtime schema
  - 表达“当前发生了什么”
- config schema
  - 表达“系统默认应该怎么装配和推进”

两者不能混用。

## 4. runtime schema V1 定位

runtime schema V1 用于约束：

- `/.harness-runtime/current-task.yaml`
- `/.harness-runtime/current-batch.yaml`
- `/.harness-runtime/manual-validation.yaml`
- `/.harness-runtime/trial-feedback.yaml`
- `/.harness-runtime/events.log`

其中：

- 快照文件承接当前状态
- 事件文件承接关键轨迹

runtime schema V1 不等于完整数据库模型，也不等于完整事件溯源模型。

## 5. runtime schema 顶层对象

### 5.1 `current-task`

`current-task.yaml` 对应的正式内存对象名为：

- `TaskRuntimeState`

`current-task` 是当前激活对象的主快照。

建议最小顶层结构：

```yaml
schema_version: v1
task:
phase:
execution:
orchestration:
closure:
diagnostics:
updated_at:
```

字段职责：

- `schema_version`
  - 当前 schema 版本
- `task`
  - 当前 Task / Work Item / Execution Unit 快照
- `phase`
  - 当前生命周期 phase
- `execution`
  - 当前执行入口、提交状态、自动推进状态
- `orchestration`
  - 当前 agent_mode、主控 / 子代理信息
- `closure`
  - 当前收口状态
- `diagnostics`
  - 当前是否处于 blocked / diagnostics 相关状态
- `updated_at`
  - 快照更新时间

### 5.2 `current-batch`

`current-batch.yaml` 对应的正式内存对象名为：

- `BatchRuntimeState`

`current-batch` 是当前批次组织快照。

建议最小顶层结构：

```yaml
schema_version: v1
batch:
task_order:
current:
next:
completed:
blocked:
updated_at:
```

字段职责：

- `batch`
  - 当前批次基础信息
- `task_order`
  - 当前批次中的任务顺序
- `current`
  - 当前任务
- `next`
  - 下一任务
- `completed`
  - 已完成任务集合
- `blocked`
  - 当前 blocked 任务集合
- `updated_at`
  - 快照更新时间

### 5.3 `manual-validation`

`manual-validation.yaml` 对应的正式内存对象名为：

- `ManualValidationState`

`manual-validation` 是人工验证与总验收状态快照。

建议最小顶层结构：

```yaml
schema_version: v1
validation:
acceptance:
mr_ready:
updated_at:
```

字段职责：

- `validation`
  - 当前人工验证状态
- `acceptance`
  - total acceptance 相关状态
- `mr_ready`
  - total mr ready 相关状态
- `updated_at`
  - 快照更新时间

### 5.4 `trial-feedback`

`trial-feedback.yaml` 对应的正式内存对象名为：

- `TrialFeedbackState`

`trial-feedback` 是试运行反馈对象。

建议最小顶层结构：

```yaml
schema_version: v1
feedback:
source:
impact:
recommendation:
updated_at:
```

### 5.5 `events`

`events.log` 中每一条事件对应的正式内存对象名为：

- `EventRecord`

`events.log` 在 schema 级不要求复杂结构文件，但每个事件建议最小承接：

```yaml
event:
timestamp:
task_ref:
phase:
summary:
payload:
```

其中：

- `event`
  - 事件名
- `timestamp`
  - 时间
- `task_ref`
  - 相关 Task / Work Item / Execution Unit
- `phase`
  - 发生时 phase
- `summary`
  - 简要说明
- `payload`
  - 补充数据

## 6. runtime schema 核心字段组

### 6.1 `task` 字段组

建议最小字段：

```yaml
task:
  task_id:
  task_title:
  task_domain:
  work_item_id:
  work_item_type:
  execution_unit_id:
  execution_unit_title:
  status:
```

### 6.1A 命名冻结补充

自 P0 收口开始，runtime / schema / plugin contract 内部字段命名以新术语为主：

- `Requirement`
- `Task`
- `Work Item`
- `Execution Unit`

因此：

- `work_item`
- `execution_unit`

应成为 runtime 内部主字段。

旧命名：

- `subtask`
- `deliverable_unit`

只允许继续存在于：

- 历史文档
- 迁移映射说明
- 旧实例兼容读取

不得继续作为新的主字段向外扩张。

说明：

- `task_id / task_title`
  - 顶层任务标识
- `task_domain`
  - 任务域
- `work_item_id / work_item_type`
  - 当前工作项
- `execution_unit_id / execution_unit_title`
  - 当前最小执行对象
- `status`
  - 当前对象状态

### 6.2 `phase` 字段组

建议最小字段：

```yaml
phase:
  current:
  entered_at:
  auto_advance_allowed:
  blocked:
```

### 6.3 `execution` 字段组

建议最小字段：

```yaml
execution:
  start_mode:
  submit_mode:
  commit_status:
  push_status:
```

说明：

- `start_mode`
  - `manual_start / auto_start`
- `submit_mode`
  - 当前提交流程模式
- `commit_status`
  - commit 是否完成
- `push_status`
  - push 是否完成

### 6.4 `orchestration` 字段组

建议最小字段：

```yaml
orchestration:
  agent_mode:
  controller:
  executors:
  query_agent:
```

说明：

- `agent_mode`
  - `single-agent / multi-agent`
- `controller`
  - 主控信息
- `executors`
  - 执行型子代理集合
- `query_agent`
  - 查询型子代理

### 6.5 `closure` 字段组

建议最小字段：

```yaml
closure:
  state:
  total_acceptance:
  total_mr_ready:
```

### 6.6 `diagnostics` 字段组

建议最小字段：

```yaml
diagnostics:
  blocked:
  blocked_reason:
  issue_ref:
  diagnostics_state:
```

说明：

- `blocked`
  - 当前是否 blocked
- `blocked_reason`
  - 阻塞原因摘要
- `issue_ref`
  - 若已进入 diagnostics，对应 issue 引用
- `diagnostics_state`
  - diagnostics 当前状态

## 7. config schema V1 定位

config schema V1 用于约束：

- kernel defaults
- project harness config
- task runtime overrides

它不约束具体文件名，但可作为以下落点的结构基线：

- `harness.config.json`
- `.harness/config.json`
- runtime 中的 task overrides 片段

## 8. config schema 顶层对象

建议 config schema 最小顶层结构：

```yaml
schema_version: v1
lifecycle:
plugins:
task_strategy:
runtime:
diagnostics:
```

字段职责：

- `schema_version`
  - 当前 config schema 版本
- `lifecycle`
  - 生命周期策略
- `plugins`
  - 插件装配策略
- `task_strategy`
  - 任务域与风险策略
- `runtime`
  - runtime 粒度与开关
- `diagnostics`
  - diagnostics 子系统相关开关

## 9. config schema 核心字段组

### 9.1 `lifecycle`

建议最小字段：

```yaml
lifecycle:
  enabled_phases:
  phase_order:
  default_auto_advance_target:
  blocked_enabled:
  closure_terminal_phase:
```

### 9.2 `plugins`

建议最小字段：

```yaml
plugins:
  enabled:
  order:
  required_plugins:
  failure_overrides:
```

### 9.3 `task_strategy`

建议最小字段：

```yaml
task_strategy:
  default_agent_mode:
  default_batching_policy:
  high_risk_domains:
  versioning_domains:
  domain_profiles:
```

### 9.4 `runtime`

建议最小字段：

```yaml
runtime:
  enabled_files:
  event_level:
  multi_agent_sync_enabled:
  blocked_runtime_enabled:
  closure_runtime_enabled:
```

### 9.5 `diagnostics`

建议最小字段：

```yaml
diagnostics:
  enabled:
  intake_mode:
  diagnostics_root:
  issue_directory_pattern:
```

说明：

- `enabled`
  - 是否启用 diagnostics 子系统
- `intake_mode`
  - 当前 V1 推荐为 `file-intake`
- `diagnostics_root`
  - diagnostics 根目录
- `issue_directory_pattern`
  - issue 目录命名模式

## 10. 必填性原则

### 10.1 runtime schema 必填原则

V1 中以下字段组应视为强必填：

- `schema_version`
- `task`
- `phase`
- `updated_at`

以下字段组按能力启用情况必填：

- `orchestration`
  - 命中 multi-agent 时
- `closure`
  - 命中 closure 场景时
- `diagnostics`
  - 命中 blocked / diagnostics 场景时

### 10.2 config schema 必填原则

V1 中以下字段组应视为强必填：

- `schema_version`
- `lifecycle`
- `plugins`
- `task_strategy`
- `runtime`

`diagnostics` 作为当前 V2 已进入核心架构的子系统，建议也作为标准字段块保留，但允许：

- `enabled = false`

## 11. schema 与样例、脚本、合同的关系

### 11.1 与默认配置样例的关系

默认配置样例回答的是：

- 当前推荐怎么装配

schema 回答的是：

- 配置对象应该长什么样

### 11.2 与 runtime 写入脚本的关系

runtime 写入脚本回答的是：

- 当前动作如何更新文件

schema 回答的是：

- 更新后的对象结构应该满足什么最小合同

### 11.3 与 phase / hook / plugin contract 的关系

phase / hook / plugin contract 定义：

- 谁可以挂进来
- 谁读写什么

schema 定义：

- 被读写对象本身应长什么样

## 12. 当前阶段明确不包含

本次 schema V1 明确不包含：

- 完整 JSON Schema 文件实现
- 自动 schema 校验器
- 完整 migration 机制
- 完整状态机定义
- 外部平台配置 schema

当前阶段只先把结构合同说清，不把系统推进到过重平台复杂度。

## 13. 总结

Harness runtime schema / config schema V1 可以压缩成一句：

它是一层最小结构合同，用来稳定约束 runtime 快照、runtime 事件和 config 装配对象，使 Lifecycle Kernel、Plugin Contract、Runtime Control Plane 和 Diagnostics Layer 之间有统一对象锚点可依。

没有这一层，V2 的 lifecycle、plugin、runtime 和 diagnostics 仍会停留在设计方向一致、字段结构继续漂移的状态。
