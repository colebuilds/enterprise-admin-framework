---
title: Harness diagnostics runtime / issue runtime 模型 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: diagnostics-intake-v1, diagnostics-directory-and-issue-file-model-v1, runtime-and-config-schema-v1, diagnostics-collect-analyze-contract-v1
---

# Harness diagnostics runtime / issue runtime 模型 V1

## 1. 目标

本文档用于把 Harness diagnostics 子系统继续从：

- intake 规则
- issue 文件模型
- collect / analyze 动作合同

推进到运行态模型层，明确：

- diagnostics 在主 runtime 中如何表达
- 单个 issue 在运行态下如何表达
- 什么属于 diagnostics runtime
- 什么属于 issue runtime
- 它们与目录文件模型、正式任务流和 remediation task 的边界是什么

本文档回答的问题是：

- diagnostics 运行中状态应写到哪里
- 当前任务是否处于 diagnostics 处理中应如何表达
- 一个 issue 在收集、分析、升级过程中的最小状态如何表达
- diagnostics runtime 与 `current-task.yaml`、issue 目录文件如何分工

## 2. 为什么需要 runtime 模型

如果 diagnostics 只有：

- 静态目录
- issue 文件
- 分析文档

但没有运行态模型，会出现几个问题：

- 当前是否处于 diagnostics 流程不可见
- 当前是正在收集还是正在分析不可见
- 问题是否已经升级为 remediation task 不可见
- diagnostics 与主任务、blocked、恢复链路的关系难以被 runtime 稳定消费

因此，V1 需要补一层最小 diagnostics runtime。

## 3. 设计原则

### 3.1 diagnostics runtime 先挂在主 runtime 上

V1 不单独新建复杂 diagnostics runtime 数据库。

当前阶段优先把 diagnostics 状态承接在：

- `/.harness-runtime/current-task.yaml`

中的 `diagnostics` 字段组。

### 3.2 issue runtime 与 issue 文件模型分层

V1 必须区分：

- `issue file model`
  - 负责长期留档
- `issue runtime`
  - 负责当前流转状态

也就是说：

- `issue.md`
  - 是静态入口与持久对象
- `issue runtime`
  - 是当前是否在 collect / analyze / upgrade 的运行态表达

### 3.3 V1 只做最小状态，不做完整状态机

当前阶段不做：

- 多 issue 并发调度
- diagnostics 队列系统
- 复杂审计链
- issue 平台级看板

V1 只做：

- 当前 diagnostics 是否激活
- 当前 issue 是否激活
- 当前处于 collect / analyze / upgrade 哪一段
- 当前是否已转出为 remediation task

## 4. diagnostics runtime 与 issue runtime 的关系

建议理解为：

- `diagnostics runtime`
  - 当前任务视角下，diagnostics 子系统是否正在参与链路
- `issue runtime`
  - 当前激活 issue 视角下，这个问题对象当前跑到哪一步

二者关系是：

- diagnostics runtime 更偏系统层
- issue runtime 更偏单对象层

## 5. diagnostics runtime 模型 V1

### 5.1 承接位置

V1 建议 diagnostics runtime 先承接在：

- `/.harness-runtime/current-task.yaml`

中的：

```yaml
diagnostics:
```

字段组。

### 5.2 diagnostics 字段组建议

建议最小结构如下：

```yaml
diagnostics:
  enabled:
  active_issue_id:
  mode:
  status:
  current_action:
  suspected_layer:
  upgrade_target:
  last_updated_at:
```

### 5.3 字段说明

- `enabled`
  - 当前任务是否启用 diagnostics 子系统
- `active_issue_id`
  - 当前正在处理的 issue
- `mode`
  - 当前 diagnostics 模式
  - V1 推荐值：
    - `file-intake`
    - `disabled`
- `status`
  - diagnostics 当前总体状态
  - V1 推荐值：
    - `idle`
    - `collecting`
    - `analyzing`
    - `upgrading`
    - `completed`
    - `blocked`
- `current_action`
  - 当前动作
  - V1 推荐值：
    - `collect-diagnostics`
    - `analyze-diagnostics`
    - `upgrade-to-topic`
    - `upgrade-to-task`
- `suspected_layer`
  - 当前初步归因层
  - 例如：
    - `rule-gap`
    - `runtime-gap`
    - `plugin-gap`
    - `environment-issue`
- `upgrade_target`
  - 当前升级目标
  - 推荐值：
    - `none`
    - `issue`
    - `topic`
    - `remediation-task`
- `last_updated_at`
  - 最近更新时间

## 6. issue runtime 模型 V1

### 6.1 承接方式

V1 不建议把 issue runtime 直接混写到：

- `issue.md`

因为 `issue.md` 更适合作为问题对象的稳定留档文件。

V1 推荐单独为 issue runtime 预留：

- `/.harness-diagnostics/issues/<issue-id>/issue-runtime.yaml`

