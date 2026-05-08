---
title: Harness Phase / Hook / Plugin Contract V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_standards: FE-AI-004
related_decisions: core-architecture-v2
---

# Harness Phase / Hook / Plugin Contract V1

## 1. 目标

本文档用于把 Harness V2 中已经提出的：

- 生命周期模型
- Hook 模型
- 插件接入模型

进一步收敛成一套可被后续 skill、runtime 和配置层统一消费的最小合同。

本文档回答的问题是：

- Harness 的标准 phase 是什么
- phase 与人工控制口令如何区分
- 各 phase 的最小输入、输出和出口条件是什么
- hook 应该怎么挂
- plugin 至少需要声明哪些字段
- plugin 在系统中如何被挂载、调度和阻断

## 2. 设计原则

### 2.1 phase 是系统对象，不是口令别名

phase 属于生命周期内核的一部分，应稳定、可配置、可被 runtime 承接。

用户口令只负责：

- 授权
- 查询
- 控制

不直接替代 phase。

### 2.2 plugin 必须接合同，不直接接聊天习惯

后续任何 skill / plugin 接入 Harness，都不应再依赖“约定俗成”的阶段理解，而必须通过：

- phase
- hook
- reads / writes
- failure policy

这些正式字段接入。

### 2.3 V1 只做最小合同

当前阶段只定义足以支撑：

- task-flow
- orchestration
- runtime-recording
- document-governance
- diagnostics

这几类核心插件的最小合同，不扩成完整事件总线或完整调度框架。

## 3. 标准 Phase 模型 V1

### 3.1 phase 列表

Harness V1/V2 过渡阶段推荐的标准 phase 如下：

1. `requirement-analysis`
2. `boundary`
3. `planning`
4. `execution`
5. `verification`
6. `submission`
7. `closure`

### 3.2 phase 含义

#### `requirement-analysis`

负责：

- 需求理解
- 复杂度判断
- 风险判断
- 任务对象初判
- 是否需要分析型 Work Item
- 是否需要任务编排、多 agent、文档、版本治理

#### `boundary`

负责：

- 本次包含
- 本次不包含
- 影响范围
- 风险边界
- 受保护路径确认

#### `planning`

负责：

- 任务拆分
- 批次结构
- 当前 / 下一任务关系
- Work Item 与 Execution Unit 规划
- 总收口路径

#### `execution`

负责：

- 真实改动执行
- runtime 写入
- 当前任务推进
- blocked 进入与恢复

#### `verification`

负责：

- 功能验证
- 计划一致性验证
- 文件范围验证
- 验证结果写入

#### `submission`

负责：

- 展示提交范围
- 形成提交结论
- `git add / commit / push`
- 必要时版本动作和日志动作联动

#### `closure`

负责：

- 批次收口
- 总收口
- `total-acceptance`
- `total-mr-ready`
- 阶段性能力反哺或演进记录

## 4. phase 与控制口令的关系

### 4.1 以下属于控制口令，不属于 phase

- `先分析`
- `生成边界`
- `生成计划`
- `开始执行`
- `停止执行`
- `提交结果`

### 4.2 控制口令的架构定位

建议理解为：

- `先分析`
  - 把系统拉回 `requirement-analysis`
- `生成边界`
  - 请求输出 `boundary` 阶段结果
- `生成计划`
  - 请求输出 `planning` 阶段结果
- `开始执行`
  - 执行链路总授权点
- `停止执行`
  - 执行链路中断控制点
- `提交结果`
  - `submission` 阶段的内部展示节点

这层区分的目标是：

- phase 稳定
- 口令可变
- 宿主平台可替换

## 5. Phase Contract V1

### 5.1 通用字段

每个 phase 至少应声明：

- `phase_id`
- `goal`
- `required_inputs`
- `required_outputs`
- `default_plugins`
- `enter_conditions`
- `auto_advance_conditions`
- `blocked_conditions`
- `resume_conditions`
- `exit_conditions`

### 5.2 最小 phase 合同建议

