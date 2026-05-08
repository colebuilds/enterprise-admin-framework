---
title: Harness diagnostics 目录与 issue 文件模型 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: diagnostics-intake-v1, terminology-and-object-model-v2, config-model-v1
---

# Harness diagnostics 目录与 issue 文件模型 V1

## 1. 目标

本文档用于把 `diagnostics-intake-v1` 继续细化到目录与文件层，明确：

- `/.harness-diagnostics/` 根目录如何组织
- `issues/<issue-id>/` 下最小应有哪些文件
- 每个文件承接什么信息
- 哪些文件是必须的，哪些是可选的
- `Issue / Evidence Bundle / Diagnostic Report / Remediation Task` 如何映射到文件层

本文档回答的问题是：

- diagnostics V1 为什么必须有独立目录模型
- 一个 issue 目录应如何最小组织
- 文件复制式 diagnostics intake 应该落到哪些文件
- 后续脚本、plugin 和人工排查应读取什么文件

## 2. 设计原则

### 2.1 保持 V1 轻量

V1 不设计成完整 issue 平台，也不引入数据库或复杂索引系统。

V1 只要求：

- 目录稳定
- 文件职责清楚
- 对象映射关系明确
- 后续脚本和 plugin 可稳定消费

### 2.2 文件优先

当前 diagnostics V1 的最小承接方式是：

- 用户提供问题描述
- 用户提供相关文件
- Harness 复制这些文件
- Harness 基于复制后的文件做分析

因此目录和文件模型必须优先支持“文件复制式 intake”。

### 2.3 目录是证据壳，不是任务系统

`/.harness-diagnostics/` 用来固定问题现场，不替代：

- 正式任务系统
- 批次系统
- 版本治理系统
- 完整发布或异常恢复平台

### 2.4 对象映射必须清楚

V1 必须把以下对象分开：

- `Issue`
- `Evidence Bundle`
- `Diagnostic Report`
- `Remediation Task`

否则后续容易继续把“问题对象”和“修复任务”混成一层。

## 3. diagnostics 根目录模型

### 3.1 根目录

V1 建议采用固定根目录：

- `/.harness-diagnostics/`

该目录属于 Harness diagnostics 子系统的独立运行目录，不与 `/.harness-runtime/` 混用。

### 3.2 根目录最小结构

V1 推荐最小结构如下：

```text
/.harness-diagnostics/
  issues/
```

当前阶段只强制定义 `issues/`，不额外引入：

- 全局索引文件
- 汇总数据库
- 自动聚合报表

若后续需要增加：

- `templates/`
- `archive/`
- `reports/`

应在后续版本单独扩展。

## 4. issue 目录模型

### 4.1 标准路径

每个问题目录建议使用：

- `/.harness-diagnostics/issues/<issue-id>/`

其中：

- `<issue-id>` 应是稳定且可读的唯一标识

### 4.2 issue-id 建议

V1 不强行规定复杂编号系统，建议满足：

- 可读
- 唯一
- 便于人工定位

推荐形态例如：

- `issue-20260402-runtime-blocked-resume`
- `issue-20260402-submit-auto-close`

当前阶段不要求额外自增序号服务。

## 5. issue 目录最小结构

V1 推荐最小结构如下：

```text
/.harness-diagnostics/issues/<issue-id>/
  issue.md
  diagnostic-report.md
  notes.md
  evidence/
    manifest.md
    current-task.yaml
    current-batch.yaml
    manual-validation.yaml
    events.log
    terminal.log
    attachments/
```

其中：

- `issue.md`
  - 必须
- `diagnostic-report.md`
  - 必须
- `notes.md`
  - 可选
- `evidence/manifest.md`
  - 必须
- `evidence/*`
  - 按问题实际情况存在

## 6. 必须文件模型

### 6.1 `issue.md`

`issue.md` 对应 `Issue` 对象，是问题对象的正式入口文件。

至少应包含：

- `issue_id`
- 标题
- 问题摘要
- 问题来源
- 发生阶段
- 当前状态
- 首次记录时间
- 提交人或来源说明
- 是否建议升级为任务

它回答的问题是：

- 出了什么问题
- 问题最初是如何进入 diagnostics 的
- 当前这是不是一个仍待处理的问题

### 6.2 `diagnostic-report.md`

`diagnostic-report.md` 对应 `Diagnostic Report` 对象，是诊断输出文件。

至少应包含：

- `issue_id`
- 诊断摘要
- 影响 phase
- 影响对象
- 证据文件引用
- 初步归因层
- 当前判断依据
- 建议下一步
- 是否建议升级为 remediation task

它回答的问题是：

- 当前对这个问题的系统判断是什么
- 问题更像规则缺口、runtime 缺口还是 plugin 缺口
- 是否已经足够升级为正式修复任务

### 6.3 `evidence/manifest.md`

`evidence/manifest.md` 对应 `Evidence Bundle` 的目录索引。

至少应包含：

- `issue_id`
- 本次证据清单
- 每个证据文件的原始来源路径
- 复制时间
- 文件用途说明
- 是否为必需证据或补充证据

