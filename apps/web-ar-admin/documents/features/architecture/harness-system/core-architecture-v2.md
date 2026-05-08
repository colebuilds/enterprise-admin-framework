---
title: Harness 核心架构 V2 与问题诊断闭环 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_standards: FE-AI-004, FE-AI-005
---

# Harness 核心架构 V2 与问题诊断闭环 V1

## 1. 目标

本文档用于把 Harness 从当前的“规则驱动试运行系统”升级为更明确的：

- 生命周期内核
- 插件接入框架
- runtime 控制面
- 配置与策略层
- 问题文件收集与诊断闭环 V1

本文档回答的问题是：

- 当前 Harness 架构处于什么阶段
- V2 核心架构准备升级成什么形态
- 现有架构需要做哪些改造
- 生命周期、插件、配置、任务对象和方法层应如何分层
- 问题收集、日志回传、诊断与修复任务反哺如何进入系统主架构

## 2. 当前状态判断

### 2.1 当前不是“prompt 集合”，而是试运行中的流程系统

基于现有文档、runtime 动作和验证记录，Harness 当前已经具备：

- 任务对象模型
- runtime 控制面 V1
- skill 协议模型
- 自动推进规则
- 多批次、多 agent、blocked、版本治理等能力验证

因此，当前 Harness 已经不是零散 skill 的集合，而是一个：

- 规则可表达
- 动作可执行
- 结论可验证
- 能力可演进

的试运行流程系统。

### 2.2 当前架构的主要问题

当前架构方向是对的，但仍存在几个结构性问题：

- 生命周期阶段、人工控制口令和具体提交动作仍有混用
- 核心能力仍偏 `task-flow / orchestration / runtime-recording` 三个 skill 承接，尚未正式上升为 phase/hook/plugin contract
- `总任务 / 中任务 / 可提交单元` 这套对象名可用，但对外术语还不够平台化
- 任务域、工作项类型、提交语义和方法层尚未拆成独立维度
- 问题收集、日志分析和反哺修复仍未进入核心架构，只是方向已明确

## 3. V2 总体定位

Harness V2 的定位不应再是“自带某套固定 workflow 的 skill 集合”，而应是：

`AI 研发流程内核 + 生命周期协议层 + runtime 控制面 + 插件接入框架 + 问题诊断反馈闭环`

V2 的核心原则是：

- 核心负责生命周期和状态控制
- 插件负责阶段增强和场景能力
- runtime 负责最小控制面和恢复锚点
- 方法层负责场景化技巧，不进入内核
- 问题诊断层负责把真实使用中的问题反哺系统

## 4. V2 架构分层

### 4.1 Core Lifecycle Kernel

内核只负责以下稳定能力：

- phase 生命周期
- phase 进入 / 退出条件
- 自动推进策略
- blocked / resume 策略
- closure 终点判断
- runtime 上下文调度

内核不直接绑定：

- 某个具体 planning skill
- 某个具体 review skill
- 某个具体 debugging skill

### 4.2 Runtime Control Plane

runtime 继续承接最小控制面，但在 V2 中定位更明确：

- 承接当前 phase
- 承接当前 Task / Work Item / Execution Unit
- 承接当前 batch / blocked / closure 状态
- 承接 agent_mode 与并发状态
- 承接关键事件轨迹

runtime 仍不等于完整数据库或完整调度平台。

### 4.3 Plugin Contract Layer

所有接入 Harness 的 skill / plugin，后续都应通过统一合同接入。

插件合同至少声明：

- `plugin_id`
- `plugin_role`
- `attached_phases`
- `attached_hooks`
- `reads`
- `writes`
- `required | optional | replaceable`
- `failure_policy`

### 4.4 Strategy & Config Layer

V2 不应把默认策略写死在核心里，而应通过配置层承接：

- 生命周期默认配置
- 插件启用与顺序配置
- task domain 策略
- auto-advance 策略
- blocked / risk / review 策略
- runtime 写入范围配置

### 4.5 Method / Tactic Layer

如下能力不进入内核，而作为方法层存在：

- 浏览器调试
- 调试日志分析
- PRD 深读
- 参考项目对比
- 截图对比
- trace 排查

