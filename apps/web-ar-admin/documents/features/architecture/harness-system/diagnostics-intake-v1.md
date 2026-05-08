---
title: Harness 问题文件收集与诊断闭环 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: core-architecture-v2, config-model-v1, phase-hook-plugin-contract-v1
---

# Harness 问题文件收集与诊断闭环 V1

## 1. 目标

本文档用于定义 Harness 在当前阶段的最小问题收集与诊断闭环，使系统不只具备：

- 规则
- runtime
- 自动推进

还具备：

- 问题输入承接
- 文件级证据收集
- 基于收集文件的诊断分析
- 议题 / 修复任务反哺

本文档回答的问题是：

- 为什么 Harness 必须支持问题文件收集
- V1 最小闭环应收什么、不收什么
- 问题文件如何进入系统
- 收集后的诊断输出是什么
- 如何从问题收集过渡到议题和修复任务

## 2. 为什么必须做这个闭环

Harness 不是静态 workflow 包，而是在真实使用中持续验证、持续修正、持续演进的系统。

如果没有问题收集与诊断闭环，会出现：

- 问题只存在于聊天记忆中
- 日志与现象脱节
- 无法稳定复现
- 无法稳定归因到：
  - 规则层
  - runtime 层
  - plugin 层
  - blocked / 收口 / 自动推进策略层
- 修复无法稳定反哺能力矩阵和演进记录

因此，问题收集与诊断不是附属功能，而是 Harness 自演进能力的一部分。

## 3. V1 设计原则

### 3.1 第一阶段故意做轻

V1 不做：

- 自动采集全量日志
- 自动监听运行过程
- 完整异常恢复平台
- 自动修复执行
- 复杂 evidence bundle 平台

V1 只做：

- 用户提供问题描述
- 用户提供相关文件
- Harness 收集这些文件
- Harness 基于这些文件分析
- Harness 生成议题或修复任务建议

### 3.2 文件优先，不先做复杂日志平台

当前阶段最稳定的输入不是在线采集，而是“文件拷贝式诊断输入”。

这符合当前 Harness 所处阶段：

- `in-repo incubation`
- 可用性优先
- 不急于平台化

### 3.3 诊断闭环是任务流上游，不是任务流替代

问题收集链路应理解为：

- `issue intake`
- `diagnostics`
- `issue / topic upgrade`
- `remediation task`

只有在升级为正式修复任务后，才重新进入主生命周期：

- analysis
- boundary
- planning
- execution
- verification
- submission
- closure

## 4. V1 在整体架构中的位置

在 Harness V2 中，这一层属于：

- `Feedback & Diagnostics Layer`

它与其他层的关系是：

- Core Lifecycle
  - 不直接处理问题文件，但消费诊断升级后的正式任务
- Runtime Control Plane
  - 提供最重要的诊断输入来源
- Plugin Contract Layer
  - 允许 diagnostics-provider 角色接入
- Config Layer
  - 允许配置 diagnostics 是否启用、默认收哪些文件

## 5. V1 输入模型

### 5.1 最小输入对象

V1 的问题输入至少包含：

- 问题描述
- 问题发生阶段
- 相关文件列表
- 可选补充说明

### 5.2 推荐输入文件

当前阶段优先支持以下高价值文件：

- `.harness-runtime/current-task.yaml`
- `.harness-runtime/current-batch.yaml`
- `.harness-runtime/manual-validation.yaml`
- `.harness-runtime/events.log`
- 终端输出日志
- 用户补充说明文档
- 相关截图路径
- 相关 PRD 或参考资料路径

### 5.3 输入边界

V1 明确不强制支持：

- 外部平台自动抓取日志
- 浏览器自动导出 trace
- 自动打包整个工作区
- 自动采集所有运行上下文

原因是第一阶段目标不是“日志平台”，而是“最小可分析输入”。

## 6. V1 收集模型

### 6.1 最小目录建议

建议引入标准诊断目录：

- `/.harness-diagnostics/issues/<issue-id>/`

### 6.2 最小目录内容

每个 issue 目录建议至少包含：

- `issue.md`
- `notes.md`
- `current-task.yaml`
- `current-batch.yaml`
- `manual-validation.yaml`
- `events.log`
- 其他用户显式提供的附件

