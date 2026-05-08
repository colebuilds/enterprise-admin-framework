---
title: Harness phase state / transition 模型 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-03
related_decisions: phase-hook-plugin-contract-v1, runtime-and-config-schema-v1, closure-model, core-architecture-v2
---

# Harness phase state / transition 模型 V1

## 1. 目标

本文档用于把 Harness 当前已有的：

- phase contract
- runtime schema
- closure 模型

进一步收敛成 phase 状态与转移模型，明确：

- phase 当前状态应该怎么表达
- phase 之间允许怎样转移
- 哪些转移属于正常推进
- 哪些转移属于 blocked / resume
- closure 在 phase 转移中如何收敛

本文档回答的问题是：

- Harness phase 在状态层应该长什么样
- `requirement-analysis -> ... -> closure` 的主链路如何表达
- blocked 和 resume 如何进入状态模型
- `total-acceptance / total-mr-ready` 在 phase 层处于什么位置

## 2. 为什么要单独定义状态与转移模型

如果只有：

- phase 列表
- phase 合同
- runtime 快照字段

但没有状态与转移模型，后续会出现：

- phase 当前状态定义不稳
- blocked 进入 / 恢复语义漂移
- batch 推进与 closure 推进边界不清
- runtime 里虽然有 `phase.current`，但不知道哪些切换是合法的

因此，V1 需要一份单独的 phase state / transition 模型。

## 3. 设计原则

### 3.1 先定义最小主链路

V1 先只覆盖最重要的主链路：

- `requirement-analysis`
- `boundary`
- `planning`
- `execution`
- `verification`
- `submission`
- `closure`

不一开始做复杂状态机。

### 3.2 phase 状态和任务状态分开

phase 状态回答的是：

- 当前处于哪个生命周期阶段

任务状态回答的是：

- 当前 Task / Work Item / Execution Unit 是否：
  - pending
  - active
  - completed
  - blocked

两者有关联，但不应混为一体。

### 3.3 blocked 是状态偏移，不是新 phase

V1 中：

- blocked 不单独变成新 phase

更合理的理解是：

- 当前 phase 进入 `blocked = true`
- 或当前 phase 停在 `paused-by-blocked`

这样更符合现有 runtime 和 blocked 动作闭环。

### 3.4 closure 是 phase，`total-acceptance / total-mr-ready` 是 closure 内部状态

V1 中应明确：

- `closure` 是标准 phase
- `total-acceptance`
- `total-mr-ready`

属于 closure 内部的推进状态，而不是新的顶层 phase。

## 4. phase 状态模型

### 4.1 最小状态字段

当前最小正式 `phase` 字段组应承接：

```yaml
phase:
  current:
  current_stage:
  state:
  entered_at:
  blocked:
  blocked_reason:
  resumable:
  contract_id:
  contract_status:
  next_phase:
```

字段说明：

- `current`
  - 当前 phase 标识
- `current_stage`
  - 当前阶段兼容字段，当前仍保留用于旧读取视图
- `state`
  - 当前 phase 状态
- `entered_at`
  - 进入当前 phase 的时间
- `blocked`
  - 当前是否因阻塞停住
- `blocked_reason`
  - 阻塞原因摘要
- `resumable`
  - 当前是否具备恢复条件
- `contract_id`
  - 当前命中的 phase contract 标识
- `contract_status`
  - 当前 phase contract 的最小承接状态
- `next_phase`
  - 当前 contract 视角下的下一推进目标

### 4.1A 当前实现边界

自 Harness V2 P1 后半段开始，phase 已不再只靠命令语义和 `current_stage` 直写推进。

当前最小已落地能力是：

- `task_card`
  - 进入前要求：
    - `formal_task.task_id` 存在
    - `formal_task.status = ready`
- `boundary`
  - 进入前要求：
    - `task_card_start.task_id` 存在
    - `task_card_start.status = ready`
- `planning`
  - 进入前要求：
    - `boundary_start.task_id` 存在
    - `boundary_start.status = ready`
- `execution`
  - 进入前要求：
    - `work_item.work_item_id` 存在
    - `execution_unit.execution_unit_id` 存在
    - `execution.execution_entry` 已写入
