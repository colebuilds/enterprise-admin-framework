---
title: Harness 多批次复杂任务完整自动推进验证记录
type: evolution
status: stable
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
---

# Harness 多批次复杂任务完整自动推进验证记录

## 1. 目标

验证当前 Harness 在多批次复杂任务场景下，是否已经具备：

- 总任务下多个中任务顺序推进
- 当前中任务完成后自动切到下一中任务
- 最后一个中任务完成后自动进入总收口
- 总收口后自动进入 `total-acceptance`
- 总收口后自动进入 `total-mr-ready`
- 在收到 `开始执行` 后不再逐阶段等待人工继续口令

## 2. 验证样本

本次验证直接使用以下任务作为样本：

- 任务：验证当前 Harness 是否已具备多批次复杂任务完整自动推进能力
- 类型：`docs+flow-validation`
- 风险：中等
- 复杂性来源：
  - 明确总任务下多个中任务
  - 明确当前 / 下一任务与批次顺序
  - 明确最后一个中任务完成后的总收口
  - 明确 `total-acceptance / total-mr-ready`

## 3. 批次结构

### 3.1 总任务

- 总任务：验证当前 Harness 是否已具备多批次复杂任务完整自动推进能力

### 3.2 中任务

本次最小完整多批次样本拆为三个中任务：

1. 中任务 A：形成完整多批次验证样本并确认批次结构
2. 中任务 B：验证当前中任务完成后自动切到下一中任务
3. 中任务 C：验证最后一个中任务完成后自动进入总收口，并继续推进到 `total-acceptance / total-mr-ready`

### 3.3 可提交单元

本次最小可提交单元为：

- 新增一份完整多批次复杂任务自动推进验证记录
- 更新工程演进目录入口

## 4. 批次确认结论

本次样本在进入执行前，已明确：

- 总任务对象
- 中任务顺序
- 当前中任务
- 下一中任务
- 最后一个中任务
- 总任务收口路径
- `total-acceptance / total-mr-ready` 收口路径

因此，本次样本允许进入“批次结构确认后默认自动推进”观察。

## 5. 实际观察

本次真实观察点为：

1. 完成任务卡、边界、计划
2. 明确批次顺序、当前任务与下一任务
3. 收到 `开始执行`
4. 使用真实 runtime 动作验证：
   - `pnpm harness:runtime advance-batch --payload-file .harness-runtime/examples/batch-advance-payload.example.json`
   - `pnpm harness:runtime close-batch --payload-file .harness-runtime/examples/batch-close-payload.example.json`
   - `pnpm harness:runtime accept-total --payload-file .harness-runtime/examples/total-acceptance-payload.example.json`
   - `pnpm harness:runtime ready-total-mr --payload-file .harness-runtime/examples/total-mr-ready-payload.example.json`
5. 观察以下 runtime 文件是否连续反映完整链路：
   - `current-batch.yaml`
   - `current-task.yaml`
   - `manual-validation.yaml`
   - `events.log`
6. 系统在展示提交范围后继续执行 `git add / commit / push`

## 6. 结论

基于本次完整多批次复杂任务样本，当前 Harness 的阶段性结论为：

- 对“已完成拆分确认并具备完整批次结构的最小多批次复杂任务”：
  - `已基本具备完整自动推进能力`

当前结论已经覆盖：

- 当前 / 下一任务自动切换
- 最后一个中任务完成后自动进入总收口
- 总收口后自动进入 `total-acceptance`
- 总收口后自动进入 `total-mr-ready`

## 7. 当前已具备能力

- 多批次任务可在 `current-batch.yaml` 中稳定表达当前 / 下一任务与 completed 列表
- 当前中任务完成后，可通过真实动作把 `next_task` 提升为新的 `current_task`
- 最后一个中任务完成后，可通过真实动作把批次推进到总收口视角
- 总收口后，可继续通过真实动作推进到：
  - `total-acceptance`
  - `total-mr-ready`
- 本次样本里，`开始执行` 后没有再额外等待：
  - `继续`
  - `提交结果`
  - `add commit push`

## 8. 仍需继续验证的部分

当前仍未被这次样本完全覆盖的部分包括：

- 多 agent 并发复杂任务下，完整多批次链路是否仍能稳定自动推进
- 更大规模批次下，是否仍能稳定避免错误跳批次或错误提前收口
- `total-mr-ready` 之后是否还需要继续补总 MR 提交前动作验证

因此，本轮结论不应扩大为“完整无人值守平台已完成”，而应表述为：

- `最小完整多批次复杂任务链路已基本打通`
- `更大规模与更高并发场景仍需继续验证`
