---
title: Harness 任务卡模板（最小版）
type: design
status: draft
author: cole
owner: cole
created: 2026-03-30
updated: 2026-03-31
---

# Harness 任务卡模板（最小版）

## 1. 用途

本模板用于在执行前统一描述一个任务单元，确保任务具备：

- 类型
- 边界
- 完成定义
- 最小验证

当前阶段只保留最小字段，不扩展为完整任务平台模型。

当前阶段，所有进入正式流程的任务都应先形成任务卡。  
为避免简单任务写重，任务卡分为：

- 轻量任务卡
- 完整任务卡

其中：

- 轻量任务卡适用于清晰文档任务、小型 bugfix、`docs-only` 和边界清楚的小改动
- 完整任务卡适用于架构任务、复杂任务、高风险任务和多阶段任务

## 2. 模板

```yaml
task_id: HN-YYYYMMDD-001
title: 任务标题
task_type: business-feature | bugfix | core-architecture | docs-only
commit_type: feat | fix | docs | refactor | test | chore
verification_level: quick | standard | high-risk
current_stage: intake | classify | boundary | approval | plan | execute | verify | review-ready
agent_mode: single-agent | multi-agent | 分析中

agent_split_reason:
  - 为什么采用当前协作方式

completed_items:
  - 已完成项

current_blocker:
  - 当前阻塞

next_step:
  - 下一步动作

goal:
  - 本次任务目标

not_in_scope:
  - 本次不包含

allowed_files:
  - 允许修改的文件或目录

forbidden_files:
  - 禁止修改的文件或目录

deliverables:
  - 本次至少要交付什么

evidence:
  - command_output
  - test_result
  - manual_regression
  - doc_check
  - known_risk_note

known_risks:
  - 当前已知风险或未覆盖项

agent_split_plan:
  - 子任务拆分与文件边界
```

## 2.1 轻量任务卡最小字段

当任务边界清楚、风险较低时，至少应保留以下字段：

```yaml
title: 任务标题
task_type: docs-only | bugfix | business-feature
verification_level: quick | standard
current_stage: intake | classify | boundary | approval | plan | execute | verify | review-ready
agent_mode: single-agent | multi-agent | 分析中

goal:
  - 本次任务目标

not_in_scope:
  - 本次不包含

next_step:
  - 下一步动作
```

轻量任务卡只要求先把任务对象固定下来，不要求一次写全完整字段。

## 3. 字段说明

### 3.1 `task_id`

任务编号。当前阶段可用轻量编号，后续若进入平台化，再统一编号策略。

### 3.2 `task_type`

当前仅允许以下 4 类：

- `business-feature`
- `bugfix`
- `core-architecture`
- `docs-only`

### 3.3 `commit_type`

用于标识提交语义，继续沿用现有 commit 体系，不把 commit 视为任务本身。

### 3.4 `verification_level`

定义本次任务完成前至少需要达到的验证层级：

- `quick`
- `standard`
- `high-risk`

### 3.5 `deliverables`

说明本次任务至少要交付什么。  
例如代码、文档、测试、风险说明等。

### 3.6 `evidence`

说明执行后需要提供的最小证据。当前阶段优先使用以下最小类型：

- `command_output`
- `test_result`
- `manual_regression`
- `doc_check`
- `known_risk_note`

若使用 `manual_regression`，当前阶段至少应能说明：

- 验证场景
- 预期信息或行为
- 实际结果
- 是否存在越界行为
- 最终结论

### 3.7 `current_stage`

用于表示当前任务所处阶段，便于在中途中断后快速接续。

### 3.8 `completed_items`

用于记录当前已经明确完成的事项，不要求写成完整任务日志。

### 3.9 `current_blocker`

用于记录当前最主要的阻塞点。若无阻塞，可留空。

### 3.10 `next_step`

用于记录当前任务接下来最明确的一步动作，帮助后续快速恢复上下文。

### 3.11 `agent_mode`

用于说明当前任务采用的协作方式。

当前仅允许：

- `single-agent`
- `multi-agent`
- `分析中`

任务卡阶段若信息不足，可先写为 `分析中`，或在轻量展示中临时隐藏；但在进入实际执行前必须明确为 `single-agent` 或 `multi-agent`。

### 3.12 `agent_split_reason`

用于说明为什么采用当前协作方式。

例如：

- 文件边界高度重叠，不适合拆分
- 可并发盘点和实施，适合多 agent

若当前仍为 `分析中`，也应至少说明：

- 为什么当前还不能最终判断
- 计划在哪个阶段完成判断

### 3.13 `agent_split_plan`

当 `agent_mode` 为 `multi-agent` 时，应说明：

- 如何拆分子任务
- 文件边界如何划分
- 哪些文件由主代理统一收口

## 4. 任务卡使用顺序

当前阶段默认顺序为：

1. 先形成任务卡
2. 再生成边界
3. 再生成计划
4. 再进入执行

简单任务可使用轻量任务卡，复杂任务使用完整任务卡，但两类任务都不应跳过任务卡阶段。

若任务可能涉及多 agent，任务卡阶段可先标记为 `分析中`；但在生成计划时必须明确说明当前是否可以使用多 agent，并在 `开始执行` 前把最终结果回填到任务卡。

## 5. 使用原则

- 任务单是交付单元，不等同于 commit
- 一个任务可以对应多个 commit
- 没有验证证据，不应视为完成
- 后续若验证该模板稳定可用，再考虑上升为正式标准
