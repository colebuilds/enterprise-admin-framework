---
title: 出款数据看板 Decisions
type: decision
status: stable
author: hermes
owner: cole
created: 2026-04-10
updated: 2026-04-10
audience: human, ai-agent
---

# 1. 目标

记录出款数据看板需求推进过程中的关键决策，确保后续实现与联调保持一致。

# 2. 范围

- 本需求域内的数据模型、mock 策略、筛选口径与联动规则决策
- 不覆盖跨模块通用规范正文

# 3. 关联

- `product-spec.md`
- `technical-design.md`
- `api-contract.md`
- `mock-strategy.md`
- `handover.md`

# 4. 结论

当前决策集已覆盖实现主路径，可作为后续迭代与回归的基线。

# 决策记录

## D-001 页面层与后端 DTO 解耦

- 决策：页面只依赖 VM；DTO 映射集中在 adapter。
- 原因：减少后端字段波动对页面影响。

## D-002 联调阶段优先高保真 mock

- 决策：后端未齐接口使用 mock fallback 打通链路。
- 原因：先保证流程可用与联动一致。

## D-003 数据源可观测

- 决策：页面顶部明确显示 MOCK/API 并提供本地切换提示。
- 原因：降低联调阶段认知误差。

## D-004 全局筛选口径一致

- 决策：商户筛选必须同时作用于统计与列表。
- 原因：防止页面“看起来不一致”。
