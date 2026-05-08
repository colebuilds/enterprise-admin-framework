---
title: Harness diagnostics collect/analyze 到 remediation task 升级规则 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: diagnostics-intake-v1, diagnostics-collect-analyze-contract-v1, diagnostics-runtime-and-issue-runtime-model-v1, terminology-and-object-model-v2
---

# Harness diagnostics collect/analyze 到 remediation task 升级规则 V1

## 1. 目标

本文档用于把 Harness diagnostics 子系统中已经存在的：

- `collect-diagnostics`
- `analyze-diagnostics`
- `Issue`
- `Diagnostic Report`
- `Remediation Task`

之间的升级路径继续细化为明确规则，回答：

- 什么情况保持 issue
- 什么情况升级为议题
- 什么情况升级为 remediation task
- 升级时需要满足哪些最小条件
- 升级后 diagnostics runtime 和正式任务流如何分工

## 2. 设计原则

### 2.1 不是所有 diagnostics 结果都要进任务流

V1 必须明确：

- 有些问题应继续保留为 issue
- 有些问题只值得进入议题层
- 只有满足可执行性条件的问题，才应升级为 remediation task

否则会出现：

- diagnostics 目录变成任务垃圾入口
- 正式任务流被低价值问题污染

### 2.2 先 collect，再 analyze，再决定是否升级

升级判断必须建立在：

1. 已完成 `collect-diagnostics`
2. 已完成 `analyze-diagnostics`
3. 已产出最小 `Diagnostic Report`

的基础上。

V1 不允许：

- 只凭口头现象直接升级 remediation task
- 未固定证据就直接判为任务

### 2.3 升级规则优先考虑可执行性

V1 的核心判断不是“这个问题烦不烦”，而是：

- 是否具备正式进入任务流的可执行性

## 3. 三层升级结果

V1 推荐把 diagnostics 结果分为三层：

### 3.1 保持 issue

适用于：

- 问题还不够清楚
- 证据还不完整
- 初步归因仍不稳定
- 当前只适合继续观察或补充信息

### 3.2 升级为议题

适用于：

- 问题具备跟踪价值
- 但暂时还不够形成正式修复任务
- 需要后续继续观察、补证据、补分析

### 3.3 升级为 remediation task

适用于：

- 问题边界已较清晰
- 根因方向已足够明确
- 修复对象已基本可判定
- 已具备正式进入任务卡、边界、计划流程的条件

## 4. 保持 issue 的判定规则

命中以下任一情况时，V1 应优先保持 issue：

- 证据文件不足
- `diagnostic-report.md` 尚未形成
- `suspected_layer` 仍不稳定
- 同一问题存在多个相互冲突的根因方向
- 当前只能确认“有异常”，无法确认修复对象
- 当前无法判断这是不是 Harness 本体问题

此时 diagnostics 输出应至少明确：

- 当前仍保持 issue
- 仍缺哪些证据
- 下一步是补收集、补分析，还是继续观察

## 5. 升级为议题的判定规则

命中以下条件组合时，V1 建议升级为议题：

1. 已完成 collect
2. 已完成 analyze
3. 问题具备持续跟踪价值
4. 但尚未达到 remediation task 的可执行性门槛

典型场景包括：

- 已能确认存在系统缺口，但修复位置仍不唯一
- 已能确认这是 Harness 相关问题，但仍需继续分析型 Work Item
- 问题会影响后续设计方向，但当前不适合直接开改

### 5.1 升级为议题时的最小输出

应至少明确：

- 议题名称
- 议题来源 issue_id
- 当前建议继续观察还是继续分析
- 是否预计后续升级为 remediation task

## 6. 升级为 remediation task 的判定规则

命中以下条件组合时，V1 建议升级为 remediation task：

1. 已完成 collect
2. 已完成 analyze
3. 已形成稳定 `Diagnostic Report`
4. 已能明确受影响层
5. 已能大致明确修复边界
6. 当前问题具备正式执行价值

### 6.1 最小判定条件

V1 至少要求满足以下 4 条：

#### A. 根因方向足够明确