### 6.3 V1 收集动作

V1 最小只定义两个动作：

1. `collect-diagnostics`
   - 把用户指定文件复制到 issue 目录
2. `analyze-diagnostics`
   - 基于收集到的文件生成诊断结论

这里的“复制”是关键，因为当前阶段最稳的承接方式就是把问题现场固定下来。

## 7. V1 诊断分析模型

### 7.1 分析目标

分析的目标不是立刻自动修复，而是形成：

- 问题摘要
- 影响对象
- 初步归因
- 后续动作建议

### 7.2 初步归因维度

当前阶段至少支持归因到：

- `rule-gap`
- `runtime-gap`
- `plugin-gap`
- `method-misuse`
- `environment-issue`
- `blocked-recovery-gap`

### 7.3 诊断输出最小字段建议

诊断输出至少应包括：

- `issue_id`
- `summary`
- `affected_phase`
- `affected_objects`
- `evidence_files`
- `suspected_layer`
- `recommended_next_action`
- `upgrade_suggestion`

## 8. 与议题和修复任务的关系

### 8.1 Issue 不等于任务

V1 中：

- `Issue`
  - 是问题对象
- `Task`
  - 是正式执行对象

不能把所有问题输入直接视为正式任务。

### 8.2 V1 升级路径

建议路径如下：

1. 用户提交问题和文件
2. Harness 收集问题文件
3. Harness 生成诊断结论
4. 诊断结果判断：
   - 保持 issue
   - 升级为议题
   - 升级为正式修复任务

### 8.3 何时升级为正式修复任务

命中以下情况时，应建议升级：

- 根因方向已足够明确
- 修复边界已较清楚
- 问题具备后续可执行性
- 问题属于 Harness 自身协议、runtime、plugin、自动推进链路缺口

## 9. 与 runtime 的关系

### 9.1 runtime 是重要证据来源

在当前 Harness 体系里，最有价值的诊断输入本身就来自 runtime：

- 当前 phase
- 当前任务对象
- 当前批次对象
- blocked 状态
- 关键事件轨迹

因此 diagnostics V1 必须优先兼容 `.harness-runtime/*`。

### 9.2 diagnostics 不替代 runtime

diagnostics 只负责：

- 收集
- 固化
- 分析

它不替代 runtime 控制面本身。

## 10. 与插件合同的关系

V1 建议把 diagnostics 作为正式 plugin 角色保留：

- `plugin_role = diagnostics-provider`

它至少需要声明：

- `reads`
  - runtime 文件
  - 用户提供的问题文件
- `writes`
  - diagnostics 目录
  - diagnostic report
  - 议题 / 修复任务建议

这意味着 diagnostics 不再是“临时顺手分析”，而是可被正式接入的系统能力。

## 11. 与配置层的关系

问题诊断闭环 V1 需要被配置层承接。

最小需要考虑：

- 是否启用 diagnostics intake
- 默认允许收哪些文件
- diagnostics 目录放在哪里
- 哪些 `task_domain` 默认更适合启用 diagnostics

当前阶段可先不做完整配置文件实现，但设计上必须预留这层。

## 12. 当前阶段建议的落地顺序

V1 建议按以下顺序推进：

1. 先定义 diagnostics 目录与 issue 文件结构
2. 再定义最小收集动作
3. 再定义最小诊断输出结构
4. 再接入议题 / 修复任务升级路径
5. 后续才考虑是否做更复杂的自动采集和异常恢复平台

## 13. 当前阶段不包含

V1 明确不包含：

- 自动采集整个工作区
- 自动上传外部平台日志
- 自动根因识别引擎
- 自动修复执行
- 完整 issue 平台
- 完整异常恢复系统

## 14. 当前阶段总结

Harness 问题文件收集与诊断闭环 V1 可以压缩成一句：

用户把问题相关文件交给 Harness，Harness 把这些文件固定到标准诊断目录中，再基于这些文件分析问题，并把结果反哺为议题或修复任务。

V1 的目标不是把问题处理做复杂，而是先让：

- 问题可收集
- 证据可固定
- 诊断可复用
- 修复可反哺

从而让 Harness 真正具备持续自演进的基础闭环。