- `verification`
  - 进入前要求：
    - 当前 phase 已到 `execution`
    - `execution.execution_entry` 已写入
- `submission`
  - 进入前要求：
    - 当前 phase 已到 `verification`
    - `validation.conclusion` 已写入
- `closure`
  - 进入前要求：
    - 当前 phase 已到 `submission`
    - `submission.status` 已写入

也就是：

- `start-formal-task-card`
  - 已开始经过 `task_card` phase contract gate
- `start-task-boundary`
  - 已开始经过 `boundary` phase contract gate
- `checkpoint split-confirmed`
  - 已开始经过 `planning` phase contract gate
- `checkpoint execution-entry`
  - 已开始经过 `execution` phase contract gate
- `checkpoint verify`
  - 已开始经过 `verification` phase contract gate
- `checkpoint submit-result`
  - 已开始经过 `submission` phase contract gate
- `checkpoint total-mr-ready / total-closure`
  - 已开始经过 `closure` phase contract gate

V1 当前仍不是完整状态机，但已经从“纯命令推进”进入“最小 contract/state boundary 推进”。

### 4.2 推荐最小 `state` 枚举

V1 推荐 phase 状态最小枚举如下：

- `pending`
- `active`
- `completed`
- `blocked`

其中：

- `pending`
  - 该 phase 尚未成为当前 phase
- `active`
  - 当前 phase 正在进行
- `completed`
  - 当前 phase 已完成并可进入下一 phase
- `blocked`
  - 当前 phase 因阻塞暂停推进

V1 不强制增加：

- `skipped`
- `failed`
- `cancelled`

这些可以后续再演进。

## 5. 主链路 phase 转移

### 5.1 标准正常转移

V1 主链路的正常 phase 转移如下：

1. `requirement-analysis -> boundary`
2. `boundary -> planning`
3. `planning -> execution`
4. `execution -> verification`
5. `verification -> submission`
6. `submission -> closure`

### 5.2 进入条件与退出结果

每次合法转移都应满足：

- 当前 phase 已达成最小 required outputs
- 下一 phase 的 enter conditions 已满足

也就是：

- 不能只因为口令存在就强行跳 phase
- 也不能跳过前置结构确认

## 6. blocked / resume 转移

### 6.1 blocked 进入规则

V1 中，以下 phase 可以进入 blocked：

- `planning`
- `execution`
- `verification`
- `closure`

其中最常见的是：

- `execution.blocked`
- `verification.blocked`

### 6.2 blocked 进入后的状态表达

blocked 后不改变 `phase.current`，而是更新：

```yaml
phase:
  current: execution
  state: blocked
  blocked: true
```

或：

```yaml
phase:
  current: verification
  state: blocked
  blocked: true
```

### 6.3 resume 规则

blocked 恢复后，V1 推荐做法是：

- 保持当前 `phase.current` 不变
- `state` 从 `blocked` 回到 `active`
- 再继续走该 phase 的剩余逻辑

也就是：

- `execution.blocked -> execution.active`
- `verification.blocked -> verification.active`

而不是直接跳到下一 phase。

### 6.4 恢复后的下一步

恢复之后是否允许继续自动推进，应由：

- project config
- task runtime overrides
- blocked recovery policy

共同决定。

### 6.5 exit 规则

V1 中，`exit` 不表示“离开 phase 字段”，而表示：

- 当前 phase 已完成本阶段最小 required outputs
- `phase.current` 仍保留该 phase
- `phase.state` 进入 `completed`
- `phase.contract_status` 进入 `completed`
- `phase.next_phase` 指向下一标准 phase 或为 `null`

这意味着：

- `submission -> closure` 前，`submission` 自身可以先 exit
- `closure` 达到 terminal 条件后，也通过 `closure + completed` 表达退出结果

### 6.6 re-enter 规则

V1 中，`re-enter` 用于表示：

- 当前仍停留在同一个 phase
- 但发生了新的有效推进、恢复或再次进入判断
- 不应误判为“进入下一个 phase”

推荐最小表达为：

```yaml
phase:
  current: execution
  state: active
  contract_status: re-entered
```

典型场景：

- `execution` phase 内的 `batch-advance`
- `execution` phase 内的 `multi-agent-sync`
- `closure` phase 内的再次推进但尚未 terminal

