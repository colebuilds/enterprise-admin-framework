---
title: Harness phase owner / enhancer 推荐映射 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: phase-hook-plugin-contract-v1, plugin-registry-and-manifest-model-v1, plugin-attach-and-resolution-rules-v1, config-model-v1
---

# Harness phase owner / enhancer 推荐映射 V1

## 1. 目标

本文档用于在 Harness 已有：

- `phase / hook / plugin contract`
- `plugin manifest / registry`
- `plugin attach / resolution`

基础上，补一层可直接被后续配置和实现引用的：

- phase owner 推荐映射
- phase enhancer 推荐映射

本文档回答的问题是：

- 每个 phase 默认应由哪类 plugin 承担 owner
- 哪些 plugin 更适合作为 enhancer
- 哪些 phase 适合同时挂 runtime-writer / verifier / diagnostics-provider
- 推荐映射与最终 attach / resolution、project config 的关系是什么

## 2. 设计原则

### 2.1 推荐映射不是硬编码绑定

本文档只定义：

- 推荐 owner
- 推荐 enhancer

不定义：

- 唯一合法实现
- 不可替换绑定

也就是说：

- 推荐映射可作为 kernel defaults
- 但仍允许被 project config 覆盖

### 2.2 同一 phase 原则上只有一个 owner

V1 中每个 phase 仍遵守：

- 原则上只有一个 `phase-owner`

本映射的目的就是给后续 attach / resolution 一个默认锚点，避免 owner 冲突从一开始就失控。

### 2.3 enhancer 只增强，不重定义出口

enhancer 可以多个，但职责应限制在：

- 辅助分析
- 补充建议
- 追加写入
- 追加验证

而不是：

- 改 phase 的入口
- 改 phase 的出口
- 覆盖 owner 的主结论

## 3. 推荐映射的层级位置

建议理解为：

- `plugin contract`
  - 定义 plugin 能做什么
- `phase owner / enhancer mapping`
  - 定义默认应该由谁承接哪个 phase
- `project config`
  - 定义当前项目实际采用哪套映射
- `task runtime overrides`
  - 定义当前任务的临时覆盖

因此，推荐映射介于：

- 合同层
- 装配层

之间。

## 4. Phase 推荐映射总览

## 4.1 `requirement-analysis`

### 推荐 owner

- `harness-task-flow`

### 推荐 enhancer

- `ai-subtask-orchestration`
- `document-governance`
- `diagnostics-provider`

### 推荐附属角色

- `runtime-writer`
  - 可选，由 `harness-runtime-recording` 承接

### 说明

`requirement-analysis` 的核心仍是主流程判断，因此更适合由：

- `harness-task-flow`

作为 owner。

增强者主要用于补充：

- 是否需要多 agent
- 是否需要分析型 Work Item
- 是否需要文档落盘
- 是否已进入问题诊断链路

## 4.2 `boundary`

### 推荐 owner

- `harness-task-flow`

### 推荐 enhancer

- `document-governance`
- `ai-change-control`

### 推荐附属角色

- `runtime-writer`
  - 可选，由 `harness-runtime-recording` 承接

### 说明

`boundary` 的 owner 仍应保持在主流程上，因为它直接决定：

- 本次包含 / 不包含
- 风险边界
- 受保护路径

`document-governance` 适合作为 enhancer，负责提醒：

- 哪些边界判断应落为正式文档

`ai-change-control` 适合作为 enhancer，负责补充：

- 修改边界
- 受保护路径约束

## 4.3 `planning`

### 推荐 owner

- `harness-task-flow`

### 推荐 enhancer

- `ai-subtask-orchestration`
- `document-governance`

### 推荐附属角色

- `runtime-writer`
  - 推荐，由 `harness-runtime-recording` 承接

### 说明

`planning` 应默认由：

- `harness-task-flow`

负责形成最终计划视图与执行前结构确认。

`ai-subtask-orchestration` 适合作为 enhancer，负责补充：

- 单任务 / 单批次 / 多批次判断
- 主控 / 子代理边界
- 当前 / 下一任务关系

## 4.4 `execution`

### 推荐 owner

- `harness-task-flow`

### 推荐 enhancer

- `ai-subtask-orchestration`
- `diagnostics-provider`
- `document-governance`

### 推荐附属角色

- `runtime-writer`
  - 强推荐，由 `harness-runtime-recording` 承接

### 说明

当前阶段 `execution` 仍不建议由单独 execution plugin 接管主权，推荐继续由：

- `harness-task-flow`

保持 owner 身份，统一负责：

- `开始执行` 后的主链路推进
- blocked / resume 总体语义
- 提交前收口协调

`ai-subtask-orchestration` 在这里更适合作为 enhancer：

- 决定执行型子代理如何协同

