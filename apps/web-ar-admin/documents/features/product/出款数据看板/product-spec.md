---
title: 出款数据看板 Product Spec
type: feature
status: stable
author: hermes
owner: cole
created: 2026-04-10
updated: 2026-04-10
audience: human, ai-agent
---

# 1. 目标

建设“出款数据看板”能力，覆盖看板统计、员工实时状态、当前提现订单三个子域，并保证筛选口径与联动一致性。

# 2. 范围

## 2.1 包含

- 三个 Tab 的数据展示与筛选
- 单条/批量操作后统计与列表联动
- 数据源可观测（MOCK/API）

## 2.2 不包含

- 后端未提供接口的服务端实现
- 非出款数据看板业务域页面改造

# 3. 业务口径与交互基线

- 商户筛选为全局筛选，必须同时作用于统计与列表。
- 操作后必须联动刷新“统计卡片 + 列表”。
- 状态/类型字段优先走全局字典，开发期可 fallback。

# 4. 待确认/已确认问题

- 详见：`api-contract.md` 与 `decisions.md`

# 5. 关联文档

- `technical-design.md`
- `test-plan.md`
- `api-contract.md`
- `mock-strategy.md`
- `decisions.md`
- `handover.md`

# 6. 结论

本需求以“筛选口径一致 + 操作后统计与列表联动”为验收主线，按三大 Tab 分区推进并持续收口到交接文档。
