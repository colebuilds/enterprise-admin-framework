---
title: Harness total-mr-ready 后续动作验证记录
type: evolution
status: stable
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
---

# Harness total-mr-ready 后续动作验证记录

## 1. 目标

验证当前 Harness 在总收口已经推进到 `total-mr-ready` 之后，是否还存在默认自动推进的下一步动作，还是应把 `total-mr-ready` 明确视为当前阶段的收口终点。

## 2. 验证范围

本次验证不讨论完整发布流水线，也不讨论真实 MR 平台集成，只验证当前 Harness 现有规则、runtime 动作和样例载体下的真实语义。

重点检查：

- `scripts/harness-runtime.mjs` 是否存在 `total-mr-ready` 之后的真实动作入口
- `.harness-runtime/examples/*` 是否存在 `total-mr-ready` 之后的样例
- 当前总收口模型是否把 `total-mr-ready` 定义为当前阶段的最终准备态

## 3. 实际检查

### 3.1 runtime 动作入口

当前 `scripts/harness-runtime.mjs` 已实现的总收口相关动作是：

- `close-batch`
- `accept-total`
- `ready-total-mr`

其中：

- `accept-total` 将状态推进到 `total-acceptance`
- `ready-total-mr` 将状态推进到 `total-mr-ready`

当前脚本中不存在：

- `total-mr-ready` 之后的下一条 runtime 命令
- 继续推进到“发布完成”或“MR 已提交”的真实动作入口

### 3.2 runtime 示例

当前 `.harness-runtime/examples/` 中与总收口相关的最高阶段样例为：

- `total-acceptance-payload.example.json`
- `total-mr-ready-payload.example.json`

当前不存在：

- `total-mr-ready` 之后的 payload 示例

### 3.3 现有模型语义

结合总任务收口模型与当前 runtime 设计，`total-mr-ready` 当前更接近：

- `总 MR 已准备完成`

而不是：

- `已发布完成`
- `已完成完整平台集成后的最终发布`

## 4. 验证结论

本次验证结论是：

- 当前 Harness 在现阶段应把 `total-mr-ready` 视为主链路的阶段性终点

也就是说：

- `total-mr-ready` 之后当前并不存在另一条已实现、应被自动推进的 runtime 动作
- 因此这里不是“自动推进缺失”
- 而是“当前系统边界已在此收口”

## 5. 对自动推进语义的影响

当前正确理解应为：

- 收口链路自动推进到 `total-mr-ready`
- 到达 `total-mr-ready` 即完成当前阶段可验证的默认自动收口
- 若未来需要继续往后扩展，应新增新的显式对象、规则与动作入口

当前不应误表述为：

- Harness 已支持 `total-mr-ready` 之后的自动发布
- Harness 已支持真实 MR 平台提交后的自动继续推进

## 6. 后续真正的缺口

当前这一层验证完成后，剩余缺口不再是：

- `total-mr-ready` 之后是否还能自动继续

而变为：

- 是否要定义 `total-mr-ready` 之后的新阶段对象
- 是否要接入真实 MR 平台动作
- 是否要接入完整发布前 / 发布后动作

这些都属于下一阶段新增能力，而不是当前能力缺失。

## 7. 结论摘要

本次验证说明：

- 当前 Harness 已能把总收口自动推进到 `total-mr-ready`
- `total-mr-ready` 在当前体系内应被视为阶段性终点
- 后续若要再往后走，需要新增新的正式阶段，而不是把当前阶段误判为未完成