`diagnostics-provider` 在命中问题场景时作为 enhancer：

- 承接 collect / analyze 侧向链路

## 4.5 `verification`

### 推荐 owner

- `harness-task-flow`

### 推荐 enhancer

- `diagnostics-provider`
- `document-governance`

### 推荐附属角色

- `runtime-writer`
  - 推荐，由 `harness-runtime-recording` 承接
- `verifier`
  - 可由后续专门验证 plugin 补入

### 说明

当前阶段尚未单独引入成熟 verifier owner，因此 `verification` 默认仍由：

- `harness-task-flow`

做 owner 更稳。

`diagnostics-provider` 在验证异常时可作为增强者：

- 解释失败来源
- 生成 issue / remediation task 建议

## 4.6 `submission`

### 推荐 owner

- `harness-task-flow`

### 推荐 enhancer

- `document-governance`

### 推荐附属角色

- `runtime-writer`
  - 推荐，由 `harness-runtime-recording` 承接

### 说明

`submission` 当前应由主流程强收口，原因是：

- 需要统一承接提交范围展示
- 需要统一承接 `git add / commit / push`
- 需要统一承接版本动作与日志动作联动

这里不建议把 owner 交给单一辅助 plugin。

## 4.7 `closure`

### 推荐 owner

- `harness-task-flow`

### 推荐 enhancer

- `ai-subtask-orchestration`
- `document-governance`
- `diagnostics-provider`

### 推荐附属角色

- `runtime-writer`
  - 强推荐，由 `harness-runtime-recording` 承接

### 说明

`closure` 是当前最复杂的 phase，内部还要承接：

- batch-closing
- total-acceptance
- total-mr-ready

因此更适合继续由主流程 owner 收口。

其中：

- `ai-subtask-orchestration`
  - 负责批次 / 多 agent 收口视角
- `document-governance`
  - 负责演进记录与正式文档落盘提醒
- `diagnostics-provider`
  - 负责问题反哺与遗留问题升级建议

## 5. 当前核心 plugin 的推荐角色表

### 5.1 `harness-task-flow`

推荐角色：

- `phase-owner`

默认承接：

- `requirement-analysis`
- `boundary`
- `planning`
- `execution`
- `verification`
- `submission`
- `closure`

### 5.2 `ai-subtask-orchestration`

推荐角色：

- `phase-enhancer`

默认增强：

- `requirement-analysis`
- `planning`
- `execution`
- `closure`

### 5.3 `harness-runtime-recording`

推荐角色：

- `runtime-writer`

默认增强：

- 全 phase 可挂

但重点阶段为：

- `planning`
- `execution`
- `verification`
- `submission`
- `closure`

### 5.4 `document-governance`

推荐角色：

- `phase-enhancer`

默认增强：

- `requirement-analysis`
- `boundary`
- `planning`
- `verification`
- `closure`

### 5.5 `diagnostics-provider`

推荐角色：

- `phase-enhancer`
- `diagnostics-provider`

默认增强：

- `requirement-analysis`
- `execution`
- `verification`
- `closure`

## 6. 推荐映射与 attach / resolution 的关系

推荐映射本身不直接决定最终结果。

最终仍应由：

- manifest
- registry
- project config
- task runtime overrides
- attach / resolution 规则

共同决定当前实际 owner / enhancer 清单。

因此推荐映射的作用是：

- 给 kernel defaults 一个稳定起点
- 给 project config 覆盖提供参考
- 给 diagnostics / runtime 解释“为什么当前是这个 owner”提供默认依据

## 7. 推荐映射与 project config 的关系

project config 可以显式覆盖推荐映射，例如：

- 替换某 phase 的 owner
- 禁用某个 enhancer
- 提升某个 diagnostics plugin 的优先级

但 V1 建议：

- 若替换 owner，应保持单 owner 原则
- 若新增 enhancer，不应破坏 owner 的 phase 出口定义
- 若关闭关键 runtime-writer，应有清晰替代方案

## 8. 当前阶段明确不包含

V1 明确不包含：

- 自动根据运行效果调整 owner
- 同一 phase 多 owner 共治
- 动态评分式 enhancer 选择
- 基于宿主能力自动改写推荐映射

## 9. 总结

Harness phase owner / enhancer 推荐映射 V1 的核心结论是：

- 当前阶段各标准 phase 的默认 owner，推荐统一由：
  - `harness-task-flow` 承接
- `ai-subtask-orchestration`
  - 更适合作为编排增强者
- `harness-runtime-recording`
  - 更适合作为统一 runtime-writer
- `document-governance`
  - 更适合作为文档与治理增强者
- `diagnostics-provider`
  - 更适合作为 diagnostics 场景增强者
- 推荐映射只提供默认装配方向，最终仍由 attach / resolution 与 project config 决定实际生效结果
