---
title: Harness diagnostics collect / analyze 动作合同 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: diagnostics-intake-v1, diagnostics-directory-and-issue-file-model-v1, runtime-and-config-schema-v1, phase-hook-plugin-contract-v1
---

# Harness diagnostics collect / analyze 动作合同 V1

## 1. 目标

本文档用于把 Harness diagnostics V1 中已经提出的两个最小动作：

- `collect-diagnostics`
- `analyze-diagnostics`

继续收敛成动作级合同，明确：

- 每个动作的目标是什么
- 每个动作读什么、写什么
- 每个动作的输入和输出是什么
- 哪些对象必须生成
- 失败时如何处理
- 如何从 diagnostics 动作过渡到议题与修复任务建议

本文档回答的问题是：

- `collect-diagnostics` 在 V1 中到底负责什么
- `analyze-diagnostics` 在 V1 中到底负责什么
- 这两个动作与 issue 目录、evidence bundle、diagnostic report 如何衔接
- 这两个动作与 plugin 合同、runtime schema 和 config schema 如何对齐

## 2. 设计原则

### 2.1 先收集，再分析

V1 中必须坚持：

- 先固定问题现场
- 再做诊断分析

不允许把：

- 直接口头分析
- 即时聊天推断

当成正式 diagnostics 闭环。

### 2.2 动作保持轻量

V1 不把这两个动作设计成：

- 自动采集平台
- 自动修复平台
- 自动升级任务执行器

V1 只要求它们能够稳定承接：

- 文件复制
- 证据索引
- 诊断输出
- 升级建议

### 2.3 合同先于脚本

本文档定义的是动作合同，不等于脚本实现。

它回答的是：

- 动作应该承接什么对象
- 动作应该产出什么对象

而不是：

- 脚本用什么命令行参数
- 具体 shell / node 代码如何写

## 3. 动作在整体架构中的位置

这两个动作属于：

- `Feedback & Diagnostics Layer`

并建议由 `diagnostics-provider` 类型的 plugin 承接。

两者在整体链路中的位置如下：

1. 用户提交问题描述和相关文件
2. `collect-diagnostics`
3. `analyze-diagnostics`
4. 得到：
   - 继续保留为 issue
   - 升级为议题
   - 升级为 remediation task 建议

只有在明确升级为正式修复任务后，才重新进入主生命周期。

## 4. `collect-diagnostics` 动作合同

### 4.1 动作目标

`collect-diagnostics` 的目标是把一次问题现场从“分散输入”变成“稳定证据目录”。

它不做：

- 根因判断
- 修复建议
- 自动升级为正式任务

它只负责把现场固定下来。

### 4.2 输入合同

`collect-diagnostics` 最小输入应包括：

- `issue_id`
- 问题摘要
- 发生阶段
- 证据文件列表

可选输入包括：

- 补充说明
- 来源任务引用
- 来源 issue / 议题引用
- 截图或外部附件路径

### 4.3 读取对象

`collect-diagnostics` 可读取：

- 用户显式提供的文件
- `/.harness-runtime/*` 当前快照文件
- 用户提供的终端日志
- 用户提供的补充说明

V1 不要求它自动抓取任何外部系统数据。

### 4.4 写入对象

`collect-diagnostics` 至少应写入：

- `/.harness-diagnostics/issues/<issue-id>/issue.md`
- `/.harness-diagnostics/issues/<issue-id>/evidence/manifest.md`
- `/.harness-diagnostics/issues/<issue-id>/evidence/*`

条件性写入：

- `notes.md`

### 4.5 输出合同

`collect-diagnostics` 完成后，至少应形成：

- 一个稳定 issue 目录
- 一个最小 `Issue`
- 一个最小 `Evidence Bundle`

更具体地说，输出至少应能回答：

- 这个问题的 `issue_id` 是什么
- 实际收了哪些证据文件
- 每个证据从哪里复制而来
- 当前目录是否已满足进入 `analyze-diagnostics` 的最低条件

### 4.6 成功判定

`collect-diagnostics` 成功的最低条件是：

- `issue.md` 已创建
- `evidence/manifest.md` 已创建
- 至少一份核心证据已进入 `evidence/`

### 4.7 失败边界

以下情况视为失败或不完整：

- 没有 `issue_id`
- 没有问题摘要
- 没有任何证据文件
- issue 目录未创建成功
- evidence manifest 未形成

V1 失败时应输出：

- 缺失项
- 当前无法继续进入 `analyze-diagnostics` 的原因

而不是硬继续分析。

## 5. `analyze-diagnostics` 动作合同

### 5.1 动作目标

`analyze-diagnostics` 的目标是把一个已有 issue 目录，升级为可消费的诊断结论。

它不做：

- 自动修复执行
- 自动发起代码变更
- 自动进入 `开始执行`

它只负责输出：

- 诊断结论
- 初步归因
- 下一步建议

### 5.2 输入合同

`analyze-diagnostics` 的最小输入应包括：

- `issue_id`
- 已存在的 `issue.md`
- 已存在的 `evidence/manifest.md`
- 至少一份证据文件

可选输入包括：

- `notes.md`
- 额外补充证据
- 关联任务引用

