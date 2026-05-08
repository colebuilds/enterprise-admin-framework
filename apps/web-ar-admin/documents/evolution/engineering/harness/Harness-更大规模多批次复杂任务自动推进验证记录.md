---
title: Harness 更大规模多批次复杂任务自动推进验证记录
type: evolution
status: stable
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
---

# Harness 更大规模多批次复杂任务自动推进验证记录

## 1. 目标

验证当前 Harness 在“高于最小完整样本”的多批次复杂任务场景下，是否仍然具备：

- 更长 `task_order` 下的当前 / 下一任务自动切换
- 最后一个中任务完成后自动进入总收口
- 总收口后自动进入 `total-acceptance`
- 总收口后自动进入 `total-mr-ready`
- 在收到 `开始执行` 后不再重新退回人工驱动

## 2. 验证样本

本次验证使用以下样本：

- 任务：验证更大规模多批次复杂任务是否仍具备默认自动推进能力
- 类型：`docs+flow-validation`
- 风险：中等
- 样本升级点：
  - 中任务数量从最小完整样本的 3 个提升到 5 个
  - 当前 / 下一任务切换链路从 1 次提升到 3 次
  - 继续覆盖最后一个中任务完成后的总收口
  - 继续覆盖 `total-acceptance / total-mr-ready`

## 3. 批次结构

### 3.1 总任务

- 总任务：验证更大规模多批次复杂任务是否仍具备默认自动推进能力

### 3.2 中任务

本次更大规模样本拆为五个中任务：

1. 中任务 A：批次结构确认
2. 中任务 B：验证第二个中任务自动接续
3. 中任务 C：验证第三个中任务自动接续
4. 中任务 D：验证第四个中任务自动接续
5. 中任务 E：验证第五个中任务自动接续并准备总收口

### 3.3 可提交单元

本次最小可提交单元为：

- 新增一份更大规模多批次复杂任务自动推进验证记录
- 更新工程演进目录入口
- 同步回写能力矩阵中的阶段性结论

## 4. 批次确认结论

本次样本在进入执行前，已明确：

- 总任务对象
- 五个中任务的顺序
- 当前任务与下一任务关系
- 最后一个中任务
- 总收口路径
- `total-acceptance / total-mr-ready` 路径

因此，本次样本允许进入“更长多批次链路默认自动推进”观察。

## 5. 实际观察

本次真实观察点为：

1. 完成任务卡、边界、计划
2. 明确五个中任务的顺序与当前 / 下一任务关系
3. 收到 `开始执行`
4. 使用真实 runtime 动作验证更长链路：
   - `pnpm harness:runtime advance-batch --payload-file /tmp/harness-large-advance-1.json`
   - `pnpm harness:runtime advance-batch --payload-file /tmp/harness-large-advance-2.json`
   - `pnpm harness:runtime advance-batch --payload-file /tmp/harness-large-advance-3.json`
   - `pnpm harness:runtime close-batch --payload-file /tmp/harness-large-close.json`
   - `pnpm harness:runtime accept-total --payload-file /tmp/harness-large-accept.json`
   - `pnpm harness:runtime ready-total-mr --payload-file /tmp/harness-large-ready.json`
5. 观察以下 runtime 文件是否连续反映完整链路：
   - `current-batch.yaml`
   - `current-task.yaml`
   - `manual-validation.yaml`
   - `events.log`
6. 观察系统是否在 `开始执行` 后仍需额外等待：
   - `继续`
   - `提交结果`
   - `add commit push`

## 6. 关键证据

本次真实 runtime 证据包括：

- `events.log` 中连续出现三次 `batch_task_advanced`
- 随后出现一次 `batch_closure_entered`
- 随后出现：
  - `total_acceptance_completed`
  - `total_mr_ready`
- `current-batch.yaml` 中：
  - `task_order` 长度为 5
  - `summary.completed = 5`
  - `current_stage = closing`
- `current-task.yaml` 中：
  - `current_stage = total_mr`
  - `closure.total_acceptance_status = completed`
  - `closure.total_mr_status = ready`
- `manual-validation.yaml` 中：
  - 已承接更长链路下的总 MR 准备结论

## 7. 结论

基于本次更大规模多批次样本，当前 Harness 的阶段性结论为：

- 对“已完成拆分确认并具备更长批次结构的多批次复杂任务”：
  - `已基本具备默认自动推进能力`

这说明当前结论已经不应再只停留在：

- “最小完整多批次复杂任务已基本具备”

而应升级为：

- “更大规模但仍可控的多批次复杂任务也已基本具备默认自动推进能力”

## 8. 当前已具备能力

- 更长 `task_order` 下，当前 / 下一任务可连续自动切换
- 最后一个中任务完成后，可真实自动进入总收口
- 总收口后，可真实自动进入：
  - `total-acceptance`
  - `total-mr-ready`
- 这条更长链路在本次样本中未重新退回到逐步人工驱动

## 9. 仍需继续验证的部分

当前仍未被本次样本完全覆盖的部分包括：

- 更大规模多批次与多 agent 并发叠加场景
- 更长链路下若存在 blocked 任务时的自动推进稳定性
- `total-mr-ready` 之后的下一步总 MR / 发布前动作

因此，本轮结论仍不应扩大为：

- 任意规模多批次复杂任务已完全闭环

而应表述为：

- `更大规模但仍可控的多批次复杂任务已基本具备默认自动推进能力`
- `更高并发、更强阻塞、更长发布链路仍需继续验证`