它们应被某些 plugin 在特定 phase 下调用，而不是成为生命周期对象。

### 4.6 Feedback & Diagnostics Layer

V2 新增正式子系统：

- 问题收集
- 文件级证据收集
- 日志分析
- 诊断报告
- 议题实例化
- 修复任务反哺

这一层不是外围功能，而是 Harness 自演进能力的一部分。

## 5. 生命周期模型 V2

### 5.1 标准 Phase

V2 推荐的标准 phase 为：

1. `requirement-analysis`
2. `boundary`
3. `planning`
4. `execution`
5. `verification`
6. `submission`
7. `closure`

这组 phase 属于系统生命周期，不等于用户口令。

### 5.2 控制口令不是 phase

以下对象属于控制动作，不属于 phase：

- `先分析`
- `生成边界`
- `生成计划`
- `开始执行`
- `停止执行`
- `提交结果`

其中：

- `开始执行` 是总授权点
- `提交结果` 是内部展示节点
- `add commit push` 属于提交动作，不是生命周期阶段

### 5.3 每个 phase 必须拥有合同

每个 phase 在 V2 至少必须定义：

- 进入条件
- 必要输入
- 必要输出
- 默认可挂载插件
- blocked 条件
- resume 条件
- 自动推进条件
- 退出条件

## 6. Hook 模型 V2

V2 应正式引入 hook，而不是只靠 skill 习惯协作。

建议最小 hook 集合：

- `before_phase`
- `enter_phase`
- `after_phase`
- `before_submit`
- `after_submit`
- `on_blocked`
- `on_unblocked`
- `before_closure`
- `after_closure`

若后续需要更细粒度 hook，再在此基础上演进，而不是一开始做成过重事件总线。

## 7. 对象模型 V2

### 7.1 对象层

V2 建议对外采用更稳定的对象术语：

- `Requirement`
- `Task`
- `Work Item`
- `Execution Unit`

建议对应当前模型的理解方式：

- 当前“总任务”更接近 `Task`
- 当前“中任务”更接近 `Work Item`
- 当前“可提交单元”更接近 `Execution Unit`

### 7.2 Work Item 可以包含分析型

`Work Item` 不是只承接实施任务，它可以是：

- `analysis`
- `execution`
- `validation`
- `closure`

这能解决“复杂任务必须先靠分析型中任务形成拆分依据”的问题。

### 7.3 独立的任务域维度

任务来源或任务领域不应混进对象本体，应独立为：

- `task_domain = harness-core`
- `task_domain = project-architecture`
- `task_domain = project-feature`
- `task_domain = project-bugfix`
- `task_domain = project-docs`
- `task_domain = governance`

这会直接影响：

- 风险等级
- 自动推进策略
- 版本治理判断
- 文档要求
- 验证要求

### 7.4 独立的提交语义维度

提交语义也不应混进对象本体，应独立为：

- `change_kind = feat`
- `change_kind = fix`
- `change_kind = docs`
- `change_kind = refactor`
- `change_kind = test`
- `change_kind = style`
- `change_kind = chore`

## 8. 插件接入模型 V2

### 8.1 核心思想

Harness 核心不绑定某一套固定 workflow skill。

优秀 skill 只要满足 V2 合同，就应允许接入。

### 8.2 插件角色

V2 推荐至少区分以下插件角色：

- `phase-owner`
- `phase-enhancer`
- `runtime-writer`
- `verifier`
- `closure-coordinator`
- `diagnostics-provider`

### 8.3 当前内置能力的映射建议

现有几个关键 skill 在 V2 中更适合作为：

- `harness-task-flow`
  - `phase-owner`
- `ai-subtask-orchestration`
  - `phase-enhancer`
- `harness-runtime-recording`
  - `runtime-writer`
- `document-governance`
  - `phase-enhancer` + `closure-coordinator`

V2 的目标不是废弃这些 skill，而是把它们从“核心内置规则”升级为“有正式合同的系统插件”。

## 9. 配置模型 V2

### 9.1 必须存在的三层配置

V2 至少应区分三层配置：

1. `kernel defaults`
2. `project harness config`
3. `task runtime overrides`

### 9.2 V2 最小配置对象

第一阶段建议只正式支持以下配置块：

