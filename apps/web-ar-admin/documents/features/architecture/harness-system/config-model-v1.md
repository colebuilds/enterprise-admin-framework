---
title: Harness 配置模型 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: core-architecture-v2, phase-hook-plugin-contract-v1
---

# Harness 配置模型 V1

## 1. 目标

本文档用于定义 Harness 在 V2 架构方向下的最小配置模型，使系统不再把默认策略、插件启用方式和项目差异写死在核心规则里。

本文档回答的问题是：

- Harness 为什么必须有配置层
- 配置层应分成哪几层
- 哪些配置属于内核默认值
- 哪些配置属于项目级覆盖
- 哪些配置属于任务运行时覆盖
- 当前阶段应先支持哪些最小配置块

## 2. 为什么必须有配置模型

若 Harness 要从“试运行规则系统”升级为“生命周期内核 + 插件接入框架”，则配置层是正式组成部分，而不是可选附属能力。

如果没有配置层，会出现几个问题：

- 核心 phase、auto-advance、blocked 策略被写死
- 插件启用、顺序和失败策略只能靠文档习惯维持
- 不同项目的差异化策略无法稳定覆盖
- 任务级临时策略会反向污染默认行为

因此，Harness 必须具备：

- 初始化配置
- 默认配置
- 项目覆盖配置
- 任务级运行时覆盖

## 3. 配置模型设计原则

### 3.1 核心协议先稳定，配置后覆盖

配置不能替代合同。

Phase、Hook、Plugin Contract 先定义“可以如何接”，配置层再定义“当前项目怎么接”。

### 3.2 默认值应少而稳

V1 不追求万能配置中心。

当前阶段的目标是：

- 保证生命周期、插件和 runtime 策略可覆盖
- 保证项目能按需启用或禁用能力
- 避免配置项爆炸

### 3.3 任务级覆盖不反向污染项目默认值

任务运行时可以临时覆盖：

- `agent_mode`
- 是否允许自动推进到 `push`
- blocked 恢复后的恢复策略

但这些覆盖不应回写项目默认配置。

### 3.4 当前阶段优先 in-repo 配置，不急于 package 配置平台

Harness 当前仍处于：

- `in-repo incubation`

所以 V1 先只定义配置模型和最小落点，不急于做：

- npm 包初始化器
- 复杂 GUI 配置器
- 多项目配置注册中心

## 4. 三层配置结构

### 4.1 Kernel Default Config

内核默认配置负责定义：

- 默认 phase 顺序
- 默认 hook 集合
- 默认 auto-advance 策略
- 默认 blocked / resume 行为
- 默认 closure 终点
- 默认内置插件集合
- 默认 runtime 写入范围

它的特点是：

- 由 Harness 核心维护
- 变更频率应低
- 作为项目默认配置的基线

### 4.2 Project Harness Config

项目级配置负责定义：

- 当前项目启用哪些插件
- 插件顺序如何安排
- 哪些 task domain 默认高风险
- 哪些场景默认允许自动推进到 `push`
- 是否启用 blocked runtime
- 是否启用版本治理联动
- runtime 需要承接到什么粒度

它的特点是：

- 由项目维护
- 可覆盖 kernel defaults
- 不改变核心协议，只改变当前项目策略

### 4.3 Task Runtime Overrides

任务运行时覆盖负责定义：

- 当前任务强制 `single-agent / multi-agent`
- 当前任务禁止自动提交
- 当前任务进入 protected mode
- 当前任务 blocked 后不允许自动恢复
- 当前任务临时附加 diagnostics 输入

它的特点是：

- 生命周期内短期有效
- 应写入 runtime，而不是项目配置
- 任务结束后不默认保留

## 5. V1 最小配置块

V1 不一次做全量配置体系，建议先正式支持以下四类配置块：

### 5.1 `lifecycle`

用于定义：

- 启用哪些 phase
- phase 顺序
- 默认 auto-advance 终点
- blocked / resume 是否启用
- 当前 closure 终点定义

示意字段：

- `enabled_phases`
- `phase_order`
- `default_auto_advance_target`
- `blocked_enabled`
- `closure_terminal_phase`

### 5.2 `plugins`

用于定义：

- 哪些插件启用
- 插件默认顺序
- 某插件是否 required
- 插件失败时是否阻断主链路

示意字段：

- `enabled`
- `order`
- `required_plugins`
- `failure_overrides`

### 5.3 `task_strategy`

用于定义：