#### `requirement-analysis`

- `required_inputs`
  - 用户需求
  - 项目上下文
  - 当前任务上下文（若存在）
- `required_outputs`
  - 任务初判
  - 风险初判
  - task_domain 初判
  - 是否需要分析型 Work Item
  - 是否进入边界
- `exit_conditions`
  - 已形成任务卡或议题升级结论

#### `boundary`

- `required_inputs`
  - 任务卡
  - 风险初判
- `required_outputs`
  - 本次包含 / 不包含
  - 影响范围
  - 风险说明
- `exit_conditions`
  - 边界已清晰可进入 planning

#### `planning`

- `required_inputs`
  - 边界
  - 任务对象
- `required_outputs`
  - Work Item 拆分
  - Execution Unit 规划
  - 单任务 / 单批次 / 多批次判断
  - 当前 / 下一任务
  - 总收口路径
- `exit_conditions`
  - 已形成执行前结构确认

#### `execution`

- `required_inputs`
  - 已确认计划
  - `开始执行` 授权
- `required_outputs`
  - 真实改动
  - runtime 状态写入
  - 执行结果
- `exit_conditions`
  - 已进入 verification
  - 或命中 blocked

#### `verification`

- `required_inputs`
  - 执行结果
  - 验证策略
- `required_outputs`
  - 验证结论
  - 是否可提交
  - 是否 blocked
- `exit_conditions`
  - 可进入 submission
  - 或停在 blocked / 待人工验证

#### `submission`

- `required_inputs`
  - 验证完成
  - 文件清单
- `required_outputs`
  - 提交范围展示
  - commit / push 结果
  - 版本治理联动结果（若命中）
- `exit_conditions`
  - 可进入 closure

#### `closure`

- `required_inputs`
  - 已提交状态
  - 批次或总任务状态
- `required_outputs`
  - 批次收口结果
  - 总收口结果
  - `total-acceptance / total-mr-ready`
  - 演进记录判断
- `exit_conditions`
  - 到达当前体系终点

## 6. Hook 模型 V1

### 6.1 通用 hook

V1 推荐最小 hook 集合：

- `before_phase`
- `enter_phase`
- `after_phase`
- `on_blocked`
- `on_unblocked`
- `before_submit`
- `after_submit`
- `before_closure`
- `after_closure`

### 6.2 hook 用途

#### `before_phase`

用于：

- 前置检查
- 补输入
- 判断是否禁止进入该 phase

#### `enter_phase`

用于：

- 进入 phase 时写 runtime
- 刷新当前 phase 视图

#### `after_phase`

用于：

- 消费 phase 输出
- 形成下一阶段可用对象

#### `on_blocked`

用于：

- 写 blocked runtime
- 记录 blocked 原因
- 停止自动推进

#### `on_unblocked`

用于：

- 写恢复状态
- 重新判断是否回到自动推进链路

#### `before_submit`

用于：

- 展示提交范围
- 检查不应提交文件
- 检查版本治理联动

#### `after_submit`

用于：

- 写提交结果
- 更新 batch / task 状态

#### `before_closure`

用于：

- 判断是否可进入批次收口 / 总收口

#### `after_closure`

用于：

- 写 `total-acceptance / total-mr-ready`
- 回写能力矩阵、演进记录或诊断记录

## 7. Plugin Contract V1

### 7.1 通用字段

每个 plugin 至少应声明：

- `plugin_id`
- `plugin_name`
- `plugin_role`
- `attached_phases`
- `attached_hooks`
- `reads`
- `writes`
- `required`
- `replaceable`
- `failure_policy`

### 7.2 字段说明

#### `plugin_role`

建议最小角色：

- `phase-owner`
- `phase-enhancer`
- `runtime-writer`
- `verifier`
- `closure-coordinator`
- `diagnostics-provider`

#### `attached_phases`

声明 plugin 默认在哪些 phase 工作。

#### `attached_hooks`

声明 plugin 默认挂在哪些 hook。