### 5.3 读取对象

`analyze-diagnostics` 应读取：

- `issue.md`
- `evidence/manifest.md`
- `evidence/*`

必要时可读取：

- `notes.md`

### 5.4 写入对象

`analyze-diagnostics` 至少应写入：

- `diagnostic-report.md`

可选更新：

- 在 `issue.md` 中回写当前状态
- 在 `notes.md` 中补充分析过程

### 5.5 输出合同

`analyze-diagnostics` 完成后，至少应产出一个 `Diagnostic Report`，其最小字段建议包括：

- `issue_id`
- `summary`
- `affected_phase`
- `affected_objects`
- `evidence_files`
- `suspected_layer`
- `recommended_next_action`
- `upgrade_suggestion`

### 5.6 初步归因范围

V1 推荐最小归因范围为：

- `rule-gap`
- `runtime-gap`
- `plugin-gap`
- `method-misuse`
- `environment-issue`
- `blocked-recovery-gap`

### 5.7 升级建议范围

`upgrade_suggestion` 推荐只允许以下最小结果：

- `stay-as-issue`
- `upgrade-to-topic`
- `upgrade-to-remediation-task`

V1 不直接让 diagnostics 动作自动创建正式任务对象。

### 5.8 成功判定

`analyze-diagnostics` 成功的最低条件是：

- `diagnostic-report.md` 已创建
- 当前诊断摘要已形成
- 当前初步归因已形成
- 当前下一步建议已形成

### 5.9 失败边界

以下情况视为失败或不完整：

- 没有 `issue.md`
- 没有 `evidence/manifest.md`
- 没有任何证据文件
- 证据不足以形成最小诊断摘要

V1 失败时应明确输出：

- 当前证据不足
- 仍缺少哪些证据
- 当前不能稳定生成 `Diagnostic Report`

## 6. 两个动作的衔接合同

### 6.1 顺序固定

V1 中固定顺序为：

1. `collect-diagnostics`
2. `analyze-diagnostics`

不允许反过来。

### 6.2 交接对象

两者的交接对象应是 issue 目录本身。

也就是：

- `collect-diagnostics`
  - 负责创建 issue 目录和 evidence bundle
- `analyze-diagnostics`
  - 负责消费该目录并产出 diagnostic report

### 6.3 最小状态推进

建议 issue 在这两个动作中至少具备以下状态演进：

- `collected`
- `analyzed`

如果分析失败，可停在：

- `collected`
- 或 `analyze-incomplete`

V1 不要求完整状态机，但要求状态语义可读。

## 7. 与目录和文件模型的关系

这两个动作必须直接遵守：

- `diagnostics-directory-and-issue-file-model-v1.md`

具体映射如下：

- `collect-diagnostics`
  - 负责创建 `issue.md`
  - 负责创建 `evidence/manifest.md`
  - 负责复制 `evidence/*`
- `analyze-diagnostics`
  - 负责创建 `diagnostic-report.md`

`notes.md` 在两个动作中都可选。

## 8. 与 schema 的关系

### 8.1 与 runtime schema 的关系

diagnostics 动作可读取 runtime 文件作为证据，但不应把 diagnostics 目录本身混入 `/.harness-runtime/`。

也就是说：

- runtime 是证据来源
- diagnostics 是问题归档与诊断输出层

### 8.2 与 config schema 的关系

建议 `diagnostics` 配置块至少能影响：

- `enabled`
- `intake_mode`
- `diagnostics_root`
- `issue_directory_pattern`

动作合同必须与这些配置项兼容。

## 9. 与 plugin contract 的关系

这两个动作建议由 `diagnostics-provider` 类型 plugin 承接。

最小 plugin 合同建议至少声明：

- `plugin_id`
- `plugin_role = diagnostics-provider`
- `attached_phases`
- `reads`
- `writes`
- `failure_policy`

其中：

- `collect-diagnostics`
  - 更接近 diagnostics intake hook
- `analyze-diagnostics`
  - 更接近 diagnostics analysis hook

## 10. 与议题 / 修复任务的关系

V1 中：

- `collect-diagnostics`
  - 不负责升级
- `analyze-diagnostics`
  - 只负责给出升级建议

真正的升级动作应在后续对象层完成。

也就是：

- diagnostics 动作
  - 负责形成证据与判断
- topic / task 升级动作
  - 负责把判断转成正式对象

## 11. 当前阶段明确不包含

本次动作合同 V1 明确不包含：

- 自动收集外部日志
- 自动根因分析引擎
- 自动 remediation task 创建
- 自动修复执行
- diagnostics 动作自动回写能力矩阵

这些都应留到后续阶段，而不是压进 V1。

## 12. 总结

Harness diagnostics collect / analyze 动作合同 V1 可以压缩成一句：

它定义了 diagnostics 子系统中两个最小动作的输入、输出、读写对象和升级边界，使 Harness 能稳定完成“先固定问题现场，再生成诊断结论”的轻量闭环。

没有这层动作合同，diagnostics V1 仍然只有目录、文件和设计原则，而缺少可被 plugin、config 和后续脚本稳定消费的动作级锚点。