### 6.2 issue runtime 建议字段

建议最小结构如下：

```yaml
schema_version: v1
issue:
  issue_id:
  status:
  stage:
  source:
  current_owner:
  collected_files:
  analyzed:
  upgrade_suggestion:
  remediation_task_ref:
  updated_at:
```

### 6.3 字段说明

- `issue.issue_id`
  - 当前 issue 唯一标识
- `issue.status`
  - 问题对象当前状态
  - 推荐值：
    - `open`
    - `collecting`
    - `analyzing`
    - `ready-for-upgrade`
    - `upgraded`
    - `closed`
- `issue.stage`
  - 当前处于哪一段
  - 推荐值：
    - `intake`
    - `evidence-collected`
    - `diagnosis-ready`
    - `diagnosis-completed`
    - `upgraded-to-task`
- `issue.source`
  - 问题来源
  - 例如：
    - `user-report`
    - `runtime-observation`
    - `manual-review`
- `issue.current_owner`
  - 当前承接者
  - V1 可先写：
    - `diagnostics-provider`
    - `main-controller`
- `issue.collected_files`
  - 当前已收集证据文件列表
- `issue.analyzed`
  - 是否已完成分析
- `issue.upgrade_suggestion`
  - 当前建议升级方向
- `issue.remediation_task_ref`
  - 若已升级，指向 remediation task
- `issue.updated_at`
  - 最近更新时间

## 7. diagnostics runtime 与 issue 文件模型的分工

### 7.1 `issue.md`

负责：

- 问题对象的稳定入口
- 问题摘要
- 来源说明
- 初始状态说明

不负责：

- 高频运行态切换
- 当前 collect / analyze 的临时过程

### 7.2 `diagnostic-report.md`

负责：

- 当前系统诊断结论
- 归因说明
- 升级建议

不负责：

- 当前是否仍在 collect / analyze 过程中的短期状态跳转

### 7.3 `issue-runtime.yaml`

负责：

- 当前 issue 的运行态
- 是否仍在收集中
- 是否已进入分析
- 是否已升级为 remediation task

### 7.4 `current-task.yaml -> diagnostics`

负责：

- 从当前任务视角看 diagnostics 是否正在参与
- 当前 diagnostics 的总体状态
- 当前 diagnostics 对主任务链路的影响

## 8. 与 remediation task 的关系

当 issue 被升级为正式修复任务后：

- `issue-runtime.yaml`
  - 应更新为 `upgraded`
- `remediation_task_ref`
  - 应写入目标任务引用
- `current-task.yaml -> diagnostics.upgrade_target`
  - 应反映已升级为 `remediation-task`

但 V1 不要求：

- diagnostics runtime 自动切换为完整任务流 runtime

升级后应由正式任务流重新接管。

## 9. 与 blocked 的关系

diagnostics runtime 与 blocked 不应混为一层，但可以相互引用。

例如：

- 某任务因为 diagnostics 未完成而 blocked

此时：

- blocked 仍写在 phase / batch / task 状态层
- diagnostics runtime 负责补充：
  - 当前 blocked 与哪个 issue 相关
  - 当前是否等待 collect / analyze 结果

所以：

- blocked 是主流程状态
- diagnostics 是支撑 blocked 判定的侧向子系统状态

## 10. 与 events.log 的关系

V1 建议 diagnostics runtime 的关键切换仍应写事件。

推荐至少可表达：

- `diagnostics_collect_started`
- `diagnostics_collect_completed`
- `diagnostics_analysis_started`
- `diagnostics_analysis_completed`
- `diagnostics_issue_upgraded`

也就是说：

- `current-task.yaml`
  - 表达当前状态
- `issue-runtime.yaml`
  - 表达当前 issue 状态
- `events.log`
  - 表达状态变化轨迹

## 11. 当前阶段明确不包含

V1 明确不包含：

- 多 issue 并发运行态调度
- diagnostics 队列系统
- issue 看板系统
- 自动优先级评分
- issue-runtime 与任务 runtime 的自动双向同步引擎

## 12. 总结

Harness diagnostics runtime / issue runtime 模型 V1 的核心结论是：

- diagnostics 子系统需要运行态表达，不能只有静态目录和结论文档
- diagnostics runtime 优先挂在 `current-task.yaml` 的 `diagnostics` 字段组
- 单个 issue 的运行态应独立承接为：
  - `/.harness-diagnostics/issues/<issue-id>/issue-runtime.yaml`
- `issue.md`、`diagnostic-report.md`、`issue-runtime.yaml`、`current-task.yaml.diagnostics`、`events.log` 分别承接：
  - 问题入口
  - 诊断结论
  - issue 当前状态
  - 任务视角 diagnostics 状态
  - 变化轨迹
- 当前阶段先做最小运行态模型，不进入完整 diagnostics 平台复杂度