- task_domain 默认策略
- docs-only / bugfix / harness-core 的默认行为
- 多 agent 与多批次默认判断偏好
- 版本治理命中策略

示意字段：

- `domain_profiles`
- `default_agent_mode`
- `default_batching_policy`
- `versioning_domains`
- `high_risk_domains`

### 5.4 `runtime`

用于定义：

- 哪些 runtime 文件启用
- 事件记录粒度
- 是否启用并发状态同步
- 是否启用 blocked 进入 / 恢复写入

示意字段：

- `enabled_files`
- `event_level`
- `multi_agent_sync_enabled`
- `blocked_runtime_enabled`

## 6. 当前不建议在 V1 正式纳入的配置块

以下内容当前阶段可以先保留在设计层或方法层，不急于变成正式配置块：

- method registry 全量配置
- review policy 的细粒度矩阵
- 发布流水线配置
- npm package export 配置
- 外部平台集成配置

原因是当前更优先保证：

- 生命周期模型稳定
- 插件接入稳定
- runtime 表达稳定

## 7. 配置与合同的关系

### 7.1 合同定义边界

合同负责定义：

- phase 可以有哪些
- hook 可以怎么挂
- plugin 至少声明什么

### 7.2 配置定义实例化结果

配置负责定义：

- 当前项目启用哪些 phase
- 当前项目启用哪些 plugin
- 当前项目默认推进到哪里
- 当前项目 runtime 写到什么粒度

也就是：

- contract = 能力边界
- config = 实际装配

## 8. 配置与 runtime 的关系

配置不是 runtime 快照，但会影响 runtime 的最小表达。

例如：

- 若 `multi_agent_sync_enabled = false`
  - runtime 可以不要求完整并发状态同步
- 若 `blocked_runtime_enabled = true`
  - blocked 进入 / 恢复动作必须写 runtime
- 若 `default_auto_advance_target = push`
  - `开始执行` 后默认自动收口到 `push`

因此，配置层会影响：

- runtime 是否写
- 写什么
- 写到什么粒度

## 9. 配置与任务域的关系

不同 `task_domain` 必须允许挂接不同策略。

例如：

### `harness-core`

- 更容易命中版本治理
- 更容易要求文档沉淀
- 更适合纳入能力矩阵回写

### `project-architecture`

- 更容易命中复杂拆分
- 更容易命中高风险人工接入

### `project-feature`

- 更偏常规自动推进

### `project-bugfix`

- 更偏诊断、验证和 blocked 处理

### `project-docs`

- 更适合快速自动闭环

这层区分不应写死在 skill 文本里，而应逐步收敛到配置层。

## 10. 配置与问题诊断闭环的关系

问题诊断闭环 V1 也需要配置承接，而不是固定写死。

至少需要考虑：

- 是否启用 diagnostics intake
- 哪些文件允许作为默认诊断输入
- 问题文件复制目录放在哪里
- 哪些 task_domain 默认更适合开启 diagnostics

当前阶段可先不做完整配置块，但设计上必须预留。

## 11. V1 建议的配置落点

当前阶段不急于实现完整配置系统，但建议先在架构上预留三类落点：

### 11.1 内核默认配置

暂以核心设计文档表达，不急于独立文件化。

### 11.2 项目级 Harness 配置

后续建议引入单独配置文件，例如：

- `harness.config.json`
- 或 `.harness/config.json`

当前阶段先完成模型设计，不强制立即落真实文件。

### 11.3 任务级运行时覆盖

继续写入：

- `.harness-runtime/current-task.yaml`
- `.harness-runtime/current-batch.yaml`

由 runtime 视图承接短期覆盖状态。

## 12. 现阶段最需要的改造

如果按 V1 实施优先级，配置层最值得先补的是：

1. 生命周期默认配置
2. 插件启用与顺序配置
3. task domain 策略配置
4. runtime 写入范围配置

不建议一开始就做：

- 复杂 UI 配置器
- 完整发布配置
- 通用插件市场系统

## 13. 当前阶段总结

Harness 配置模型 V1 可以压缩成一句：

它是 Harness 从“规则写死在核心里”升级为“核心合同稳定、项目策略可覆盖、任务运行时可临时覆盖”的最小配置层。

当前阶段最重要的不是把配置做复杂，而是先让：

- 生命周期可配置
- 插件启用可配置
- 任务策略可配置
- runtime 写入粒度可配置

这样后续再进入 package-ready 阶段时，核心和项目之间才不会继续强耦合。
