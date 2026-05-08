---
title: Harness 更强 blocked 场景自动推进验证记录
type: evolution
status: stable
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
---

# Harness 更强 blocked 场景自动推进验证记录

## 1. 目标

验证当前 Harness 在更强 blocked / 阻塞场景下，是否已经具备稳定的默认自动推进能力，也就是：

- 该停时能停
- blocked 状态能被正确记录
- 不会误推进到下一任务、总收口或提交
- 解除阻塞后是否已有明确恢复路径

## 2. 验证样本

本次样本采用一个可控 blocked 场景：

- 当前总任务已形成批次结构
- 当前中任务在执行中命中明确阻塞
- 该阻塞会影响：
  - 当前中任务继续推进
  - 下一中任务切换
  - 后续总收口判断

blocked 原因采用当前体系内最典型的可解释类型：

- 等待人工确认边界或关键输入

原因：

- 这类阻塞在当前 Harness 中已有明确规则语义
- 不会引入业务实现噪音
- 可以直接观察 runtime 是否有最小 blocked 承接能力

## 3. 实际检查

### 3.1 批次模型是否承接 blocked

当前 `.harness-runtime/current-batch.yaml` 与模板结构已经承接：

- `blocked_tasks`
- `summary.blocked`

模板中还能表达：

- 被阻塞的 `subtask_id`
- 阻塞标题
- `status = blocked`
- `blocker`

这说明：

- blocked 在批次层已经具备最小建模能力

### 3.2 编排层是否承接 blocked

`skills/ai-subtask-orchestration/SKILL.md` 已明确：

- 主控应判断哪些任务属于 blocked
- blocked 任务应进入批次视图
- 当前 / 下一任务关系未明确时不得继续推进执行

这说明：

- blocked 在编排规则层已有明确语义

### 3.3 runtime 是否具备独立 blocked 动作

检查 `scripts/harness-runtime.mjs` 后，当前真实动作入口包括：

- `checkpoint ...`
- `advance-batch`
- `close-batch`
- `enter-blocked`
- `resolve-blocked`
- `accept-total`
- `ready-total-mr`
- `sync-multi-agent`

这说明：

- 当前 blocked 已经具备与批次推进、总收口推进同级的独立真实动作入口

### 3.4 自动推进是否能稳定“该停时停”

基于现有规则，可以明确的是：

- blocked 一旦形成，编排层和批次层应把该任务标记为 blocked
- blocked 后不应继续自动切下一任务
- blocked 后不应继续自动进入总收口或提交

本次进一步做了两次真实写入验证：

- `pnpm harness:runtime enter-blocked --payload-file .harness-runtime/examples/enter-blocked-payload.example.json`
- `pnpm harness:runtime resolve-blocked --payload-file .harness-runtime/examples/resolve-blocked-payload.example.json`

验证结果：

- `current-batch.yaml` 已能在 blocked 与恢复之间切换
- `current-task.yaml` 已能在 `current_blocker` 与恢复后状态之间切换
- `events.log` 已追加：
  - `task_blocked`
  - `task_unblocked`

这说明：

- blocked 进入与恢复的最小真实动作闭环已经打通

## 4. 验证结论

本次验证结论是：

- 当前 Harness 对更强 blocked / 阻塞场景可升级为 `已基本具备默认自动推进能力`

## 5. 已证明的部分

当前已证明：

- blocked 在批次层可被建模
- blocked 在编排层可被判定
- 当前 / 下一任务与 blocked 任务可被统一查看
- 当前规则语义已经明确：
  - blocked 后不应误继续自动推进
- blocked 进入已具备独立 runtime 动作
- blocked 恢复已具备独立 runtime 动作
- blocked 切换历史已可进入 `events.log`

## 6. 尚未打通的部分

当前尚未被同等强度证明的是：

- blocked 恢复后更长链路下的持续自动推进验证
- blocked 与更大规模并发、多批次叠加场景下的恢复稳定性验证

## 7. 对当前能力矩阵的影响

本次验证说明：

- blocked 不是完全空白
- 但也不能被表述为“已基本具备完整 blocked 恢复闭环”

更准确的当前结论应升级为：

- blocked 场景：
  - `已基本具备`

## 8. 结论摘要

当前 Harness 在 blocked 场景下已经具备：

- 规则层承接
- 批次层建模
- 最小可见性

但仍未被证明到“完全闭环”的部分是：

- blocked 恢复后更长链路下的持续自动推进稳定性

因此，该能力当前应停留在：

- `已基本具备默认自动推进能力`
