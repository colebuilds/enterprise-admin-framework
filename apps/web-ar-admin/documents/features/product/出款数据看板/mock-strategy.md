---
title: 出款数据看板 Mock Strategy
type: guide
status: stable
author: hermes
owner: cole
created: 2026-04-10
updated: 2026-04-11
audience: human, ai-agent
---

# 1. 目标

定义“出款数据看板”在全局 mock 规范下的领域落地策略。

# 2. 领域策略

- 本需求遵循全局三态模式：mock-full / api-bridge / api-full。
- 本需求当前推荐阶段：api-bridge（接口部分齐套阶段）。
- 页面侧仅通过 dashboard gateway 访问数据，禁止页面层混源。

# 3. 本域高保真关注点

- 全局商户筛选（tenantIds）作用于统计与列表
- 单条/批量操作后统计与列表联动刷新
- 预警、员工、订单三个子域保持口径一致

# 4. 本域可观测关注点

- 展示当前模式
- 展示本域总量统计（total/real/mock/bridge）
- 能定位单接口 source 与 reason

# 5. 全局方案引用

- 全局规范：`../../../standards/api/FE-API-005-接口Mock与联调协作规范.md`
- 可观测规范：`../../../standards/api/FE-API-006-接口数据源可观测与覆盖统计规范.md`
- 模块接入指南：`../../../guides/integration/Mock可观测方案模块接入指南.md`

# 6. 范围

- 仅定义“出款数据看板域”对全局方案的落地约束。
- 不再在本目录重复维护全局方案正文。