例如已能稳定指向：

- `rule-gap`
- `runtime-gap`
- `plugin-gap`
- `blocked-recovery-gap`

而不是仍然处于“可能是很多层”的模糊状态。

#### B. 影响对象足够明确

至少应能指出：

- 哪个 phase
- 哪类 runtime 对象
- 哪个 plugin 或规则域

#### C. 修复边界可进入任务卡

即便不能立刻写完整计划，也应至少能回答：

- 这是不是一个正式任务
- 是 docs-only、docs+runtime、runtime-implementation，还是规则修正

#### D. 问题值得进入正式执行流

例如：

- 会反复影响主链路
- 会影响自动推进
- 会影响 blocked / closure / submission
- 会影响 Harness 协议一致性

## 7. 不应升级为 remediation task 的场景

V1 明确以下情况不应直接升级为 remediation task：

- 纯环境噪音
- 一次性操作失误
- 尚未复现的模糊症状
- 证据明显不足
- 只需要补充 notes 或补充证据索引
- 当前更适合作为方法使用问题而非系统缺口

## 8. 升级后的对象关系

### 8.1 issue 不消失

升级为 remediation task 后：

- 原 issue 不应直接消失

而应保留为：

- diagnostics 来源对象

### 8.2 remediation task 是新对象

当升级发生时，应生成新的正式对象：

- `Remediation Task`

它应重新进入主生命周期：

- requirement-analysis
- boundary
- planning
- execution
- verification
- submission
- closure

### 8.3 issue 与 task 应保留引用关系

V1 建议至少保留：

- `issue_id -> remediation_task_ref`
- `remediation_task -> source_issue_id`

## 9. 与 runtime 的关系

### 9.1 diagnostics runtime

在升级路径上应至少表达：

- `status`
  - `collecting / analyzing / upgrading / completed`
- `upgrade_target`
  - `none / issue / topic / remediation-task`

### 9.2 issue runtime

在升级为 remediation task 时，应至少表达：

- `issue.status = upgraded`
- `issue.stage = upgraded-to-task`
- `issue.remediation_task_ref = <task-id>`

### 9.3 正式任务 runtime

升级后，正式任务 runtime 应由主任务流重新接管。

diagnostics runtime 不应继续承担：

- 正式任务执行状态
- 提交状态
- closure 状态

## 10. 与 collect / analyze 动作合同的关系

推荐顺序如下：

1. `collect-diagnostics`
2. `analyze-diagnostics`
3. 输出升级判断：
   - keep-as-issue
   - upgrade-to-topic
   - upgrade-to-remediation-task

也就是说：

- collect 不负责升级
- analyze 负责给出升级建议
- 真正的升级动作应作为后续对象升级动作承接

## 11. 推荐最小升级输出

V1 建议在 `diagnostic-report.md` 或等价输出中至少能给出：

```yaml
upgrade_decision:
upgrade_reason:
next_action:
remediation_task_type:
```

字段含义：

- `upgrade_decision`
  - `keep-issue / upgrade-topic / upgrade-remediation-task`
- `upgrade_reason`
  - 为什么作出当前判断
- `next_action`
  - 下一步建议
- `remediation_task_type`
  - 若升级为任务，建议的任务类型

## 12. 当前阶段明确不包含

V1 明确不包含：

- 自动创建 remediation task 脚本
- 自动开始执行 remediation task
- 多 issue 自动批量升级
- issue 优先级评分引擎
- diagnostics 到任务流的自动调度平台

## 13. 总结

Harness diagnostics collect/analyze 到 remediation task 升级规则 V1 的核心结论是：

- diagnostics 结果分三层：
  - 保持 issue
  - 升级为议题
  - 升级为 remediation task
- 只有在：
  - 根因方向明确
  - 影响对象明确
  - 修复边界可进入任务卡
  - 问题值得进入正式执行流时，才建议升级为 remediation task
- 升级后：
  - issue 继续保留为来源对象
  - remediation task 作为新正式对象进入主生命周期
- collect 负责固定现场，analyze 负责给出升级建议，正式升级动作应由后续对象升级机制承接