它回答的问题是：

- 当前 diagnostics 实际收了哪些文件
- 这些文件从哪里来的
- 哪些文件是分析结论所依赖的核心证据

## 7. 可选文件模型

### 7.1 `notes.md`

`notes.md` 是分析过程中的临时分析笔记。

它可用于记录：

- 初步猜想
- 暂存判断
- 待确认点
- 尚未升级为正式诊断结论的推理过程

它不是正式结论文件，因此可选。

### 7.2 `evidence/current-task.yaml`

用于保存问题发生时的任务快照。

适合在以下问题中收集：

- phase 漂移
- 自动推进异常
- blocked 状态异常
- closure 状态异常

### 7.3 `evidence/current-batch.yaml`

用于保存问题发生时的批次快照。

适合在以下问题中收集：

- 当前 / 下一任务切换异常
- 批次 blocked / unblocked 异常
- 总收口切换异常

### 7.4 `evidence/manual-validation.yaml`

用于保存人工验证态或总收口验证态。

适合在以下问题中收集：

- total acceptance 异常
- total mr ready 异常
- closure 条件异常

### 7.5 `evidence/events.log`

用于保存关键事件轨迹。

它是多数 diagnostics 问题中的高价值证据，适合承接：

- blocked 进入 / 恢复
- 自动推进断点
- batch close
- total acceptance
- total mr ready

### 7.6 `evidence/terminal.log`

用于保存终端输出或命令执行日志。

适合承接：

- 脚本执行失败
- commit / push 流程异常
- diagnostics 动作异常

### 7.7 `evidence/attachments/`

用于放补充附件，例如：

- 截图
- PRD 片段
- 外部参考导出文件
- 手工复制的其他日志

V1 允许存在，但不强制要求。

## 8. 文件职责与必填性

### 8.1 必须文件

V1 中每个 issue 目录至少必须有：

- `issue.md`
- `diagnostic-report.md`
- `evidence/manifest.md`

原因是：

- 没有 `issue.md`，问题对象本身不成立
- 没有 `diagnostic-report.md`，诊断输出无法稳定沉淀
- 没有 `manifest.md`，证据来源无法追踪

### 8.2 条件性文件

以下文件应按问题实际需要存在：

- `evidence/current-task.yaml`
- `evidence/current-batch.yaml`
- `evidence/manual-validation.yaml`
- `evidence/events.log`
- `evidence/terminal.log`

### 8.3 可选文件

以下文件可选：

- `notes.md`
- `evidence/attachments/`

它们用于增强分析过程，但不构成 issue 成立的最低门槛。

## 9. 对象到文件的映射关系

### 9.1 `Issue -> issue.md`

`Issue` 对象在文件层由 `issue.md` 承接。

### 9.2 `Evidence Bundle -> evidence/ + manifest.md`

`Evidence Bundle` 不对应单个文件，而对应：

- `evidence/` 目录
- `evidence/manifest.md`

其中：

- 证据文件本体放在 `evidence/`
- 证据目录索引和来源说明放在 `manifest.md`

### 9.3 `Diagnostic Report -> diagnostic-report.md`

`Diagnostic Report` 在文件层由 `diagnostic-report.md` 承接。

### 9.4 `Remediation Task -> 外部映射，不内嵌任务对象`

V1 不要求在 issue 目录里完整复制正式任务对象。

更合理的做法是：

- 在 `diagnostic-report.md`
- 或 `issue.md`

中记录：

- 是否建议升级
- 已升级到哪个任务
- 任务编号或任务标题引用

也就是说：

`Remediation Task` 与 issue 目录保持“映射关系”，而不是“完整嵌入关系”。

## 10. 与 runtime 和任务流的关系

diagnostics 目录不是 runtime 目录的替代品。

两者关系应为：

- `/.harness-runtime/`
  - 承接当前运行态
- `/.harness-diagnostics/`
  - 固定某次问题现场和诊断证据

两者不应混写，也不应共用同一目录结构。

同样，diagnostics issue 不等于正式任务。

升级路径应为：

- `Issue`
- `Diagnostic Report`
- 判断是否升级
- 若升级，再进入正式 `Task`

## 11. V1 明确不包含

本次模型明确不包含：

- 全局 issue 数据库
- 自动 issue 编号服务
- 自动证据抓取平台
- 自动根因分析引擎
- 自动 remediation task 执行
- issue 与外部平台双向同步

这些都应留到后续版本，而不是压进 V1。

## 12. 总结

`Harness diagnostics` V1 的目录与文件模型应保持轻量：

- 一个 diagnostics 根目录
- 一个 issues 子目录
- 每个 issue 一个稳定目录
- 三个必须文件：
  - `issue.md`
  - `diagnostic-report.md`
  - `evidence/manifest.md`
- 若干按需复制的证据文件

这样才能在当前阶段支持：

- 文件复制式问题收集
- 基于证据的稳定分析
- 问题到修复任务的清晰升级路径

同时不把系统过早推向完整 issue 平台复杂度。