因此：

- `re-enter` 不是新 phase
- `re-enter` 不是 resume 的别名
- `resume` 只处理 blocked -> active
- `re-enter` 处理同一 phase 内的新一轮推进承接

## 7. closure 内部状态模型

### 7.1 为什么 closure 还要有子状态

因为 `closure` phase 本身承接了：

- batch 收口
- 总收口
- total acceptance
- total mr ready

如果只写成一个平面 phase，就无法表达收口推进。

### 7.2 closure 子状态建议

V1 推荐 `closure.state_detail` 或等价字段承接：

- `batch-closing`
- `total-acceptance`
- `total-mr-ready`

其中：

- `batch-closing`
  - 最后一个中任务完成后进入总收口前后的整理状态
- `total-acceptance`
  - 总验收阶段
- `total-mr-ready`
  - 当前体系下的阶段性终点

### 7.3 closure 最小转移

推荐最小 closure 内部转移如下：

1. `closure(active, batch-closing)`
2. `closure(active, total-acceptance)`
3. `closure(active, total-mr-ready)`
4. `closure(completed, total-mr-ready)`

### 7.4 当前阶段终点

V1 中应明确：

- `closure + state_detail = total-mr-ready`

是当前体系下的阶段性终点。

也就是说：

- 还不存在更后续的正式 phase
- `total-mr-ready` 之后若要继续扩展，需新增正式阶段对象

## 8. 多批次任务与 phase 转移的关系

### 8.1 批次推进不等于 phase 变更

多批次任务中：

- 当前任务切到下一任务

并不自动意味着 phase 改变。

更准确地说：

- phase 仍可能保持在 `execution`
- 只是 `current-task / current-batch` 中的当前对象发生变化

### 8.2 phase 与批次推进如何协同

建议理解为：

- batch 推进
  - 是对象层推进
- phase 转移
  - 是生命周期层推进

只有在：

- 当前对象层执行结束并进入验证

时，phase 才从 `execution -> verification`。

## 9. 多 agent 与 phase 转移的关系

### 9.1 多 agent 不改变 phase 列表

无论：

- `single-agent`
- `multi-agent`

phase 列表都不应变化。

变化的是：

- 当前 phase 下由谁承担动作
- orchestration 字段如何表达主控 / 子代理

### 9.2 多 agent 只影响 phase 承接方式

例如：

- `execution`
  - 可由主控 + 多执行子代理共同完成
- `verification`
  - 可由主控协调验证型动作

但 phase 转移合同本身不应因 agent_mode 被重写。

## 10. 与 runtime schema 的关系

phase 状态模型建议在 runtime 中至少对应：

```yaml
phase:
  current:
  state:
  entered_at:
  blocked:
  blocked_reason:
  resumable:
  state_detail:
```

其中：

- `state_detail`
  - 在普通 phase 下可为空
  - 在 closure 下可承接：
    - `batch-closing`
    - `total-acceptance`
    - `total-mr-ready`

## 11. 非法转移的边界

V1 明确不建议出现以下非法转移：

- `requirement-analysis -> execution`
- `boundary -> verification`
- `planning -> submission`
- `blocked -> next phase`
  - 在未恢复当前 phase 的前提下

同样，不应因为用户一句：

- `继续`

就隐式跨 phase 跳转。

## 12. 当前阶段明确不包含

本次模型明确不包含：

- 完整状态机图执行器
- 状态回滚机制
- skipped / cancelled / failed 全量状态
- 并发 phase
- phase 级数据库持久化系统

V1 只先定义：

- 最小 phase 状态
- 最小合法转移
- blocked / resume 规则
- closure 子状态

## 13. 总结

Harness phase state / transition 模型 V1 可以压缩成一句：

Harness 以 `requirement-analysis -> boundary -> planning -> execution -> verification -> submission -> closure` 为主链路，phase 以 `pending / active / completed / blocked` 表达当前状态，blocked 作为状态偏移处理，closure 以内嵌 `total-acceptance / total-mr-ready` 子状态完成最终收口。

没有这层模型，phase contract 虽然存在，但 runtime 中的 phase 当前值、blocked 恢复语义和 closure 推进语义仍会继续漂移。