- `lifecycle`
- `plugins`
- `task_strategy`
- `runtime`

### 9.3 当前阶段不急着做 package 配置平台

当前仍处于 in-repo incubation 阶段，应优先：

- 稳 phase 模型
- 稳 plugin contract
- 稳 runtime 表达
- 稳 diagnostics intake

而不是先做完整 npm package 化和大而全配置中心。

## 10. 问题诊断闭环 V1

### 10.1 定位

问题诊断闭环 V1 不是完整异常平台，而是最小问题收集与反哺机制。

V1 的目标是：

- 用户提供问题描述与相关文件
- Harness 收集相关文件
- Harness 基于这些文件分析
- Harness 生成议题或修复任务
- 后续反哺 Harness 本体

### 10.2 V1 输入方式

第一阶段不做复杂自动采集，只做文件复制式问题收集。

允许输入的最小证据包括：

- `.harness-runtime/current-task.yaml`
- `.harness-runtime/current-batch.yaml`
- `.harness-runtime/manual-validation.yaml`
- `.harness-runtime/events.log`
- 终端日志文本
- 用户补充说明
- 截图或 PRD 路径

### 10.3 V1 建议目录

建议引入最小诊断目录：

- `/.harness-diagnostics/issues/<issue-id>/`

其中可包含：

- `issue.md`
- `notes.md`
- `current-task.yaml`
- `current-batch.yaml`
- `manual-validation.yaml`
- `events.log`
- 其他用户提供的辅助文件

### 10.4 V1 最小动作

V1 只定义两个核心动作：

1. `collect-diagnostics`
   - 复制问题相关文件进入标准诊断目录
2. `analyze-diagnostics`
   - 基于已收集文件生成诊断结论

### 10.5 V1 输出对象

诊断分析的输出至少应包括：

- 问题摘要
- 受影响 phase / plugin / runtime 对象
- 初步归因
- 是否建议实例化为议题
- 是否建议升级为正式修复任务

### 10.6 V1 不包含

当前阶段明确不包含：

- 自动采集全量日志
- 自动监听运行过程
- 复杂 evidence bundle 平台
- 自动修复执行
- 完整根因分类引擎

## 11. 现有架构需要做的改造

V2 建议按以下顺序改造，而不是继续零散补规则：

1. 把 phase 和控制口令彻底拆开
2. 把对象层、任务域、提交语义、方法层拆成独立模型
3. 正式补 `Phase Contract`
4. 正式补 `Hook Model`
5. 正式补 `Plugin Contract`
6. 建立最小配置模型
7. 把问题文件收集与诊断闭环纳入核心架构
8. 等合同稳定后，再考虑 package-ready 抽离

## 12. 当前阶段判断

### 12.1 这是不是优秀架构方向

是。

因为它已经明显优于：

- skill 堆砌
- prompt workflow
- 纯人工驱动流程助手

并且方向上已经接近：

- 生命周期驱动
- runtime 控制面驱动
- 插件合同驱动
- 反馈闭环驱动

的 agent workflow 系统实践。

### 12.2 这是不是最终态最佳实践

还不是。

当前更准确的判断是：

- 这是一个方向正确、结构健康、已经明显优于普通 AI workflow 的优秀早期架构
- 但仍处于从“规则驱动系统”升级为“协议驱动内核”的关键阶段

## 13. 演进阶段模型

V2 建议正式承认 Harness 的演进阶段：

### 13.1 `in-repo incubation`

当前所在阶段：

- 仓库内孵化
- 高频验证
- 允许协议调整
- 可用性优先于包形态

### 13.2 `internal stable kernel`

下一阶段目标：

- phase 稳定
- hook 稳定
- plugin contract 稳定
- runtime contract 稳定

### 13.3 `package-ready`

只有到这一阶段，才应把 Harness 抽为独立 npm 包。

## 14. 当前阶段总结

Harness V2 可以压缩成一句话：

它不是某套固定 workflow 的 skill 包，而是一个以生命周期、插件合同、runtime 控制面和问题诊断反馈为核心的 AI 研发流程内核。

问题诊断闭环 V1 也可以压缩成一句话：

用户提供问题相关文件，Harness 收集并分析这些文件，再把分析结果反哺为议题或修复任务。
