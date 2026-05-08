---
title: 出款数据看板 API Contract
type: design
status: stable
author: hermes
owner: cole
created: 2026-04-10
updated: 2026-04-11
audience: human, ai-agent
---

# 0. 目标

沉淀看板域接口契约与映射边界，支撑三态模式联调。

# 1. 能力项统计

- 总量：8
- 已可复用真实接口：5
- bridge/mock 补位：3

# 2. 已复用真实接口

- workAction
- assignOrder
- getMyAuditOrderList（占位映射）
- withdrawOrderGetPageList
- getStaffUserSelectList
- getSysUserWorkDetail（统计占位映射）

# 3. 缺口/弱映射能力

1. 风控预警分页（缺口）
2. 异常解除（缺口）
3. 员工实时状态分页（弱映射，待齐套）

# 4. 字段与口径约束

- 页面仅依赖 VM；DTO -> VM 映射仅在 adapter 完成。
- api-bridge 下由 gateway 输出统一领域态，禁止页面层混源。
- 时间字段统一复用 `src/utils/dateUtil.ts`。

# 5. 关联文档

- `api-inventory.md`
- `technical-design.md`
- `mock-strategy.md`
- `test-plan.md`

# 6. 结论

当前契约可支撑“先方案评审、后分阶段开发”，并具备向 api-full 演进路径。
