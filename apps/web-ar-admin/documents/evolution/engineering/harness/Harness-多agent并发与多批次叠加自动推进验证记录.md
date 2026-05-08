---
title: Harness 多agent并发与多批次叠加自动推进验证记录
type: evolution
status: stable
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
---

# Harness 多agent并发与多批次叠加自动推进验证记录

## 1. 目标

验证当前 Harness 在“多 agent 并发 + 多批次复杂任务”叠加场景下，是否仍然具备：

- `开始执行` 前完成协作方式锁定、批次结构确认与文件边界确认
- `开始执行` 后先把并发状态同步到 runtime
- 当前 / 下一任务持续自动切换
- 最后一个中任务完成后自动进入总收口
- 总收口后自动进入 `total-acceptance`
- 总收口后自动进入 `total-mr-ready`
- 不重新退回人工驱动

## 2. 验证样本

本次验证使用以下叠加样本：

- 任务：验证多 agent 并发与多批次叠加场景是否仍具备默认自动推进能力
- 类型：`docs+flow-validation`
- 风险：中等
- 叠加复杂性来源：
  - 同时存在主控 / 执行型子代理分工
  - 同时存在多批次推进
  - 需要并发状态同步与批次推进动作共同成立
  - 需要最后汇总到总收口与 `total-acceptance / total-mr-ready`

## 3. 任务结构

### 3.1 总任务

- 总任务：验证多 agent 并发与多批次叠加场景是否仍具备默认自动推进能力

### 3.2 中任务

本次样本拆为四个中任务：

1. 中任务 A：叠加样本拆分与边界确认
2. 中任务 B：并发推进第二批执行单元
3. 中任务 C：并发推进第三批执行单元
4. 中任务 D：并发推进最后一批并准备总收口

### 3.3 可提交单元

本次最小可提交单元为：

- 新增一份“多 agent 并发与多批次叠加”验证记录
- 更新工程演进目录入口
- 同步回写能力矩阵中的阶段性结论

## 4. 执行前确认项

本次样本在进入执行前，已明确：

- 总任务对象
- 四个中任务的顺序
- 当前任务与下一任务关系
- `agent_mode = multi-agent`
- 主控 / 执行型子代理职责
- 文件边界
- 总收口路径
- `total-acceptance / total-mr-ready` 路径

因此，本次样本允许进入“多 agent + 多批次叠加后默认自动推进”观察。

## 5. 主控 / 子代理分工

### 5.1 主控职责

主控负责：

- 前台响应
- 协作方式锁定
- 批次结构确认
- 文件边界确认
- 运行时状态汇总
- 最终收口与提交

### 5.2 执行型子代理职责

执行型子代理负责：

- 在既定文件边界内推进当前批次产物
- 不越过主控边界擅自扩展改动面
- 在并发执行中保持写入范围清晰

## 6. 实际观察

本次真实观察点为：

1. 完成任务卡、边界、计划
2. 明确 `agent_mode`、批次结构与文件边界
3. 收到 `开始执行`
4. 使用真实 runtime 动作验证叠加链路：
   - `pnpm harness:runtime sync-multi-agent --payload-file /tmp/harness-combo-sync.json`
   - `pnpm harness:runtime advance-batch --payload-file /tmp/harness-combo-advance-1.json`
   - `pnpm harness:runtime advance-batch --payload-file /tmp/harness-combo-advance-2.json`
   - `pnpm harness:runtime close-batch --payload-file /tmp/harness-combo-close.json`
   - `pnpm harness:runtime accept-total --payload-file /tmp/harness-combo-accept.json`
   - `pnpm harness:runtime ready-total-mr --payload-file /tmp/harness-combo-ready.json`
5. 观察以下 runtime 文件是否连续反映叠加链路：
   - `current-batch.yaml`
   - `current-task.yaml`
   - `manual-validation.yaml`
   - `events.log`
6. 观察系统是否在 `开始执行` 后仍需额外等待：
   - `继续`
   - `提交结果`
   - `add commit push`

## 7. 关键证据

本次真实 runtime 证据包括：

- `events.log` 中连续出现：
  - `multi_agent_sync`
  - 两次 `batch_task_advanced`
  - `batch_closure_entered`
  - `total_acceptance_completed`
  - `total_mr_ready`
- `current-batch.yaml` 中：
  - `task_order` 长度为 4
  - `summary.completed = 4`
  - `current_stage = closing`
- `current-task.yaml` 中：
  - 当前仍保留叠加场景的总任务上下文
  - `current_stage = total_mr`
  - `closure.total_acceptance_status = completed`
  - `closure.total_mr_status = ready`
- `manual-validation.yaml` 中：
  - 已承接叠加场景下的总 MR 准备结论

## 8. 结论

基于本次叠加样本，当前 Harness 的阶段性结论为：

- 对“已完成拆分确认、批次结构确认、协作方式锁定和文件边界确认的多 agent + 多批次复杂任务”：
  - `已基本具备默认自动推进能力`

这说明当前结论已经不应再停留在：

- “多 agent 并发复杂任务已基本具备”
- “多批次复杂任务已基本具备”

而应进一步升级为：

- “多 agent 并发与多批次叠加场景，在可控规模下也已基本具备默认自动推进能力”

## 9. 当前已具备能力

- 主控 / 执行型子代理状态可先行同步到 runtime
- 在并发状态已进入 runtime 的前提下，批次仍可继续自动推进
- 当前 / 下一任务切换不会因为并发状态而中断
- 最后一个中任务完成后仍可自动进入总收口
- 总收口后仍可自动进入：
  - `total-acceptance`
  - `total-mr-ready`

## 10. 仍需继续验证的部分

当前仍未被本次样本完全覆盖的部分包括：

- 更大规模多 agent 并发与更长批次链路叠加时的稳定性
- 叠加场景下若存在 blocked 任务时的自动推进稳定性
- `total-mr-ready` 之后的下一步总 MR / 发布前动作

因此，本轮结论仍不应扩大为：

- 任意规模叠加场景已完全闭环

而应表述为：

- `多 agent 并发与多批次叠加场景在可控规模下已基本具备默认自动推进能力`
- `更大规模、更强阻塞、更长发布链路仍需继续验证`