#### `reads`

声明 plugin 读取哪些对象，例如：

- task card
- planning result
- current-task runtime
- events log

#### `writes`

声明 plugin 会写哪些对象，例如：

- phase output
- runtime snapshot
- events
- documents

#### `failure_policy`

V1 建议支持：

- `block`
- `warn`
- `skip`

## 8. 当前核心插件映射建议

### 8.1 `harness-task-flow`

- `plugin_role`
  - `phase-owner`
- `attached_phases`
  - `requirement-analysis`
  - `boundary`
  - `planning`
  - `execution`
  - `verification`
  - `submission`
  - `closure`
- `reads`
  - 用户需求
  - 当前任务对象
  - 计划与验证结果
- `writes`
  - 任务卡
  - phase 输出
  - 执行前结构确认结果

### 8.2 `ai-subtask-orchestration`

- `plugin_role`
  - `phase-enhancer`
- `attached_phases`
  - `requirement-analysis`
  - `planning`
  - `execution`
- `attached_hooks`
  - `before_phase`
  - `after_phase`
  - `on_blocked`
- `reads`
  - 当前任务对象
  - 文件边界
  - batch 结构
- `writes`
  - agent_mode
  - Work Item 拆分
  - 并发边界建议

### 8.3 `harness-runtime-recording`

- `plugin_role`
  - `runtime-writer`
- `attached_phases`
  - `execution`
  - `verification`
  - `submission`
  - `closure`
- `attached_hooks`
  - `enter_phase`
  - `after_phase`
  - `on_blocked`
  - `on_unblocked`
  - `after_submit`
  - `after_closure`
- `reads`
  - 当前 phase 输出
  - 当前 Task / Work Item / Execution Unit
- `writes`
  - `.harness-runtime/current-task.yaml`
  - `.harness-runtime/current-batch.yaml`
  - `.harness-runtime/manual-validation.yaml`
  - `.harness-runtime/events.log`

### 8.4 `document-governance`

- `plugin_role`
  - `phase-enhancer`
  - `closure-coordinator`
- `attached_phases`
  - `boundary`
  - `planning`
  - `verification`
  - `closure`
- `attached_hooks`
  - `after_phase`
  - `before_closure`
- `reads`
  - 当前任务对象
  - 文档上下文
- `writes`
  - 文档落点判断
  - frontmatter 补全要求
  - README 挂载要求

### 8.5 `diagnostics`

V1 建议新增独立 diagnostics plugin 角色，用于后续问题文件收集与分析。

- `plugin_role`
  - `diagnostics-provider`
- `attached_phases`
  - `verification`
  - `closure`
  - 问题收集上游链路
- `attached_hooks`
  - `on_blocked`
  - `after_closure`
- `reads`
  - runtime 文件
  - 用户提供的问题文件
- `writes`
  - issue intake 目录
  - diagnostic report
  - 议题升级建议

## 9. 自动推进与阻断规则在合同中的位置

V1 必须把以下两类规则写进合同，而不是留在对话习惯里：

- auto-advance conditions
- failure / blocked policy

因为后续插件接入如果只知道“什么时候跑”，不知道“什么时候阻断”，系统仍然会漂回半自动。

## 10. 与配置层的关系

合同定义的是“可以如何接”，配置层定义的是“当前项目怎么接”。

也就是：

- contract
  - 稳定协议
- config
  - 项目启用、禁用、覆盖、排序

V1 先保证合同清楚，下一步再补：

- 生命周期默认配置
- 插件启用配置
- task strategy 配置
- runtime 配置

## 11. 当前阶段总结

Harness Phase / Hook / Plugin Contract V1 可以压缩成一句：

它是 Harness 从“skill 协作习惯”升级为“生命周期合同驱动”的第一层正式内核协议。

它的作用不是立即做成复杂平台，而是先让：

- phase 稳定
- hook 稳定
- plugin 接入稳定
- runtime 写入稳定

后续再在此基础上继续补配置、诊断和 package-ready 能力。
