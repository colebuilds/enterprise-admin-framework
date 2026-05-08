---
title: Harness diagnostics collect/analyze 最小实现计划 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: diagnostics-intake-v1, diagnostics-directory-and-issue-file-model-v1, diagnostics-collect-analyze-contract-v1, diagnostics-runtime-and-issue-runtime-model-v1, diagnostics-upgrade-to-remediation-task-rules-v1
---

# Harness diagnostics collect/analyze 最小实现计划 V1

## 1. 目标

本文档用于把 Harness diagnostics 子系统从：

- 架构合同
- 目录模型
- runtime 模型
- 升级规则

继续推进到“可直接进入实现”的最小计划层，明确：

- 第一版到底实现什么
- 实现应改哪些文件
- 动作顺序是什么
- 最小验证怎么做
- 哪些内容明确暂不进入 V1

## 2. 实现目标

V1 最小实现目标只覆盖两件事：

1. `collect-diagnostics`
   - 能把用户指定的 diagnostics 输入收进标准 issue 目录
2. `analyze-diagnostics`
   - 能基于 issue 目录中的证据生成最小诊断报告与升级建议

V1 实现完成后，至少应能支持：

- 输入 issue_id、问题摘要、证据文件列表
- 创建 `/.harness-diagnostics/issues/<issue-id>/`
- 创建：
  - `issue.md`
  - `evidence/manifest.md`
  - `issue-runtime.yaml`
- 复制指定证据文件到 `evidence/`
- 基于已收集证据生成：
  - `diagnostic-report.md`
- 在 runtime 侧最小回写：
  - `current-task.yaml -> diagnostics`

## 3. 第一版明确不做

V1 明确不做：

- 自动扫描整个工作区找证据
- 自动抓取浏览器 trace
- 自动拉取外部平台日志
- 多 issue 并发处理
- 自动创建 remediation task
- 自动执行修复
- 复杂诊断评分模型

## 4. 最小实现范围

### 4.1 目录与文件

第一版至少应真实创建并写入：

- `/.harness-diagnostics/issues/<issue-id>/issue.md`
- `/.harness-diagnostics/issues/<issue-id>/issue-runtime.yaml`
- `/.harness-diagnostics/issues/<issue-id>/evidence/manifest.md`
- `/.harness-diagnostics/issues/<issue-id>/evidence/*`
- `/.harness-diagnostics/issues/<issue-id>/diagnostic-report.md`

### 4.2 运行态回写

第一版建议最小回写：

- `/.harness-runtime/current-task.yaml`

中的：

- `diagnostics.enabled`
- `diagnostics.active_issue_id`
- `diagnostics.status`
- `diagnostics.current_action`
- `diagnostics.upgrade_target`

### 4.3 事件记录

第一版建议最小写入：

- `/.harness-runtime/events.log`

至少记录：

- `diagnostics_collect_started`
- `diagnostics_collect_completed`
- `diagnostics_analysis_started`
- `diagnostics_analysis_completed`

## 5. 建议涉及文件

V1 最小实现建议优先涉及：

- [scripts/harness-runtime.mjs](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/scripts/harness-runtime.mjs)
- [.harness-runtime/README.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/.harness-runtime/README.md)
- [skills/harness-runtime-recording/SKILL.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/skills/harness-runtime-recording/SKILL.md)

若需要为 diagnostics 增加独立入口，可考虑后续引入：

- `scripts/harness-diagnostics.cjs`

但 V1 第一优先级不是新拆脚本，而是先让动作能跑通。

## 6. 动作设计建议

### 6.1 `collect-diagnostics`

推荐输入：

- `--issue-id`
- `--summary`
- `--phase`
- `--file <path>` 可重复
- `--note <path>` 可选

推荐行为：

1. 创建 issue 目录
2. 创建 `issue.md`
3. 创建 `issue-runtime.yaml`
4. 创建 `evidence/manifest.md`
5. 复制证据文件到 `evidence/`
6. 更新 `current-task.yaml -> diagnostics`
7. 追加 `events.log`

### 6.2 `analyze-diagnostics`

推荐输入：

- `--issue-id`

可选输入：

- `--suspected-layer`
- `--next-action`
- `--upgrade-decision`

推荐行为：

1. 读取 issue 目录
2. 校验 `issue.md` 与 `evidence/manifest.md`
3. 生成 `diagnostic-report.md`
4. 更新 `issue-runtime.yaml`
5. 更新 `current-task.yaml -> diagnostics`
6. 追加 `events.log`

## 7. 最小实现顺序

建议按以下顺序实现：

1. 补 diagnostics 目录创建与 issue_id 路径规则
2. 补 `collect-diagnostics`
   - 先只支持文件复制与最小 runtime 写入
3. 补 `analyze-diagnostics`
   - 先只支持生成最小报告与升级建议
4. 补 README 与 skill 说明
5. 补最小 payload / 调用样例
6. 做一次真实验证

## 8. 最小验证样例

建议至少准备两组样例：

### 8.1 collect 样例

输入：

- 一个 issue_id
- 一个 summary
- 一到两个 runtime 文件

验证：

- issue 目录创建成功
- `issue.md`
- `issue-runtime.yaml`
- `evidence/manifest.md`
- 证据文件复制成功
- runtime diagnostics 字段已更新

### 8.2 analyze 样例

基于已存在 issue 目录，验证：

- `diagnostic-report.md` 创建成功
- `issue-runtime.yaml` 状态更新为已分析
- `current-task.yaml -> diagnostics.status` 更新为 `completed`
- `events.log` 已追加分析完成事件

## 9. 第一版建议的成功标准

V1 实现完成后，应至少能稳定回答：

- 用户给出问题文件后，系统能否形成标准 issue 目录
- diagnostics 当前运行态能否进入 `current-task.yaml`
- 单个 issue 的运行态能否进入 `issue-runtime.yaml`
- 分析后能否生成最小诊断报告
- 分析后能否明确给出：
  - 保持 issue
  - 升级议题
  - 升级 remediation task 的建议

## 10. 与后续任务的边界

V1 完成后，下一个自然阶段才是：

- diagnostics 到 remediation task 的对象升级实现

而不是在这一版里直接补：

- 自动生成正式任务卡
- 自动开始执行 remediation task

## 11. 总结

Harness diagnostics collect/analyze 最小实现计划 V1 的核心结论是：

- 第一版只做：
  - collect
  - analyze两个动作的最小真实落地
- 第一版的核心输出是：
  - 标准 issue 目录
  - issue runtime
  - diagnostic report
  - current-task 中的 diagnostics 运行态
- 第一版优先改：
  - 现有 runtime 写入入口
  - README
  - runtime-recording 说明
- 第一版先做可运行、可验证、可升级建议，不进入自动修复和自动升级执行
